# createdbykujo

My personal site + side-hustle storefront, a glassmorphic, intentionally-unconventional single-page site. Built from scratch with HTML, CSS, and TypeScript. Fully static, no backend to run.

## Stack
- **HTML**, `index.html` (semantic, with a strict Content-Security-Policy meta tag)
- **CSS**, `css/styles.css` (glassmorphism, aurora blobs, glitch text, tilt cards, scroll reveals)
- **TypeScript (front-end)**, `src/main.ts` → compiles to `js/main.js`

## Run it

```bash
npm install      # install dev dependencies (just TypeScript)
npm run build    # compile front-end TS -> js/
```

Then open `index.html` directly, or serve the folder with any static server. Deploys as-is to static hosts like Cloudflare Pages, Netlify, or GitHub Pages, no server process required.

## Contact form

The form posts to [Web3Forms](https://web3forms.com), a static-friendly form-to-email service, so it works without any backend. Put your access key in the `access_key` hidden input in `index.html` (replace `YOUR_WEB3FORMS_ACCESS_KEY`). The Web3Forms access key is a publishable key, it's safe to commit and ship in client-side HTML; it can only submit the form, not read submissions or touch your account. On success the form is swapped for a confirmation message; on failure it shows an error asking the visitor to email directly.

## Security measures
- **CSP** meta tag locks resources to same-origin; only Google Fonts and Web3Forms are allowed as third-party origins (`connect-src` / `form-action`).
- **No inline scripts or styles** (no `unsafe-inline`), `frame-ancestors 'none'`, `base-uri 'self'`.
- **Two honeypots** silently drop bots: a hidden `company` text field and the Web3Forms `botcheck` checkbox.
- **Spam + rate limiting** handled by Web3Forms on their end.
- **XSS-safe**: user input is only ever written to the DOM via `textContent`, never as HTML.
- **No secrets in the repo**: there's no server and no SMTP credentials to leak.

## Customize
- Swap logos in `assets/` (variants live in `logos/`).
- Edit copy/pricing directly in `index.html`.
- Replace the placeholder cards in the **work** section with real projects.
- Tweak the palette via the CSS variables at the top of `styles.css`.
