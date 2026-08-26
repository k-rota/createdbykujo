# createdbykujo

A storefront for a one-person web-design business: it sells custom websites to small businesses, with pricing, worked examples, and a contact form. Built from scratch with HTML, CSS, and TypeScript. Fully static, no backend to run.

## Stack
- **HTML**, one file per page, no framework or templating (semantic, each with a strict Content-Security-Policy meta tag)
- **CSS**, `css/styles.css` for the main site (editorial cream-and-forest-green palette, aurora blobs, tilt cards, scroll reveals); each demo page carries its own standalone stylesheet
- **TypeScript (front-end)**, `src/main.ts` → compiles to `js/main.js`

## Layout

| Path | What it is |
|---|---|
| `index.html` | The storefront: hero, who you're working with, pricing, examples, contact |
| `privacy.html`, `terms.html` | Legal pages |
| `templates/` | Six worked examples, each a fictional "Example" business (cafe, gym, bar, photography, restaurant, salon) |
| `work/` | Four demos of the same site in very different visual styles, shown as range for a buyer |

## Run it

```bash
npm install      # install dev dependencies (just TypeScript)
npm run build    # compile front-end TS -> js/
```

`js/main.js` is committed, so **rebuild and commit it whenever you change `src/main.ts`** or the deployed site keeps running the old code.

Then open `index.html` directly, or serve the folder with any static server. Deploys as-is to static hosts like Cloudflare Pages, Netlify, or GitHub Pages, no server process required.

## Contact form

The form posts to [Web3Forms](https://web3forms.com), a static-friendly form-to-email service, so it works without any backend. The access key lives in the `access_key` hidden input in `index.html`. The Web3Forms access key is a publishable key, it's safe to commit and ship in client-side HTML; it can only submit the form, not read submissions or touch your account.

Web3Forms answers with HTTP 200 and `{ "success": false }` when it rejects a submission, so `main.ts` checks the response body, not just the status. On success the form is swapped for a confirmation message; on failure it shows an error asking the visitor to email directly.

## Security measures
- **CSP** meta tag locks resources to same-origin; only Google Fonts and Web3Forms are allowed as third-party origins (`connect-src` / `form-action`).
- **`_headers`** carries the directives a `<meta>` CSP cannot deliver: `frame-ancestors 'none'`, HSTS, `nosniff`, Permissions-Policy, COOP/CORP. Don't add those to the meta tag; browsers ignore them there.
- **No inline scripts or styles** (no `unsafe-inline`), `base-uri 'self'`.
- **Two honeypots** silently drop bots: a hidden `company` text field and the Web3Forms `botcheck` checkbox.
- **Spam + rate limiting** handled by Web3Forms on their end.
- **XSS-safe**: user input is only ever written to the DOM via `textContent`, never as HTML.
- **No secrets in the repo**: there's no server and no SMTP credentials to leak.

## Customize
- Swap logos in `assets/`.
- Edit copy/pricing directly in `index.html`.
- Fill in the real client project: `index.html` has a commented-out `.real-work` block waiting on a screenshot, name, description and live link.
- Tweak the palette via the CSS variables at the top of `css/styles.css`; each demo page has its own variables at the top of its own stylesheet.
