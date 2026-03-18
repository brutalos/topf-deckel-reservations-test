---
name: image-validator
description: Validates that images in generated websites are not broken. Checks URLs, flags placeholders, suggests reliable alternatives.
triggers:
  - check images
  - validate images
  - broken images
  - image check
  - verify images
  - fix images
  - images not loading
  - build website
  - create website
  - website images
invocation: auto
---

# Image Validator

After generating or editing any website code, you MUST validate all images. Broken images are the #1 visual defect in generated websites.

## Validation Checklist

### 1. Check Every `<img>` Tag

For each image in the generated code:
- Does the `src` attribute point to a valid, accessible URL?
- Is the URL a permanent link (not a random/dynamic URL)?
- Does the image actually exist at that URL?

### 2. Forbidden Image Patterns (ALWAYS BROKEN)

These URL patterns look valid but frequently break. **NEVER use them:**

| Pattern | Why It Breaks |
|---------|--------------|
| `https://source.unsplash.com/random/...` | Deprecated API, returns 403 |
| `https://unsplash.com/photos/...` | HTML page, not an image |
| `https://images.unsplash.com/photo-...` without params | May be rate-limited |
| `https://via.placeholder.com/...` | Unreliable, often slow/down |
| `https://placekitten.com/...` | Unreliable third-party |
| `https://picsum.photos/...` | Random images, not consistent |
| Any URL with `random` in the path | Non-deterministic, may 404 |

### 3. Recommended Image Sources

**Best: Local assets**
```html
<!-- Store images in public/ directory -->
<img src="/images/hero.jpg" alt="Hero banner" />
```

**Good: Verified permanent Unsplash URLs**
```html
<!-- Use specific photo IDs with imgix params -->
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop" alt="Salon interior" />
```
- Always include `?w=WIDTH&h=HEIGHT&fit=crop` params
- Use a SPECIFIC photo ID (not random)
- Test the URL in a browser before using

**Acceptable: SVG placeholders (for development)**
```html
<!-- Inline SVG placeholder with text -->
<div style="width:800px;height:400px;background:#e2e8f0;display:flex;align-items:center;justify-content:center;border-radius:8px;">
  <span style="color:#94a3b8;font-size:14px;">Hero Image (800×400)</span>
</div>
```

### 4. Always Add Error Handling

Every `<img>` tag should have an `onerror` fallback:

```html
<img 
  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&fit=crop" 
  alt="Salon interior"
  onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\'padding:40px;text-align:center;background:#f1f5f9;border-radius:8px;color:#94a3b8\'>Image unavailable</div>'"
/>
```

For React components:
```jsx
const [imgError, setImgError] = useState(false);

{imgError ? (
  <div className="bg-slate-100 rounded-lg p-10 text-center text-slate-400">
    Image unavailable
  </div>
) : (
  <img 
    src={imageUrl} 
    alt={altText}
    onError={() => setImgError(true)}
  />
)}
```

### 5. Alt Text Requirements

- Every `<img>` MUST have a descriptive `alt` attribute
- Never use `alt=""` for content images (only for decorative)
- Never use `alt="image"` or `alt="photo"` — be specific
- Example: `alt="Modern hair salon interior with styling stations"` ✓

## Post-Build Validation Steps

After generating website code:
1. List all `<img>` tags and their `src` values
2. Flag any URLs matching forbidden patterns
3. Verify remaining URLs are specific (not random/dynamic)
4. Confirm all images have meaningful `alt` text
5. Confirm `onerror` fallbacks are in place
6. If using external URLs, test at least one to confirm it loads
