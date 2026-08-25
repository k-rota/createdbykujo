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

## Needs your decision (not missing content — a real finding)

- [ ] **NEEDS DECISION** — The final privacy/terms copy uses
      `kujo@createdbykujo.dev` as the contact/data-request address (3
      places: "Who this is," "What you can ask for," both footer lines).
      Confirmed via DNS (two resolvers) that `createdbykujo.dev` has
      **no MX record** — it cannot receive email at all. `createdbykujo.com`
      is the domain actually wired to your Workspace inbox. Shipped the
      copy verbatim as instructed, but a real privacy/deletion request
      sent to that address right now goes nowhere. Fix is either: change
      the address in both pages to `.com`, or actually stand up mail on
      `.dev` (see DNS item below) — your call, not mine to silently pick.

## Content needed from you (still blocked)

- [ ] **BLOCKED** — Real client project slot (`index.html`, "built for
      businesses like yours" section) — commented out. Need: screenshot,
      business name, one-line description, live link, optional quote.
- [ ] **BLOCKED** — Phone number (`index.html`, contact section) —
      commented out. Need the real number, e.g. `tel:+12481234567`.
- [ ] **BLOCKED** — OG preview image — `assets/og-image.png`, 1200x630
      PNG, doesn't exist yet. You said you'd create/upload it yourself.
- [ ] **BLOCKED** — JSON-LD `telephone` field — omitted from the
      structured data in `index.html`. Add once the phone number above
      is real (same blocker as above).

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
      no DMARC. Decide where mail should actually live, then DNS needs
      to match wherever the Web3Forms dashboard is configured to send —
      this is now the same underlying issue as the privacy/terms email
      address above, not a separate problem.
- [ ] **BLOCKED** — Neither domain publishes DMARC. Not currently
      blocking anything (no policy = no enforcement), but adding
      `_dmarc.createdbykujo.com` with at least `v=DMARC1; p=none;` would
      be a reasonable deliverability improvement. Flagging, not doing,
      since it's DNS and needs your go-ahead.
