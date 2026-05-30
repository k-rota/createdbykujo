"use strict";
/* ============================================================
   createdbykujo, front-end interactions (TypeScript)
   ============================================================ */
/** Endpoint for the contact backend (configure in server/.env / deploy). */
const CONTACT_ENDPOINT = "/api/contact";
/* ---------- footer year ---------- */
const yearEl = document.getElementById("year");
if (yearEl)
    yearEl.textContent = String(new Date().getFullYear());
/* ---------- mobile menu ---------- */
const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
toggle?.addEventListener("click", () => {
    const open = links?.classList.toggle("open") ?? false;
    toggle.setAttribute("aria-expanded", String(open));
});
links?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
}));
/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll("[data-reveal]");
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
    io.observe(el);
});
/* ---------- animated counters ---------- */
const counters = document.querySelectorAll("[data-count]");
const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (!e.isIntersecting)
            return;
        const el = e.target;
        const target = Number(el.dataset.count ?? "0");
        const dur = 1200;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased)) + (el.dataset.suffix ?? "");
            if (p < 1)
                requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
    });
}, { threshold: 0.6 });
counters.forEach((c) => countIO.observe(c));
/* ---------- cursor glow ---------- */
const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", (ev) => {
        glow.style.opacity = "1";
        glow.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px)`;
    });
}
/* ---------- 3D tilt on cards ---------- */
const tiltEls = document.querySelectorAll(".tilt");
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
const planSelect = document.getElementById("plan");
document.querySelectorAll("[data-plan]").forEach((el) => {
    el.addEventListener("click", () => {
        const plan = el.dataset.plan ?? "";
        if (planSelect && plan) {
            planSelect.value = plan;
            planSelect.classList.add("just-set");
            window.setTimeout(() => planSelect.classList.remove("just-set"), 1200);
        }
    });
});
const form = document.getElementById("contact-form");
const statusEl = form?.querySelector(".form-status") ?? null;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Escape user text before reflecting it anywhere in the DOM (XSS safety). */
function sanitize(input) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .trim();
}
function showError(name, msg) {
    const field = form?.querySelector(`[name="${name}"]`)?.closest(".field");
    const err = form?.querySelector(`.err[data-for="${name}"]`);
    field?.classList.toggle("invalid", Boolean(msg));
    if (err)
        err.textContent = msg;
}
function validate(data) {
    let ok = true;
    if (data.name.length < 2) {
        showError("name", "Tell me your name");
        ok = false;
    }
    else
        showError("name", "");
    if (!EMAIL_RE.test(data.email)) {
        showError("email", "Enter a valid email");
        ok = false;
    }
    else
        showError("email", "");
    if (data.message.length < 10) {
        showError("message", "A few more details, please");
        ok = false;
    }
    else
        showError("message", "");
    return ok;
}
function setStatus(msg, kind) {
    if (!statusEl)
        return;
    statusEl.textContent = msg;
    statusEl.className = `form-status ${kind}`;
}
form?.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const data = {
        name: sanitize(String(fd.get("name") ?? "")),
        email: sanitize(String(fd.get("email") ?? "")),
        message: sanitize(String(fd.get("message") ?? "")),
        plan: sanitize(String(fd.get("plan") ?? "")),
        company: String(fd.get("company") ?? ""),
    };
    if (data.company) {
        setStatus("Thanks! I'll be in touch.", "ok");
        form.reset();
        return;
    }
    if (!validate(data)) {
        setStatus("Fix the highlighted fields above.", "bad");
        return;
    }
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending...";
    }
    setStatus("", "");
    try {
        const res = await fetch(CONTACT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify(data),
        });
        if (!res.ok)
            throw new Error(`status ${res.status}`);
        setStatus("Message sent - talk soon!", "ok");
        form.reset();
    }
    catch {
        setStatus("Couldn't reach the server. Opening your email app instead...", "bad");
        const subject = encodeURIComponent(`createdbykujo inquiry from ${data.name}`);
        const body = encodeURIComponent(`${data.message}\n\nPlan: ${data.plan}\nReply to: ${data.email}`);
        window.location.href = `mailto:kjsierota@gmail.com?subject=${subject}&body=${body}`;
    }
    finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Send it";
        }
    }
});
