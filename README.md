# createdbykujo

My personal site + side-hustle storefront, a glassmorphic, intentionally-unconventional single-page site. Built from scratch with HTML, CSS, and TypeScript, backed by a small secure Express API for the contact form.

## Stack
- **HTML**, `index.html` (semantic, with a strict Content-Security-Policy meta tag)
- **CSS**, `css/styles.css` (glassmorphism, aurora blobs, glitch text, tilt cards, scroll reveals)
- **TypeScript (front-end)**, `src/main.ts` → compiles to `js/main.js`
- **TypeScript (backend)**, `server/server.ts` (Express contact API)

## Run it

```bash
npm install            # install dependencies
npm run build          # compile front-end TS -> js/
cp server/.env.example server/.env   # then fill in your values
npm run server         # builds + starts the backend on :3000
```

Then open http://localhost:3000. With no SMTP configured, submissions are logged to the console (so you don't lose leads while testing). Add SMTP creds in `.env` to actually receive emails.

> The contact form posts to [Web3Forms](https://web3forms.com), so it works on static hosting with no backend running. Put your access key in the `access_key` hidden input in `index.html` (replace `YOUR_WEB3FORMS_ACCESS_KEY`). On success the form is swapped for a confirmation message; on failure it shows an error asking the visitor to email directly.

## Security measures (already wired in)
- **CSP** on both the page (meta tag) and the server (helmet), locks resources to same-origin.
- **Helmet** security headers, **CORS** restricted to your origin only.
- **Rate limiting**, 5 contact submissions per IP / 15 min.
- **Input validation + sanitization** on both client and server; control chars stripped, lengths capped.
- **Honeypot** field to silently drop bots.
- **Body size cap** (12 KB) to blunt DoS attempts.
- **XSS-safe**: user input is escaped before any DOM use; generic error responses never leak internals.
- `.env` is git-ignored, never commit secrets.

## Customize
- Swap logos in `assets/` (variants live in `logos/`).
- Edit copy/pricing directly in `index.html`.
- Replace the placeholder cards in the **work** section with real projects.
- Tweak the palette via the CSS variables at the top of `styles.css`.
