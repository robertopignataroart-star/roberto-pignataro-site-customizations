/* Roberto Pignataro — Squarespace 7.0 custom behavior */
(function () {
  "use strict";

  var state = window.RLPSite || (window.RLPSite = {});

  function markSectionDividers() {
    document.querySelectorAll("#page p").forEach(function (paragraph) {
      var text = paragraph.textContent.trim();

      if (text === "•••" || text === "..." || text === "···") {
        paragraph.classList.add("rlp-section-divider");
      }
    });
  }

  function slugify(text, fallback) {
    var value = text.trim().toLowerCase();

    if (value.normalize) {
      value = value.normalize("NFD");
    }

    value = value
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return value || fallback;
  }

  function createBiographyContents() {
    if (!/^\/biography\/?$/.test(window.location.pathname)) {
      return;
    }

    /*
     * Keep dynamic navigation out of Squarespace's editor iframe.
     * Visitors still receive the Biography index.
     */
    if (window.self !== window.top) {
      return;
    }

    if (document.querySelector(".rlp-biography-toc")) {
      return;
    }

    var headings = Array.prototype.slice.call(
      document.querySelectorAll("#page .sqs-html-content h3")
    ).filter(function (heading) {
      return ["about", "overview"].indexOf(
        heading.textContent.trim().toLowerCase()
      ) === -1;
    });

    if (headings.length < 2) {
      return;
    }

    var usedIds = {};

    headings.forEach(function (heading, index) {
      var baseId = slugify(
        heading.textContent,
        "biography-section-" + (index + 1)
      );

      var uniqueId = baseId;
      var count = 2;

      while (usedIds[uniqueId] || document.getElementById(uniqueId)) {
        uniqueId = baseId + "-" + count;
        count += 1;
      }

      usedIds[uniqueId] = true;
      heading.id = uniqueId;
      heading.classList.add("rlp-biography-section");
    });

    var contents = document.createElement("details");
    contents.className = "rlp-biography-toc";

    var summary = document.createElement("summary");
    summary.textContent = "In this biography";
    contents.appendChild(summary);

    var list = document.createElement("ol");

    headings.forEach(function (heading) {
      var item = document.createElement("li");
      var link = document.createElement("a");

      link.href = "#" + heading.id;
      link.textContent = heading.textContent.trim();

      item.appendChild(link);
      list.appendChild(item);
    });

    contents.appendChild(list);
    headings[0].parentNode.insertBefore(contents, headings[0]);

    var mobileView = window.matchMedia("(max-width: 640px)");

    function setInitialState() {
      contents.open = !mobileView.matches;
    }

    setInitialState();

    if (mobileView.addEventListener) {
      mobileView.addEventListener("change", setInitialState);
    }

    contents.addEventListener("click", function (event) {
      var link = event.target.closest("a");

      if (!link) {
        return;
      }

      var destination = document.querySelector(link.getAttribute("href"));

      if (!destination) {
        return;
      }

      event.preventDefault();

      destination.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      if (mobileView.matches) {
        contents.open = false;
      }
    });
  }


  function createFloridaContents() {
    var pathMatch =
      window.location.pathname.indexOf("florida-y-lavalle-1965") !== -1;
    var titleMatch =
      document.title.toLowerCase().indexOf("art & the city") !== -1;

    if (!pathMatch && !titleMatch) {
      return;
    }

    if (document.querySelector(".rlp-article-toc")) {
      return;
    }

    var headings = Array.prototype.slice.call(
      document.querySelectorAll("#page .sqs-html-content h2")
    );

    if (headings.length < 2) {
      return;
    }

    var usedIds = {};

    headings.forEach(function (heading, index) {
      var baseId = slugify(
        heading.textContent,
        "article-section-" + (index + 1)
      );

      var uniqueId = baseId;
      var count = 2;

      while (usedIds[uniqueId] || document.getElementById(uniqueId)) {
        uniqueId = baseId + "-" + count;
        count += 1;
      }

      usedIds[uniqueId] = true;
      heading.id = uniqueId;
      heading.classList.add("rlp-article-section");
    });

    var contents = document.createElement("details");
    contents.className = "rlp-article-toc";

    var summary = document.createElement("summary");
    summary.textContent = "In this article";
    contents.appendChild(summary);

    var list = document.createElement("ol");

    headings.forEach(function (heading) {
      var item = document.createElement("li");
      var link = document.createElement("a");

      link.href = "#" + heading.id;
      link.textContent = heading.textContent.trim();

      item.appendChild(link);
      list.appendChild(item);
    });

    contents.appendChild(list);
    headings[0].parentNode.insertBefore(contents, headings[0]);

    var mobileView = window.matchMedia("(max-width: 640px)");

    function setInitialState() {
      contents.open = !mobileView.matches;
    }

    setInitialState();

    if (mobileView.addEventListener) {
      mobileView.addEventListener("change", setInitialState);
    }

    contents.addEventListener("click", function (event) {
      var link = event.target.closest("a");

      if (!link) {
        return;
      }

      var destination = document.querySelector(link.getAttribute("href"));

      if (!destination) {
        return;
      }

      event.preventDefault();

      destination.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      if (mobileView.matches) {
        contents.open = false;
      }
    });
  }

  function createFloridaProgress() {
    var pathMatch =
      window.location.pathname.indexOf("florida-y-lavalle-1965") !== -1;

    var titleMatch =
      document.title.toLowerCase().indexOf("art & the city") !== -1;

    if (!pathMatch && !titleMatch) {
      return;
    }

    document.body.classList.add("rlp-florida-lavalle-page");

    if (document.querySelector(".rlp-reading-progress")) {
      return;
    }

    var container = document.createElement("div");
    var bar = document.createElement("div");

    container.className = "rlp-reading-progress";
    bar.className = "rlp-reading-progress-bar";
    container.setAttribute("aria-hidden", "true");
    container.appendChild(bar);
    document.body.appendChild(container);

    var scheduled = false;

    function update() {
      var root = document.documentElement;
      var top = window.pageYOffset || root.scrollTop || 0;

      var maximum =
        Math.max(root.scrollHeight, document.body.scrollHeight) -
        window.innerHeight;

      var ratio =
        maximum > 0
          ? Math.max(0, Math.min(1, top / maximum))
          : 0;

      bar.style.width = (ratio * 100).toFixed(2) + "%";
      scheduled = false;
    }

    function schedule() {
      if (scheduled) {
        return;
      }

      scheduled = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("load", schedule, { once: true });

    update();
  }

  function initialize() {
    markSectionDividers();
    createBiographyContents();
    createFloridaContents();
    createFloridaProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }

  if (!state.mercuryListenerAdded) {
    document.addEventListener("mercury:load", function () {
      window.setTimeout(initialize, 0);
    });

    state.mercuryListenerAdded = true;
  }
})();
