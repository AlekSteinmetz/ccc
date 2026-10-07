/* Coral Construction Company — site behavior (no dependencies) */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Dynamic numbers ---------- */
  var FOUNDED = 1968;
  var thisYear = new Date().getFullYear();
  document.querySelectorAll("[data-years]").forEach(function (el) {
    el.textContent = String(thisYear - FOUNDED);
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(thisYear);
  });

  /* ---------- Header state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    root.classList.toggle("menu-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (menu) menu.setAttribute("aria-hidden", String(!open));
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!root.classList.contains("menu-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1180) setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  document.querySelectorAll("[data-reveal-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.setAttribute("data-reveal", "");
      child.style.setProperty("--d", (i * 0.08).toFixed(2) + "s");
    });
  });
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Sub-navigation active state ---------- */
  var subLinks = document.querySelectorAll(".subnav a[href^='#']");
  if (subLinks.length && "IntersectionObserver" in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        subLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = map[entry.target.id];
        if (link) {
          link.classList.add("is-active");
          var bar = link.closest("ul");
          if (bar) bar.scrollTo({ left: link.offsetLeft - 24, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Before / after sliders ---------- */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var input = ba.querySelector("input[type='range']");
    if (!input) return;
    var update = function () { ba.style.setProperty("--pos", input.value + "%"); };
    input.addEventListener("input", update);
    update();
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbState = { items: [], index: 0, title: "", opener: null };

  function collect(container) {
    return Array.prototype.map.call(container.querySelectorAll("a[data-lb]"), function (a) {
      var img = a.querySelector("img");
      return {
        src: a.getAttribute("href"),
        caption: a.getAttribute("data-caption") || (img ? img.alt : "")
      };
    });
  }

  function render() {
    if (!lb) return;
    var item = lbState.items[lbState.index];
    var img = lb.querySelector(".lb-stage img");
    img.classList.remove("is-loaded");
    img.onload = function () { img.classList.add("is-loaded"); };
    img.src = item.src;
    img.alt = item.caption;
    if (img.complete) img.classList.add("is-loaded");
    lb.querySelector(".lb-caption").textContent = item.caption;
    lb.querySelector(".lb-title").textContent = lbState.title;
    lb.querySelector(".lb-count").textContent = (lbState.index + 1) + " / " + lbState.items.length;
    var multi = lbState.items.length > 1;
    lb.querySelector(".lb-prev").hidden = !multi;
    lb.querySelector(".lb-next").hidden = !multi;
    // Preload neighbours
    [1, -1].forEach(function (step) {
      var n = lbState.items[(lbState.index + step + lbState.items.length) % lbState.items.length];
      if (n) { var pre = new Image(); pre.src = n.src; }
    });
  }

  function openLightbox(container, index, opener) {
    if (!lb || typeof lb.showModal !== "function") return false;
    lbState.items = collect(container);
    if (!lbState.items.length) return false;
    lbState.index = Math.max(0, Math.min(index, lbState.items.length - 1));
    lbState.title = container.getAttribute("data-gallery-title") || "";
    lbState.opener = opener || null;
    render();
    lb.showModal();
    root.style.overflow = "hidden";
    return true;
  }

  function step(dir) {
    var n = lbState.items.length;
    if (n < 2) return;
    lbState.index = (lbState.index + dir + n) % n;
    render();
  }

  if (lb) {
    lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("close", function () {
      root.style.overflow = "";
      if (lbState.opener && document.contains(lbState.opener)) lbState.opener.focus();
    });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lb-stage")) lb.close();
    });
    var touchX = null;
    lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      touchX = null;
    });
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[data-lb]");
    if (link) {
      var container = link.closest("[data-gallery]");
      if (!container) return;
      var links = Array.prototype.slice.call(container.querySelectorAll("a[data-lb]"));
      if (openLightbox(container, links.indexOf(link), link)) e.preventDefault();
      return;
    }
    var opener = e.target.closest("[data-open-gallery]");
    if (opener) {
      var target = document.getElementById(opener.getAttribute("data-open-gallery"));
      if (target && openLightbox(target, 0, opener)) e.preventDefault();
    }
  });

  /* ---------- Portfolio filters ---------- */
  var filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    var buttons = filterBar.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll("[data-cats]");
    var status = document.querySelector("[data-filter-status]");
    var applyFilter = function (key, push) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = key === "all" || card.getAttribute("data-cats").split(" ").indexOf(key) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === key)); });
      if (status) {
        var label = key === "all" ? "all categories" : filterBar.querySelector("[data-filter='" + key + "']").getAttribute("data-label");
        status.textContent = "Showing " + shown + " project" + (shown === 1 ? "" : "s") + " · " + label;
      }
      if (push && history.replaceState) history.replaceState(null, "", key === "all" ? location.pathname : "#" + key);
    };
    buttons.forEach(function (b) {
      b.addEventListener("click", function () { applyFilter(b.getAttribute("data-filter"), true); });
    });
    var initial = location.hash.slice(1);
    applyFilter(filterBar.querySelector("[data-filter='" + initial + "']") ? initial : "all", false);
  }

  /* ---------- Contact form ----------
     Set data-endpoint on the form (e.g. a Formspree URL) to submit in-page.
     Without an endpoint, the form opens the visitor's email app with the
     message pre-filled, so it works on any static host with zero setup. */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var params = new URLSearchParams(location.search);
    var preset = params.get("type");
    var typeSelect = form.querySelector("[name='project_type']");
    if (preset && typeSelect) {
      Array.prototype.forEach.call(typeSelect.options, function (o) {
        if (o.getAttribute("data-key") === preset) typeSelect.value = o.value;
      });
    }
    var statusEl = form.querySelector(".form-status");
    var showStatus = function (msg, ok) {
      statusEl.hidden = false;
      statusEl.textContent = msg;
      statusEl.className = "form-status " + (ok ? "ok" : "err");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      if (data.get("company_website")) return; // honeypot

      var endpoint = form.getAttribute("data-endpoint");
      var submitBtn = form.querySelector("[type='submit']");
      if (endpoint) {
        submitBtn.disabled = true;
        fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (res) {
            if (!res.ok) throw new Error("Request failed");
            form.reset();
            showStatus("Thank you — your message is on its way. We'll be in touch soon.", true);
          })
          .catch(function () {
            showStatus("Something went wrong sending your message. Please call (305) 394-0747 or email office@coralconstructioncompany.com.", false);
          })
          .then(function () { submitBtn.disabled = false; });
        return;
      }

      var lines = [
        "Name: " + (data.get("name") || ""),
        "Email: " + (data.get("email") || ""),
        "Phone: " + (data.get("phone") || ""),
        "Organization: " + (data.get("organization") || "—"),
        "Project type: " + (data.get("project_type") || ""),
        "Location / mile marker: " + (data.get("location") || "—"),
        "Timeline: " + (data.get("timeline") || "—"),
        "",
        data.get("message") || ""
      ];
      var subject = "Project inquiry — " + (data.get("project_type") || "General") + " — " + (data.get("name") || "");
      var to = form.getAttribute("data-mailto") || "office@coralconstructioncompany.com";
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      showStatus("Your email app should open with your message ready to send. If it doesn't, email us directly at " + to + " or call (305) 394-0747.", true);
    });
  }
})();
