# תכלית – דף נחיתה

Landing page for **Tachlit (תכלית)** — a personal pre-military coaching service by Nehorai Tadlis, helping Israeli youth prepare for meaningful IDF service.

## Stack

Plain HTML / CSS / JS — no framework, no build step. Deploy anywhere.

## Structure

```
├── index.html          # Main landing page (16 sections, fully RTL Hebrew)
├── privacy.html        # Privacy policy (placeholder)
├── terms.html          # Terms of service (placeholder)
├── accessibility.html  # Accessibility statement (placeholder)
├── css/
│   └── styles.css      # All styles, mobile-first, CSS custom properties
├── js/
│   └── main.js         # Accordion, carousel, form validation, scroll effects, analytics hooks
└── assets/
    ├── tachlit-colorful-logo.png
    └── tachlit-white-logo.png
```

## Before Going Live

Search for `PLACEHOLDER` across all files. Items to replace:

| What | Where |
|------|-------|
| Formspree form ID | `index.html` → form `action` attribute |
| Nehorai's photo | `index.html` → hero + about sections |
| Real testimonials | `index.html` → testimonials section |
| WhatsApp number | `index.html` → footer + structured data |
| Phone number | `index.html` → footer + structured data |
| Instagram link | `index.html` → footer |
| Canonical URL | `index.html` → `<link rel="canonical">` + OG tags |
| OG image (1200x630) | `index.html` → `og:image` meta tag |
| Privacy policy text | `privacy.html` |
| Terms of service text | `terms.html` |
| Accessibility statement | `accessibility.html` |

## Deploy

Static files — drag and drop to Netlify, Vercel, GitHub Pages, or any web host.
