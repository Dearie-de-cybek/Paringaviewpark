(function () {
  var header = document.getElementById("site-header");
  if (!header) return;
  var inner = header.querySelector(".header-inner");
  var btn = document.getElementById("menu-btn");
  var menu = document.getElementById("mobile-menu");
  var open = false;
  function apply() {
    var solid = window.scrollY > 20 || open;
    header.classList.toggle("bg-forest-ink", solid);
    header.classList.toggle("bg-transparent", !solid);
    if (inner) inner.classList.toggle("translate-y-9", !solid);
  }
  function setOpen(v) {
    open = v;
    menu.classList.toggle("hidden", !v);
    document.getElementById("menu-icon-open").classList.toggle("hidden", v);
    document.getElementById("menu-icon-close").classList.toggle("hidden", !v);
    btn.setAttribute("aria-expanded", v);
    btn.setAttribute("aria-label", v ? "Close menu" : "Open menu");
    apply();
  }
  if (btn && menu) {
    btn.addEventListener("click", function () { setOpen(!open); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1024 && open) setOpen(false); });
  }
  window.addEventListener("scroll", apply, { passive: true });
  apply();
})();

(function () {
  if (!window.Motion) return; // no JS/CDN failure: content stays visible via base CSS, just skip animation
  var animate = window.Motion.animate;
  var inView = window.Motion.inView;

  var hero = document.querySelector("[data-animate='hero']");
  if (hero) {
    animate(hero, { opacity: [0, 1], y: [24, 0] }, { duration: 0.9, easing: "ease-out" });
  }

  var groups = new Map();
  document.querySelectorAll("[data-animate='fade-up']").forEach(function (el) {
    var section = el.closest("section");
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(el);
  });

  groups.forEach(function (els) {
    inView(els[0].closest("section"), function () {
      els.forEach(function (el) {
        var delay = parseFloat(el.dataset.delay || "0");
        animate(el, { opacity: [0, 1], y: [20, 0] }, { duration: 0.7, delay: delay, easing: "ease-out" });
      });
    }, { margin: "-10% 0px -10% 0px" });
  });
})();

(function () {
  var svg = document.getElementById("au-map");
  var tags = document.querySelectorAll(".town-tag");
  if (!svg || !tags.length) return;
  var full = svg.dataset.vb.split(" ").map(Number);
  var ratio = full[3] / full[2];
  var cur = full.slice();
  var marker = document.getElementById("au-marker");
  var ring = document.getElementById("au-ring");
  var pin = document.getElementById("au-pin");
  var label = document.getElementById("au-label");
  var dots = svg.querySelectorAll(".town-dot");
  var raf, active = null;

  function draw(vb, town) {
    svg.setAttribute("viewBox", vb.join(" "));
    var w = vb[2];
    var zoomed = w < full[2] * 0.5;
    dots.forEach(function (d) { d.setAttribute("r", w / 120); d.style.opacity = zoomed ? 0.35 : 0; });
    if (town) {
      marker.setAttribute("opacity", 1);
      ring.setAttribute("cx", town.x); ring.setAttribute("cy", town.y); ring.setAttribute("r", w / 28);
      pin.setAttribute("cx", town.x); pin.setAttribute("cy", town.y); pin.setAttribute("r", w / 75);
      label.textContent = town.name;
      label.setAttribute("x", town.x + w / 45); label.setAttribute("y", town.y - w / 45);
      label.setAttribute("font-size", w / 26);
    } else {
      marker.setAttribute("opacity", 0);
    }
  }

  function go(target, town) {
    cancelAnimationFrame(raf);
    var from = cur.slice(), t0 = performance.now(), dur = 800;
    (function step(now) {
      var p = Math.min((now - t0) / dur, 1);
      var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      cur = from.map(function (v, i) { return v + (target[i] - v) * e; });
      draw(cur, town);
      if (p < 1) raf = requestAnimationFrame(step);
    })(t0);
  }

  function select(btn) {
    tags.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("bg-forest-ink", on);
      b.classList.toggle("text-white", on);
      b.classList.toggle("bg-white", !on);
      b.classList.toggle("hover:bg-moss", !on);
      b.classList.toggle("text-graphite", !on);
      b.setAttribute("aria-pressed", on);
    });
    if (!btn) { active = null; go(full, null); return; }
    active = btn;
    var x = parseFloat(btn.dataset.x), y = parseFloat(btn.dataset.y), w = 130;
    go([x - w / 2, y - (w * ratio) / 2, w, w * ratio], { x: x, y: y, name: btn.dataset.town });
  }

  tags.forEach(function (b) {
    b.addEventListener("click", function () { select(active === b ? null : b); });
  });
  draw(full, null);
})();

(function () {
  var carousel = document.getElementById("partner-carousel");
  var prev = document.getElementById("partner-prev");
  var next = document.getElementById("partner-next");
  if (!carousel || !prev || !next) return;

  function scrollByStep(dir) {
    var card = carousel.querySelector(".snap-center");
    var step = card ? card.offsetWidth + 24 : 400;
    carousel.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  prev.addEventListener("click", function () { scrollByStep(-1); });
  next.addEventListener("click", function () { scrollByStep(1); });
})();


(function () {
  var wrap = document.getElementById("journey");
  if (!wrap || !window.Motion) return;
  var m = window.Motion;
  var steps = wrap.querySelectorAll(".journey-step");
  steps.forEach(function (el) { el.style.opacity = 0; });
  m.inView(wrap, function () {
    m.animate("#journey-line", { transform: ["scaleX(0)", "scaleX(1)"] }, { duration: 1.4, easing: "ease-in-out" });
    steps.forEach(function (el, i) {
      m.animate(el, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, delay: 0.3 + i * 0.35, easing: "ease-out" });
    });
  }, { margin: "0px 0px -20% 0px" });
})();

(function () {
  var els = document.querySelectorAll("[data-parallax]");
  if (!els.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var ticking = false;
  function update() {
    els.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      var off = (r.top + r.height / 2 - window.innerHeight / 2) * parseFloat(el.dataset.parallax);
      el.style.transform = "translateY(" + off.toFixed(1) + "px)";
    });
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
