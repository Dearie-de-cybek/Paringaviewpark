(function () {
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 20) {
        header.classList.remove("bg-transparent");
        header.classList.add("bg-forest-ink");
      } else {
        header.classList.remove("bg-forest-ink");
        header.classList.add("bg-transparent");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
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
