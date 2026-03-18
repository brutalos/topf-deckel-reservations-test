#!/usr/bin/env python3
"""generate_image.py — OpenCode-callable script to generate images via Gemini.

Standalone — no backend import needed. Reads GOOGLE_GENERATIVE_AI_API_KEY from env.

Usage:
  python .agent/skills/image-generator/scripts/generate_image.py \
    --prompt "Wagyu steak on white plate, studio lighting" \
    --filename "wagyu-steak" \
    --aspect-ratio "1:1"

Output: JSON with path, filename, model, aspect_ratio, markdown
"""
import argparse
import json
import os
import re
import sys
from pathlib import Path

IMAGE_MODEL = "gemini-3.1-flash-image-preview"

# ── 1. Parse args ───────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Generate an image via Gemini")
parser.add_argument("--prompt", required=True, help="Detailed image description")
parser.add_argument("--filename", default="", help="Output filename base (no extension)")
parser.add_argument("--aspect-ratio", default="1:1",
                    choices=["1:1", "16:9", "9:16", "4:3", "3:4"],
                    help="Image aspect ratio (default: 1:1)")
parser.add_argument("--project-dir", default="",
                    help="Project root dir (default: current working directory)")
args = parser.parse_args()

project_dir = Path(args.project_dir).resolve() if args.project_dir else Path.cwd().resolve()

# ── 2. Resolve API key (try multiple env var names) ─────────────────────────
api_key = (
    os.environ.get("GOOGLE_GENERATIVE_AI_API_KEY")
    or os.environ.get("GEMINI_API_KEY")
    or os.environ.get("GOOGLE_API_KEY")
)

# If not in env, try loading from backend .env (when running on host)
if not api_key:
    def _find_env_file() -> Path | None:
        check = Path.cwd()
        for _ in range(12):
            for candidate in [check / "backend" / ".env", check / ".env"]:
                if candidate.exists():
                    return candidate
            check = check.parent
        return None
    env_file = _find_env_file()
    if env_file:
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                k = k.strip()
                if k in ("GOOGLE_GENERATIVE_AI_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY"):
                    api_key = v.strip().strip('"').strip("'")
                    break

if not api_key:
    print(json.dumps({"error": "No Gemini API key found. Set GOOGLE_GENERATIVE_AI_API_KEY env var."}))
    sys.exit(1)

# ── 3. Generate ─────────────────────────────────────────────────────────────
def _slugify(text: str, max_len: int = 40) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug[:max_len]

def _generate() -> bytes | None:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_level="MINIMAL"),
        image_config=types.ImageConfig(aspect_ratio=args.aspect_ratio, image_size="1K"),
        response_modalities=["IMAGE"],
    )
    contents = [types.Content(role="user", parts=[types.Part.from_text(text=args.prompt)])]
    for chunk in client.models.generate_content_stream(
        model=IMAGE_MODEL, contents=contents, config=config
    ):
        if chunk.parts and chunk.parts[0].inline_data and chunk.parts[0].inline_data.data:
            return chunk.parts[0].inline_data.data
    return None

def main() -> None:
    base_name = _slugify(args.filename) if args.filename else _slugify(args.prompt)
    if not base_name:
        base_name = "generated"

    images_dir = project_dir / "public" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    raw_bytes = _generate()
    if not raw_bytes:
        print(json.dumps({"error": "No image generated (blocked by safety filters or API error)"}))
        sys.exit(1)

    out_name = f"{base_name}.png"
    out_path = images_dir / out_name
    counter = 1
    while out_path.exists() and out_path.stat().st_size > 1024:
        out_name = f"{base_name}-{counter}.png"
        out_path = images_dir / out_name
        counter += 1

    out_path.write_bytes(raw_bytes)
    print(json.dumps({
        "status": "generated",
        "path": f"/images/{out_name}",
        "filename": out_name,
        "model": IMAGE_MODEL,
        "aspect_ratio": args.aspect_ratio,
        "markdown": f"![{base_name}](/images/{out_name})",
    }, indent=2))


if __name__ == "__main__":
    main()
