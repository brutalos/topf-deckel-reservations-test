---
name: image-generator
description: "Generate images via AI. Run: python .agent/skills/image-generator/scripts/generate_image.py --prompt \"...\" --filename \"name\" --aspect-ratio \"1:1\". Valid aspect ratios: 1:1 (square), 16:9 (banner), 9:16 (mobile), 4:3 (landscape), 3:4 (portrait). Saves PNG to public/images/."
---

# Image Generator Skill

Generate AI images using the bundled script powered by `gemini-3.1-flash-image-preview`.

## When to Use
- Product photos for e-commerce shops
- Hero banners and section backgrounds
- Category/collection cover images
- Placeholder replacement (any missing visual asset)
- User requests like "generate a new header image" or "create product photos"

## How to Generate Images

Use the bundled script — do NOT try to call `generate_image` as a shell command directly.

```bash
python .agent/skills/image-generator/scripts/generate_image.py \
  --prompt "Detailed image description" \
  --filename "output-filename" \
  --aspect-ratio "1:1"
```

**Arguments:**
- `--prompt` (required) — detailed image description
- `--filename` (optional) — output name without extension (auto-slugified from prompt if omitted)
- `--aspect-ratio` (optional) — `"1:1"` | `"16:9"` | `"9:16"` | `"4:3"` | `"3:4"` (default `"1:1"`)

**Output JSON:**
```json
{
  "status": "generated",
  "path": "/images/filename.png",
  "filename": "filename.png",
  "model": "gemini-3.1-flash-image-preview",
  "aspect_ratio": "1:1",
  "markdown": "![filename](/images/filename.png)"
}
```

**One call per image.** For multiple images, run the script multiple times.

Images are saved to `public/images/` in the current project directory. Use the `path` value in `<img src="...">` tags.

## Prompt Engineering for Product Photography

### Good prompts (specific, styled)
```
"Wagyu beef steak on white ceramic plate, overhead shot, studio lighting, white background, food photography"
"Organic matcha powder in glass jar, minimalist product photography, soft natural light, white background"
"Handmade leather wallet, brown, product photography, studio lighting, white background, high detail"
```

### Bad prompts (vague, will produce poor results)
```
"food image"
"product photo"
"nice looking item"
```

### Prompt template for products
```
"<PRODUCT_NAME>, product photography, white background, studio lighting, high quality"
```

### Prompt template for hero banners
```
"<SCENE_DESCRIPTION>, wide angle, cinematic lighting, 16:9 aspect ratio, high quality"
```

### Prompt template for category images
```
"<CATEGORY_NAME> collection, lifestyle photography, warm lighting, editorial style"
```

## Usage Examples

### Generate product images for seed data
```bash
python .agent/skills/image-generator/scripts/generate_image.py \
  --prompt "Truffle risotto, food photography, overhead shot, white plate, studio lighting" \
  --filename "truffle-risotto"

python .agent/skills/image-generator/scripts/generate_image.py \
  --prompt "Wagyu beef steak, raw, on marble surface, product photography, studio lighting" \
  --filename "wagyu-steak"
```

### Generate a hero banner
```bash
python .agent/skills/image-generator/scripts/generate_image.py \
  --prompt "Modern kitchen interior with warm lighting, fresh ingredients on marble counter, cinematic wide shot" \
  --filename "hero-banner" \
  --aspect-ratio "16:9"
```

### Generate multiple images (run once per image)
```bash
python .agent/skills/image-generator/scripts/generate_image.py \
  --prompt "Artisan coffee beans in burlap sack, product photography" \
  --filename "coffee-beans"

python .agent/skills/image-generator/scripts/generate_image.py \
  --prompt "Artisan coffee beans close-up, dark roast, product photography" \
  --filename "coffee-beans-dark"
```

## Critical Rules
1. **NEVER use external image URLs** — always generate locally via this tool
2. **Be specific in prompts** — include the product name, style, lighting, and background
3. **Use 1:1 for products** — square images work best in product grids
4. **Use 16:9 for banners** — wide images for hero sections
5. **Images are PNG** — saved to `public/images/` with auto-generated filenames
6. **Model** — uses `gemini-3.1-flash-image-preview` via `generate_content_stream` API
7. **Existing real images are skipped** — if a file >1KB with the same name exists, it won't be overwritten. Tiny placeholders (<1KB) ARE replaced.
8. **Show inline** — include the `markdown` field from the result in your reply so the user sees the image in chat
