
"use strict";

// ==========================================
// SOCIAL MEDIA PORTFOLIO — COMPLETE SCRIPT
// ==========================================

// CURRENT YEAR
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================
const navBtn = document.getElementById("navBtn");
const nav = document.getElementById("nav");

if (navBtn && nav) {
  navBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// ==========================================
// PORTFOLIO FILTERS
// ==========================================
const filterBtns = document.querySelectorAll(".pill-filter");
const cards = document.querySelectorAll(".work-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((button) => {
      const active = button === btn;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const selected = btn.dataset.filter || "all";

    cards.forEach((card) => {
      const categories = (card.dataset.cat || "")
        .split(/\s+/)
        .filter(Boolean);

      card.hidden =
        selected !== "all" && !categories.includes(selected);
    });
  });
});

// ==========================================
// CONTACT FORM — FORMSPREE
// ==========================================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) submitButton.disabled = true;

    if (formStatus) {
      formStatus.textContent = "Sending your message...";
      formStatus.style.color = "#9aa3c7";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      if (formStatus) {
        formStatus.textContent =
          "Message sent successfully! Thank you.";
        formStatus.style.color = "#1e9a64";
      }

      contactForm.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      if (formStatus) {
        formStatus.textContent =
          "Unable to send your message. Please try again.";
        formStatus.style.color = "#ff4f9a";
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// ==========================================
// SERVICES MODAL
// ==========================================
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

const svcCopy = {
  Strategy:
    "Includes audit, competitor scan, content pillars, monthly calendar, and KPI planning.",

  Management:
    "Includes scheduling, weekly posting, community replies, and optimisation based on analytics.",

  Ads:
    "Includes campaign setup, A/B testing creatives, audience targeting, and performance reporting.",

  Content:
    "Includes post design, reels editing direction, caption writing, and on-brand template system.",

  Engagement:
    "Includes community building, DM/comment workflows, and a response tone/FAQ playbook.",

  Analytics:
    "Includes weekly/monthly reporting, insights, and recommendations to improve results.",
};

// ==========================================
// FEATURED WORKS LIGHTBOX ELEMENTS
// ==========================================
const lightbox = document.getElementById("lightbox");
const lbStage = document.getElementById("lbStage");
const lbStrip = document.getElementById("lbStrip");

const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxMeta = document.getElementById("lightboxMeta");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxTag = document.getElementById("lightboxTag");

const lightboxClose = document.getElementById("lightboxClose");
const lightboxBg = document.getElementById("lightboxBg");

const lbPrevProject = document.getElementById("lbPrevProject");
const lbNextProject = document.getElementById("lbNextProject");

let projectList = [];
let projectIndex = 0;
let mediaIndex = 0;

// Prevent background scrolling while a popup is open
function updateBodyScroll() {
  const modalOpen = modal?.classList.contains("open");
  const lightboxOpen = lightbox?.classList.contains("open");

  document.body.style.overflow =
    modalOpen || lightboxOpen ? "hidden" : "";
}

// ==========================================
// SERVICES MODAL FUNCTIONS
// ==========================================
function openModal(title, body) {
  if (!modal || !modalTitle || !modalBody) return;

  modalTitle.textContent = title;
  modalBody.textContent = body;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  updateBodyScroll();
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  updateBodyScroll();
}

document.querySelectorAll(".svc-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.svc;

    openModal(
      key || "Service",
      svcCopy[key] || "More information coming soon."
    );
  });
});

document.querySelectorAll("[data-close]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

// ==========================================
// VIDEO DETECTION
// ==========================================
function isVideo(url) {
  return /\.(mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(url);
}

// ==========================================
// GET PROJECT MEDIA
// ==========================================
function parseMedia(card) {
  const raw = (
    card.dataset.media ||
    card.dataset.images ||
    card.dataset.img ||
    ""
  ).trim();

  if (!raw) return [];

  return raw
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

// ==========================================
// GET VISIBLE PROJECT CARDS
// ==========================================
function getVisibleCards() {
  return Array.from(cards).filter((card) => {
    return !card.hidden && getComputedStyle(card).display !== "none";
  });
}

// ==========================================
// DISPLAY IMAGE OR VIDEO
// ==========================================
function renderStage(url) {
  if (!lbStage) return;

  // Remove old media and stop previous video
  lbStage.replaceChildren();

  if (!url) return;

  if (isVideo(url)) {
    const video = document.createElement("video");

    video.src = url;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", "Project video preview");

    lbStage.appendChild(video);
  } else {
    const image = document.createElement("img");

    image.src = url;
    image.alt = "Featured project media";
    image.loading = "eager";

    lbStage.appendChild(image);
  }
}

// ==========================================
// MEDIA THUMBNAILS
// ==========================================
function renderThumbs(media) {
  if (!lbStrip) return;

  lbStrip.replaceChildren();

  if (!media.length) return;

  media.forEach((url, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      "lb-thumb" + (index === mediaIndex ? " active" : "");

    button.setAttribute(
      "aria-label",
      `View media ${index + 1} of ${media.length}`
    );

    if (isVideo(url)) {
      const videoThumb = document.createElement("div");

      videoThumb.style.width = "100%";
      videoThumb.style.height = "100%";
      videoThumb.style.display = "grid";
      videoThumb.style.placeItems = "center";
      videoThumb.style.background = "#111827";
      videoThumb.style.color = "#fff";
      videoThumb.style.fontSize = "24px";
      videoThumb.textContent = "▶";

      button.appendChild(videoThumb);
    } else {
      const image = document.createElement("img");

      image.src = url;
      image.alt = `Project thumbnail ${index + 1}`;
      image.loading = "lazy";

      button.appendChild(image);
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      mediaIndex = index;
      renderStage(media[mediaIndex]);

      lbStrip.querySelectorAll(".lb-thumb").forEach((thumb) => {
        thumb.classList.remove("active");
      });

      button.classList.add("active");

      button.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });

    lbStrip.appendChild(button);
  });
}

// ==========================================
// PROJECT DETAILS
// ==========================================
function renderProject(card) {
  if (!card) return;

  const title =
    card.dataset.title ||
    card.querySelector(".work-title")?.textContent ||
    "Featured Work";

  const meta =
    card.dataset.meta ||
    card.querySelector(".work-meta")?.textContent ||
    "";

  const description = card.dataset.desc || "";

  if (lightboxTitle) lightboxTitle.textContent = title;
  if (lightboxMeta) lightboxMeta.textContent = meta;
  if (lightboxDesc) lightboxDesc.textContent = description;
  if (lightboxTag) lightboxTag.textContent = meta || "Preview";

  const media = parseMedia(card);

  mediaIndex = 0;

  if (media.length) {
    renderStage(media[0]);
    renderThumbs(media);
  } else {
    lbStage?.replaceChildren();
    lbStrip?.replaceChildren();
  }

  // Optional external project link
  const projectLink = document.getElementById("lightboxCta");

  if (projectLink) {
    const url = card.dataset.link;

    if (url) {
      projectLink.href = url;
      projectLink.target = "_blank";
      projectLink.rel = "noopener noreferrer";
      projectLink.textContent = "Visit Project ↗";
    } else {
      projectLink.href = "#contact";
      projectLink.removeAttribute("target");
      projectLink.removeAttribute("rel");
      projectLink.textContent = "Get in Touch →";
    }
  }
}

// ==========================================
// OPEN PROJECT LIGHTBOX
// ==========================================
function openLightbox(card) {
  if (!lightbox) return;

  projectList = getVisibleCards().filter(
    (item) => item.dataset.direct !== "true"
  );

  projectIndex = projectList.indexOf(card);

  if (projectIndex < 0) return;

  renderProject(projectList[projectIndex]);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");

  updateBodyScroll();
}

// ==========================================
// CLOSE PROJECT LIGHTBOX
// ==========================================
function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  // Stop video playback
  lbStage?.replaceChildren();
  lbStrip?.replaceChildren();

  updateBodyScroll();
}

// ==========================================
// NEXT / PREVIOUS PROJECT
// ==========================================
function switchProject(direction) {
  if (!projectList.length) return;

  projectIndex =
    (projectIndex + direction + projectList.length) %
    projectList.length;

  renderProject(projectList[projectIndex]);
}

// ==========================================
// PROJECT CARD CLICK BEHAVIOR
// ==========================================
// JSM, WWIB, JazzRock, SuperDawgs and
// Eprecision open their media galleries.
//
// Lazy Loopin opens its live website directly.
// ==========================================
cards.forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute("role", "button");

  function activateCard() {
    if (card.dataset.direct === "true" && card.dataset.link) {
      window.open(
        card.dataset.link,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    openLightbox(card);
  }

  card.addEventListener("click", activateCard);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateCard();
    }
  });
});

// ==========================================
// PROJECT NAVIGATION BUTTONS
// ==========================================
lbPrevProject?.addEventListener("click", (event) => {
  event.stopPropagation();
  switchProject(-1);
});

lbNextProject?.addEventListener("click", (event) => {
  event.stopPropagation();
  switchProject(1);
});

// ==========================================
// CLOSE LIGHTBOX
// ==========================================
lightboxClose?.addEventListener("click", closeLightbox);
lightboxBg?.addEventListener("click", closeLightbox);

// ==========================================
// OPTIONAL LIGHTBOX CTA
// ==========================================
const lightboxCta = document.getElementById("lightboxCta");

lightboxCta?.addEventListener("click", () => {
  if (lightboxCta.getAttribute("href") === "#contact") {
    closeLightbox();
  }
});

// ==========================================
// KEYBOARD CONTROLS
// ==========================================
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeLightbox();
    return;
  }

  if (!lightbox?.classList.contains("open")) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    switchProject(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    switchProject(1);
  }
});

// ==========================================
// OPTIONAL PROJECT COVER IMAGES
// ==========================================
document.querySelectorAll("[data-cover]").forEach((element) => {
  const imageUrl = element.dataset.cover;

  if (!imageUrl) return;

  const image = new Image();

  image.onload = () => {
    element.style.backgroundImage =
      `linear-gradient(135deg, ` +
      `rgba(3,10,25,.45), ` +
      `rgba(3,10,25,.1)), ` +
      `url("${imageUrl}")`;

    element.dataset.loaded = "true";
  };

  image.src = imageUrl;
});

// ==========================================
// END OF SCRIPT
// ==========================================
