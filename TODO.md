# Outstanding items

Local status tracker. Statuses: `DONE` (shipped + pushed, commit noted),
`BLOCKED` (needs something from you — content, a dashboard check, or a
decision — before I can act), `NEEDS DECISION` (a real finding, not missing
content — your call on how to handle it).

## Done

- [x] **DONE** — Privacy policy content (`privacy.html`). Final verbatim
      copy shipped in a two-column layout (legal text + "in short" gloss).
      Commit `d922e0c`.
- [x] **DONE** — Terms of service content (`terms.html`). Same commit,
      same layout, plus the hiring-agreement callout box. Commit `d922e0c`.
- [x] **DONE** — Tier "Finally": 375px mobile pass. No live browser
      available, so this was a CSS-based audit (box math on flex/grid
      breakpoints, `clamp()` floors, tap-target sizing), not a visual
      screenshot check — flagging that distinction in case you want a
      real-device spot-check later. Found and fixed three real issues:
      the hamburger button's actual tap area was ~26x16px (added padding
      + offsetting negative margin, no visual change), the open mobile
      menu's nav links had no vertical padding (added, carefully scoped
      with `:not(.nav-cta)` so it didn't clobber the "hire me" button's
      own padding via a specificity collision), and the hero stat labels
      (e.g. "no templates") could word-wrap mid-phrase at narrow widths
      (fixed so the row wraps instead of the text breaking). Commit
      `760f859`.
- [x] **DONE** — Legal-page contact email fixed to `kujo@createdbykujo.com`
      in both `privacy.html` and `terms.html` (you confirmed `.com` is
      correct). Domain-name references — meta description, canonical URL,
      "Effective ... Applies to createdbykujo.dev", "createdbykujo.dev is
      operated by" — correctly left as `.dev` since that's the real site
      domain; only the `mailto:` addresses changed. Commit `a8d4af1`.
- [x] **DONE** — Architecture + copy pass. The site now commits to being
      a business storefront instead of a personal-portfolio/storefront
      hybrid. Section 01 became "who you're working with" (degree line
      and tech-stack chips removed, the five build steps promoted into
      their place); geographic targeting came out of all marketing copy
      while the legal geo strings in `terms.html` were preserved (the
      venue clause needs its county); `templates/portfolio.html` became
      `templates/salon.html` with all nine inbound references updated;
      the four `/work/` demos were reframed as range for a buyer and
      lost their resume content (skill-bar percentages, `skills.json`,
      the tech marquee); and the voice went plainspoken throughout.
      Commits `73a799a` through `a169d7b`.
- [x] **DONE** — Dead code removed: `templates/base.css`, the inert
      `.t-*` body classes, `imgs/`, the `[data-count]` animation, the
      unexplained CSP script hash, the `.cbk-badge` rules in all ten
      demo stylesheets, and the `frame-ancestors` directive in every
      meta CSP (inert there, and already delivered by `_headers`).
- [x] **DONE** — Two real bugs fixed. `src/main.ts` had drifted *behind*
      its own compiled `js/main.js`: the artifact checked the Web3Forms
      response body for `success`, the source only checked `res.ok`.
      Since Web3Forms answers 200 with `success:false` on rejection, a
      rebuild would have shipped a form that showed "Got it." while the
      message went nowhere. Logic ported back into the TypeScript, and
      both paths verified in a browser. Also fixed the submit button
      losing its arrow ("Send it" vs "Send it →") after a failed send.
- [x] **DONE** — Second 375px mobile pass, this time in a real browser
      (the earlier one was CSS-only). Confirmed no horizontal scroll,
      no mid-phrase wrapping in the rebuilt hero stat row, and fixed
      three footer links that were 20px tall, under the 24px minimum
      tap target. Commit `c994621`.

## Content needed from you (still blocked)

- [ ] **BLOCKED** — Real client project slot (`index.html`, "built for
      your needs" section) — commented out. Need: screenshot, business
      name, one-line description, live link, optional quote.
- [ ] **BLOCKED** — Phone number (`index.html`, contact section) —
      commented out. Need the real number, e.g. `tel:+12481234567`.
- [ ] **BLOCKED** — OG preview image — `assets/og-image.png`, 1200x630
      PNG, doesn't exist yet. You said you'd create/upload it yourself.
- [ ] **BLOCKED** — JSON-LD `telephone` field — omitted from the
      structured data in `index.html`. Add once the phone number above
      is real (same blocker as above).

## Your call

- [ ] **NEEDS DECISION** — The word "template" now contradicts the
      homepage. The hero sells "100% custom code" and the meta
      description says "No templates, no page builders", but every demo
      page still ends with a `template by createdbykujo` byline, the
      cross-links are labelled "More templates", and the `<title>` of
      each is "Example X, template by createdbykujo". The CTA line on
      all six was changed to "This is an example site" as part of the
      copy pass, which made the remaining "template" wording stand out
      more, not less.

      Three options: (a) leave it — the byline is a credit, not a claim
      about what the buyer gets; (b) swap "template" for "example"
      everywhere in the demo chrome, so the whole site says one thing;
      (c) drop "No templates" from the homepage instead and own the word.
      I'd take (b), but it touches every demo page's title and footer, so
      it's your call rather than mine.

- [ ] **NEEDS DECISION** — Local SEO. Removing "Highland" and the county
      names also meant dropping `addressLocality` and `areaServed` from
      the JSON-LD, which were the strongest "web designer near me"
      signals on the site. If local search traffic matters, adding back
      `"areaServed": { "@type": "State", "name": "Michigan" }` keeps some
      signal without naming towns.

## Dashboard / account checks (still blocked — I don't have access)

- [ ] **BLOCKED** — Web3Forms dashboard: confirm what email address the
      current `access_key` (`b5ca369f-7d30-4951-988a-4e3b30dc0ef1`)
      actually sends notifications to — `.com` (working MX/SPF) or `.dev`
      (neither). If it's `.dev`, that's a live delivery bug.
- [ ] **BLOCKED** — Web3Forms dashboard: submit a real test through the
      live form, confirm it appears there.
- [ ] **BLOCKED** — Google Workspace inbox (`kujo@createdbykujo.com`):
      confirm the test submission lands, check Spam, check filters.
- [ ] **BLOCKED** — Cloudflare: Email Address Obfuscation (Scrape
      Shield) — confirmed live on production, rewrites the `mailto:`
      link and masks the address. Recommend turning off; the source
      already has a clean fallback and Cloudflare's rewrite only adds
      fragility (breaks under no-JS, and would break the new contact-form
      error-state fallback text too).
- [ ] **BLOCKED** — Cloudflare: Bot Fight Mode / WAF rules — confirmed a
      bot "challenge platform" script is actively injected on the zone;
      no evidence it interferes with the contact form, but worth a look
      since it's live and I can't see the dashboard config behind it.

## DNS decision needed (still blocked — your call + DNS access)

- [ ] **BLOCKED** — `createdbykujo.dev` has no MX, no SPF, no DMARC —
      can't receive mail at all. `createdbykujo.com` has working MX+SPF,
      no DMARC. Since you've confirmed `.com` is the real contact address
      (site copy now matches), this is mostly a "leave `.dev` mail-less on
      purpose" non-issue — the one open question left is the Web3Forms
      dashboard item above: confirm that access key actually notifies the
      `.com` address, not `.dev`.
- [ ] **BLOCKED** — Neither domain publishes DMARC. Not currently
      blocking anything (no policy = no enforcement), but adding
      `_dmarc.createdbykujo.com` with at least `v=DMARC1; p=none;` would
      be a reasonable deliverability improvement. Flagging, not doing,
      since it's DNS and needs your go-ahead.
