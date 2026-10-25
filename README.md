# devanghacks.in

Personal site of Devang Solanki — security research, tools, bug bounty disclosures and CTF writeups. Live at **[devanghacks.in](https://devanghacks.in)**.

Hand-written static HTML/CSS/JS. No framework, no build step.

## Features

- **Terminal / editorial-brutalist theme** with a light and a dark palette and an animated day/night switch (follows the OS setting until toggled)
- **Custom cursor** — blinking block caret with context labels (`read`, `open ↗`, `copy`…), desktop mouse only
- **Keyboard shortcuts** — `D` home, `B` blogs, `T` tools
- **Unified writing index** on `blogs.html` with search and type filters (blog / bug bounty / writeup)
- **Hacked-404 easter egg** — a fake live intrusion that turns out to be a 404, with a typeable terminal (try `help`)
- **Performance** — self-hosted variable fonts with preload and metric-matched fallbacks, lazy-loaded article images; Lighthouse 100 on mobile and desktop
- **SEO** — canonical URLs, Open Graph / Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`

## Structure

```
├── index.html                 # Home: intro, experience, arsenal, latest writing
├── blogs.html                 # All writing (blogs, bug bounty, writeups) with filters
├── tools.html                 # Tools / arsenal
├── 404.html                   # Hacked-404 easter egg (served by GitHub Pages for any missing URL)
├── blogs/                     # Blog posts
├── bugbounty/                 # Bug bounty write-ups
├── writeups/                  # CTF writeups
├── writeups.html, bugbounty.html   # Old listing URLs — noindex redirects to blogs.html
├── assets/
│   ├── css/custom.css         # All styles + theme tokens
│   ├── js/main.js             # Shared behaviour (nav, theme switch, cursor, filters, copy buttons)
│   ├── fonts/                 # Space Grotesk + JetBrains Mono (latin, woff2)
│   └── images/                # Article images, OG image, theme-switch art
├── logo/                      # Company logos used on the home page
├── varunastra/, agneyastra/   # Files hosted for those tools — keep the paths stable
├── sitemap.xml, robots.txt, CNAME, favicon.svg, apple-touch-icon.png
└── design/                    # Design reference screenshots (not linked from the site)
```

## Local development

Some paths are root-absolute (`/assets/...`), so serve the folder instead of opening files directly:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Adding a post

1. Copy an existing article (e.g. `blogs/saml-101.html`) and update the title, meta description, canonical / `og:url`, date and body.
2. Add a row to `blogs.html` with the right `data-type` (`blog`, `bugbounty` or `writeup`) and bump the count on that filter pill.
3. Optionally list it under *Latest writing* in `index.html`.
4. Add the URL to `sitemap.xml`.

## Theming

Colours are CSS custom properties at the top of `assets/css/custom.css` — `:root` for dark, `:root[data-theme="light"]` for light (`--bg`, `--ink`, `--muted`, `--faint`, `--accent`, `--accent-text`, …).

## Deployment

GitHub Pages from the **`gh-pages`** branch, custom domain via `CNAME`. Push to `gh-pages` and it's live in a minute or two.

## License

MIT
