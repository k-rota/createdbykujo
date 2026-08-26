/* ============================================================
   createdbykujo, front-end interactions (TypeScript)
   ============================================================ */

/* ---------- footer year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- mobile menu ---------- */
const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const links = document.querySelector<HTMLElement>(".nav-links");
toggle?.addEventListener("click", () => {
  const open = links?.classList.toggle("open") ?? false;
  toggle.setAttribute("aria-expanded", String(open));
});
links?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  })
);

/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
  io.observe(el);
});

/* ---------- cursor glow ---------- */
const glow = document.querySelector<HTMLElement>(".cursor-glow");
if (glow && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (ev) => {
    glow.style.opacity = "1";
    glow.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px)`;
  });
}

/* ---------- 3D tilt on cards ---------- */
const tiltEls = document.querySelectorAll<HTMLElement>(".tilt");
tiltEls.forEach((el) => {
  el.addEventListener("pointermove", (ev) => {
    const r = el.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width - 0.5;
    const py = (ev.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
  });
  el.addEventListener("pointerleave", () => {
    el.style.transform = "";
  });
});

/* ---------- pricing -> contact plan autofill ---------- */
const planSelect = document.getElementById("plan") as HTMLSelectElement | null;
document.querySelectorAll<HTMLAnchorElement>("[data-plan]").forEach((el) => {
  el.addEventListener("click", () => {
    const plan = el.dataset.plan ?? "";
    if (planSelect && plan) {
      planSelect.value = plan;
      planSelect.classList.add("just-set");
      window.setTimeout(() => planSelect.classList.remove("just-set"), 1200);
    }
  });
});

/* ---------- contact form ---------- */
interface Fields {
  name: string;
  email: string;
  message: string;
  plan: string;
  company: string; // honeypot
}

const form = document.getElementById("contact-form") as HTMLFormElement | null;
const statusEl = form?.querySelector<HTMLElement>(".form-status") ?? null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Escape user text before reflecting it anywhere in the DOM (XSS safety). */
function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim();
}

function showError(name: string, msg: string): void {
  const field = form?.querySelector(`[name="${name}"]`)?.closest(".field");
  const err = form?.querySelector<HTMLElement>(`.err[data-for="${name}"]`);
  field?.classList.toggle("invalid", Boolean(msg));
  if (err) err.textContent = msg;
}

function validate(data: Fields): boolean {
  let ok = true;
  if (data.name.length < 2) { showError("name", "Tell me your name"); ok = false; }
  else showError("name", "");

  if (!EMAIL_RE.test(data.email)) { showError("email", "Enter a valid email"); ok = false; }
  else showError("email", "");

  if (data.message.length < 10) { showError("message", "A few more details, please"); ok = false; }
  else showError("message", "");

  return ok;
}

function setStatus(msg: string, kind: "ok" | "bad" | ""): void {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.className = `form-status ${kind}`;
}

const successEl = document.getElementById("contact-success");

form?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const fd = new FormData(form);
  const data: Fields = {
    name: sanitize(String(fd.get("name") ?? "")),
    email: sanitize(String(fd.get("email") ?? "")),
    message: sanitize(String(fd.get("message") ?? "")),
    plan: sanitize(String(fd.get("plan") ?? "")),
    company: String(fd.get("company") ?? ""), // honeypot, not sanitized/used
  };

  // honeypot tripped -> silently drop
  if (data.company) { return; }

  if (!validate(data)) { setStatus("Fix the highlighted fields above.", "bad"); return; }

  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
  setStatus("", "");

  try {
    const res = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    // Web3Forms answers 200 with { success: false } when it rejects a
    // submission, so res.ok on its own would report a false success.
    let body: { success?: boolean } | null = null;
    try { body = await res.json(); } catch { /* non-JSON response */ }
    if (!res.ok || !body?.success) {
      console.error("Contact form submission rejected", { status: res.status, body });
      throw new Error(`status ${res.status}${body ? `, success=${body.success}` : ""}`);
    }
    form.hidden = true;
    if (successEl) successEl.hidden = false;
  } catch (err) {
    console.error("Contact form error:", err);
    setStatus("Something went wrong sending that — please email me directly at kujo@createdbykujo.com.", "bad");
    if (btn) { btn.disabled = false; btn.textContent = "Send it →"; }
  }
});

export {};
