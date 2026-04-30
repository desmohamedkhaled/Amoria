# Amoria — Static Storefront

Small static storefront built with plain HTML, CSS and vanilla JavaScript.

## Files
- `index.html` — main page
- `style.css` — styling
- `script.js` — client-side behavior (cart, quick view, WhatsApp links)
- `logo.jpeg` — current logo image (place a transparent PNG here if you want no background)

## Run locally
1. Open `index.html` directly in the browser for quick preview.
2. Or run a simple local server (recommended for consistent behaviour):

```bash
cd e:/amoria
python -m http.server 8000
# then open http://localhost:8000
```

## Replace logo (transparent background)
- To change the logo, replace the file `logo.jpeg` with your image named `logo.png` or `logo.webp` (transparent PNG/WebP recommended).
- Logo files live in the project root. The header/footer reference `logo.png`/`logo.jpeg` in `index.html`.

If your logo currently has a solid background (JPEG), create a transparent PNG using an image editor (Photoshop, GIMP) or an online tool and save it as `logo.png`.

## Notes
- No build step or dependencies required — static site.
- Cart actions open WhatsApp; edit `WHATSAPP_NUMBER` in `script.js` to change the phone number.

## Contact
If you want changes (logo sizing, different placement, or export help), tell me what you want and I will update the files.
