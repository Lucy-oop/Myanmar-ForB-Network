/* ==========================================================================
   Myanmar FoRB Network — interactions
   (vanilla JS, no dependencies)
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Page-transition curtain ---------- */
  function lift() {
    root.classList.remove("is-leaving");
    requestAnimationFrame(function () {
      root.classList.remove("is-entering");
      root.classList.add("is-entered");
      document.body.classList.add("loaded");
    });
  }
  // main.js loads at the end of <body>, so the DOM is ready: lift right away
  requestAnimationFrame(lift);
  // returning via back/forward cache
  window.addEventListener("pageshow", function (e) { if (e.persisted) lift(); });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || reduceMotion) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || a.target === "_blank" || a.hasAttribute("download") ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || /^(mailto|tel|https?):/i.test(href)) return;
    var url = new URL(a.href, location.href);
    if (url.pathname === location.pathname && url.hash) return; // same-page anchor
    e.preventDefault();
    root.classList.remove("is-entered");
    root.classList.add("is-leaving");
    setTimeout(function () { location.href = a.href; }, 650);
  });

  /* ---------- Header: shadow + hide on scroll down ---------- */
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 10);
      header.classList.toggle("hide", y > 400 && y > lastY);
    }
    if (toTop) toTop.classList.toggle("show", y > 900);
    lastY = y;
  }, { passive: true });
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  /* ---------- Fullscreen mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("m-menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) menu.querySelector(".m-menu__close").focus(); else burger.focus();
  }
  if (burger && menu) {
    burger.addEventListener("click", function () { setMenu(true); });
    menu.querySelector(".m-menu__close").addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Split headings into words for the rise effect ---------- */
  document.querySelectorAll(".rise").forEach(function (el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            var s = document.createElement("span"); s.textContent = part;
            s.style.transitionDelay = (i++ * 0.06) + "s";
            w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  });

  /* ---------- Hero logo: gentle mouse parallax (glow, orbit and logo move at different depths) ---------- */
  var heroLogo = document.querySelector(".hero-logo");
  var heroSec = heroLogo && heroLogo.closest(".page-hero");
  if (heroLogo && heroSec && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var raf = 0, px = 0, py = 0;
    heroSec.addEventListener("mousemove", function (e) {
      var r = heroSec.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        heroLogo.style.setProperty("--px", px.toFixed(3));
        heroLogo.style.setProperty("--py", py.toFixed(3));
      });
    });
    heroSec.addEventListener("mouseleave", function () {
      heroLogo.style.setProperty("--px", 0); heroLogo.style.setProperty("--py", 0);
    });
  }

  /* ---------- Entrance animation for every section ----------
     Anything inside a section that has no animation yet gets a gentle
     slide-up, staggered by position. Existing data-effect / .rise are kept. */
  /* standards timeline: items slide in from alternating sides (bottom on phones) */
  document.querySelectorAll(".std-tl .std").forEach(function (el, i) {
    el.setAttribute("data-effect", window.innerWidth < 760 ? "slide-bottom" : (i % 2 ? "slide-left" : "slide-right"));
  });

  var ANIM = "[data-effect], .rise";
  var SKIP = ".story__media, .sr-only, .placeholder-flag, script, .page-hero";
  var autoAnimate = function (list, depth) {
    var n = 0;
    Array.prototype.forEach.call(list, function (el) {
      if (el.matches(ANIM) || el.matches(SKIP)) return;
      if (el.querySelector(ANIM)) { if (depth < 3) autoAnimate(el.children, depth + 1); return; }
      el.setAttribute("data-effect", "slide-bottom");
      if (!el.hasAttribute("data-delay")) el.setAttribute("data-delay", String(Math.min(n, 3)));
      n++;
    });
  };
  document.querySelectorAll("main > section:not(.hero-show):not(.hero):not(.page-hero), .newsletter, .site-footer").forEach(function (sec) {
    sec.querySelectorAll(":scope > .wrap").forEach(function (w) { autoAnimate(w.children, 0); });
  });

  /* let line icons "draw" themselves (normalise every stroke to length 1) */
  document.querySelectorAll(".challenge svg *, .impact svg *, .who-grid svg *, .contact-rows svg *, .notice__ic svg *")
    .forEach(function (el) { el.setAttribute("pathLength", "1"); });

  /* stagger index for lists: children get --i (0,1,2…) for CSS transition delays */
  document.querySelectorAll(".stagger, .checklist, .chip-list, .wwd-tags, .tl-strip, .std-tl").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (c, i) { c.style.setProperty("--i", i); });
  });

  /* ---------- Scroll-triggered effects ----------
     Reveal when the element is genuinely on screen (bottom 10% excluded), so the
     motion is seen. Anything already scrolled past (e.g. page opened at an anchor)
     is shown at once, and a scroll safety-net guarantees nothing stays hidden. */
  var targets = Array.prototype.slice.call(document.querySelectorAll("[data-effect], .rise, .v-line, .census, .stats, .tl-strip, .std-tl"));
  var reveal = function (el) { el.classList.add("in"); };
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting || en.boundingClientRect.bottom < 0) { reveal(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    targets.forEach(function (el) { io.observe(el); });

    var pending = false;
    var sweep = function () {
      pending = false;
      var vh = window.innerHeight;
      var atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 4;
      targets = targets.filter(function (el) {
        if (el.classList.contains("in")) return false;
        if (el.getBoundingClientRect().top < (atEnd ? vh : vh * 0.92)) { reveal(el); io.unobserve(el); return false; }
        return true;
      });
    };
    window.addEventListener("scroll", function () { if (!pending) { pending = true; setTimeout(sweep, 160); } }, { passive: true });
    window.addEventListener("load", sweep);
  } else {
    targets.forEach(reveal);
  }

  function onVisible(el, fn) {
    if (!el) return;
    if (!("IntersectionObserver" in window) || reduceMotion) { fn(); return; }
    var o = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { fn(); o.disconnect(); }
    }, { threshold: 0.3 });
    o.observe(el);
  }

  /* ---------- Generic count-up: <span data-count="30" data-from="0"> ---------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var to = parseFloat(el.getAttribute("data-count")) || 0;
    var from = parseFloat(el.getAttribute("data-from")) || 0;
    if (reduceMotion) { el.textContent = to; return; }
    el.textContent = from;
    onVisible(el, function () {
      var start = null, dur = 1600;
      (function step(ts) {
        if (ts) { if (start === null) start = ts; }
        var p = start === null ? 0 : Math.min((ts - start) / dur, 1);
        el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step);
      })();
    });
  });

  /* ---------- Page hero scroll cue ---------- */
  document.querySelectorAll(".scroll-cue").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = b.closest("section").nextElementSibling;
      if (next) next.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- Accordion: smooth open / close ---------- */
  document.querySelectorAll(".accordion details").forEach(function (d) {
    var sum = d.querySelector("summary"), body = d.querySelector(".acc-body");
    if (!sum || !body || reduceMotion) return;
    sum.addEventListener("click", function (e) {
      e.preventDefault();
      if (d.classList.contains("busy")) return;
      d.classList.add("busy");
      var done = function () { body.style.height = ""; body.style.overflow = ""; d.classList.remove("busy"); };
      body.style.overflow = "hidden";
      if (d.open) {
        body.style.height = body.scrollHeight + "px";
        requestAnimationFrame(function () { body.style.height = "0px"; });
        setTimeout(function () { d.open = false; done(); }, 380);
      } else {
        d.open = true;
        var h = body.scrollHeight;
        body.style.height = "0px";
        requestAnimationFrame(function () { requestAnimationFrame(function () { body.style.height = h + "px"; }); });
        setTimeout(done, 380);
      }
    });
  });

  /* ---------- "Read more" for long card text (clamped to 2 lines, see CSS) ---------- */
  document.querySelectorAll(".clampable").forEach(function (p, i) {
    var id = p.id || ("clamp-" + i); p.id = id;
    p.classList.add("is-clamped");
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "read-more";
    btn.setAttribute("aria-controls", id); btn.setAttribute("aria-expanded", "false");
    btn.textContent = "Read more";
    btn.addEventListener("click", function () {
      var open = p.classList.toggle("is-clamped") === false;
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Show less" : "Read more";
    });
    p.insertAdjacentElement("afterend", btn);
  });

  /* ---------- Scrolling story: swap sticky photo as statements pass ---------- */
  document.querySelectorAll(".story").forEach(function (story) {
    var steps = story.querySelectorAll(".story__step");
    var imgs = story.querySelectorAll(".story__media img[data-step]");
    if (!("IntersectionObserver" in window)) return;
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var n = en.target.getAttribute("data-step");
        steps.forEach(function (s) { s.classList.toggle("current", s === en.target); });
        imgs.forEach(function (im) { im.classList.toggle("active", im.getAttribute("data-step") === n); });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { so.observe(s); });
  });

  /* ---------- Data-driven sections ---------- */
  var D = window.FORB_DATA;
  if (D) {
    if (!D.isPlaceholder) document.querySelectorAll(".placeholder-flag").forEach(function (el) { el.remove(); });
    document.querySelectorAll("[data-last-updated]").forEach(function (el) { el.textContent = D.lastUpdated; });

    // Headline counters
    document.querySelectorAll("[data-stat]").forEach(function (el) {
      var target = D.headline[el.getAttribute("data-stat")] || 0;
      var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
      if (reduceMotion) { el.textContent = fmt(target); return; }
      el.textContent = "0";
      onVisible(el, function () {
        var start = null, dur = 1800;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          el.textContent = fmt(target * (1 - Math.pow(1 - p, 4)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    });

    // Townships horizontal bars
    var hb = document.getElementById("chart-townships");
    if (hb) {
      var rows = D.townships.slice().sort(function (a, b) { return b.count - a.count; });
      var max = Math.max.apply(null, rows.map(function (r) { return r.count; })) || 1;
      var total = rows.reduce(function (s, r) { return s + r.count; }, 0);
      hb.innerHTML = rows.map(function (r) {
        return '<li class="hbar"><span class="hbar-label">' + r.region + '</span>' +
          '<span class="hbar-track"><span class="hbar-fill" data-w="' + (r.count / max * 100) + '"></span></span>' +
          '<span class="hbar-val">' + r.count + '</span></li>';
      }).join("");
      var totalEl = document.getElementById("townships-total");
      if (totalEl) totalEl.textContent = total;
      onVisible(hb, function () {
        hb.querySelectorAll(".hbar-fill").forEach(function (f) { f.style.width = f.getAttribute("data-w") + "%"; });
      });
    }

    // Timeline stacked columns
    var cc = document.getElementById("chart-timeline");
    if (cc) {
      var S = D.series, T = D.timeline;
      var totals = T.map(function (t) { return S.reduce(function (s, x) { return s + (t[x.key] || 0); }, 0); });
      var tmax = Math.max.apply(null, totals) || 1;
      var legend = document.getElementById("timeline-legend");
      if (legend) legend.innerHTML = S.map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + s.label + '</span>'; }).join("");
      cc.innerHTML = T.map(function (t, i) {
        var segs = S.map(function (s) {
          var v = t[s.key] || 0, pct = totals[i] ? v / totals[i] * 100 : 0;
          return '<span style="height:' + pct + '%;background:' + s.color + '" title="' + s.label + ': ' + v + '"></span>';
        }).join("");
        return '<div class="col"><div class="col-total">' + totals[i] + '</div><div class="col-stack" data-h="' + (totals[i] / tmax * 85) + '">' + segs + '</div></div>';
      }).join("");
      var yrs = document.getElementById("timeline-years");
      if (yrs) yrs.innerHTML = T.map(function (t) { return "<span>" + t.year + "</span>"; }).join("");
      var tbl = document.getElementById("timeline-table");
      if (tbl) {
        tbl.innerHTML = "<caption>Recorded FoRB violations per year</caption><thead><tr><th>Year</th>" +
          S.map(function (s) { return "<th>" + s.label + "</th>"; }).join("") + "<th>Total</th></tr></thead><tbody>" +
          T.map(function (t, i) {
            return "<tr><th>" + t.year + "</th>" + S.map(function (s) { return "<td>" + (t[s.key] || 0) + "</td>"; }).join("") + "<td>" + totals[i] + "</td></tr>";
          }).join("") + "</tbody>";
      }
      onVisible(cc, function () {
        cc.querySelectorAll(".col-stack").forEach(function (c) { c.style.height = c.getAttribute("data-h") + "%"; });
      });
    }
  }

  /* ---------- Insights filter ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  if (chips.length) {
    var items = document.querySelectorAll("[data-type]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        var match = function (it) { return f === "all" || it.getAttribute("data-type") === f; };
        if (reduceMotion) { items.forEach(function (it) { it.hidden = !match(it); }); return; }
        items.forEach(function (it) { if (!it.hidden) it.classList.add("is-out"); });
        setTimeout(function () {
          items.forEach(function (it) { it.hidden = !match(it); it.classList.add("is-out"); });
          requestAnimationFrame(function () { requestAnimationFrame(function () {
            items.forEach(function (it) { it.classList.add("in"); it.classList.remove("is-out"); });
          }); });
        }, 260);
      });
    });
  }

  /* ---------- Newsletter: FoRB Media Watch ----------
     Mailchimp action URL  -> submitted in the background (JSONP), visitor stays on the page.
     Other provider's URL  -> normal form post in a new tab.
     Empty action          -> demo mode (nothing is sent).                                   */
  document.querySelectorAll(".nl-form").forEach(function (nl) {
    var status = nl.querySelector(".nl-status");
    function say(msg, err) { status.textContent = msg; status.classList.toggle("err", !!err); }

    nl.addEventListener("submit", function (e) {
      if (!nl.checkValidity()) { e.preventDefault(); nl.reportValidity(); return; }
      if (nl.querySelector('[name="b_hp"]').value) { e.preventDefault(); return; } // bot
      var action = (nl.getAttribute("action") || "").trim();

      if (!action) {
        e.preventDefault();
        nl.classList.add("done");
        say("Thank you for subscribing! (Demo mode: connect the newsletter service to activate.)");
        return;
      }
      if (action.indexOf("list-manage.com") === -1) return; // let the browser submit to the provider

      e.preventDefault();
      var btn = nl.querySelector('button[type="submit"]');
      btn.disabled = true; say("Subscribing…");
      var cb = "nlcb" + Date.now();
      var params = new URLSearchParams();
      params.set("EMAIL", nl.EMAIL.value.trim());
      if (nl.FNAME.value.trim()) params.set("FNAME", nl.FNAME.value.trim());
      var s = document.createElement("script");
      var timer = setTimeout(function () { finish({ result: "error", msg: "The service did not respond. Please try again later." }); }, 12000);
      function finish(res) {
        clearTimeout(timer); delete window[cb]; s.remove(); btn.disabled = false;
        if (res.result === "success") {
          nl.classList.add("done");
          say("Almost done! Please check your inbox and confirm your subscription.");
        } else {
          var m = String(res.msg || "Something went wrong.").replace(/<[^>]*>/g, "").replace(/^\d+\s*-\s*/, "");
          say(/already subscribed/i.test(m) ? "You are already subscribed — thank you!" : m, !/already subscribed/i.test(m));
        }
      }
      window[cb] = finish;
      s.src = action.replace("/post?", "/post-json?").replace(/&amp;/g, "&") + "&" + params.toString() + "&c=" + cb;
      s.onerror = function () { finish({ result: "error", msg: "Could not reach the newsletter service." }); };
      document.body.appendChild(s);
    });
  });

  /* ---------- Contact form (front-end only) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      // TODO: connect to a secure form backend (see README.md).
      document.getElementById("form-status").textContent = "Thank you — your message is ready to send. (Form backend not connected yet.)";
      form.reset();
    });
  }
})();
