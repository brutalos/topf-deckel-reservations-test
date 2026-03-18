---
name: use-attached-image
description: How to use an image the user attached in the OpenCode chat. Use this skill IMMEDIATELY when the user attaches an image and wants it on the website.
triggers:
  - image
  - attached image
  - use this image
  - use the image
  - this photo
  - use this photo
  - homepage image
  - hero image
  - background image
  - logo image
  - upload image
  - attached photo
---
# use-attached-image

The user has attached an image in this chat. OpenCode stores all message attachments as **base64 data URLs** in its SQLite database at `/root/.local/share/opencode/opencode.db` in the `part` table.

## Step 1: Extract the image from OpenCode's database

Run this Python script to decode and save the most recently attached image:

```bash
python3 -c "
import sqlite3, json, base64, os

db = sqlite3.connect('/root/.local/share/opencode/opencode.db')
rows = db.execute('SELECT data FROM part ORDER BY rowid DESC LIMIT 100').fetchall()

saved = None
for r in rows:
    try:
        j = json.loads(r[0])
        if j.get('type') == 'file' and j.get('mime', '').startswith('image/'):
            url = j['url']
            b64 = url.split(',', 1)[1]
            img_bytes = base64.b64decode(b64)
            fname = j.get('filename', 'uploaded.jpg')
            os.makedirs('/app/public/images', exist_ok=True)
            out = '/app/public/images/' + fname
            with open(out, 'wb') as f:
                f.write(img_bytes)
            print('Saved:', out, len(img_bytes), 'bytes')
            saved = out
            break
    except Exception as e:
        pass

if not saved:
    print('No image found in database')
db.close()
"
```

## Step 2: Rename to a meaningful filename

```bash
mv /app/public/images/<original-filename> /app/public/images/<descriptive-name>.jpg
```

Choose a filename that reflects the intended use: `hero.jpg`, `owner.jpg`, `team.jpg`, `background.jpg`, `logo.png`.

## Step 3: Use it in the website code

Edit the relevant component:

```tsx
<img src="/images/<descriptive-name>.jpg" alt="<description>" className="..." />
```

Or as CSS background:

```css
background-image: url('/images/<descriptive-name>.jpg');
```

## Rules

- **NEVER reference `/root/` or `/tmp/` paths** — those are not served by Next.js
- **Always save to `/app/public/images/`** — Next.js serves `public/` as web root
- You can **see the image** in this chat — use that to write a good alt text and choose the right component/section to update
- The script returns the most recently attached image. If multiple images were attached, run it again without `break` to get all of them
