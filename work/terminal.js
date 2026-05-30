/* tiny typing effect for the terminal demo headline */
(function () {
  "use strict";
  const el = document.querySelector(".type");
  if (!el) return;
  const text = el.getAttribute("data-text") || "";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = text;
    return;
  }
  let i = 0;
  (function step() {
    el.textContent = text.slice(0, i);
    if (i++ <= text.length) setTimeout(step, 70);
  })();
})();
