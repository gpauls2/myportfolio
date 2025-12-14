// Year (safe)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Mobile nav
const navBtn = document.getElementById("navBtn");
const nav = document.getElementById("nav");
if (navBtn && nav) {
  navBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navBtn.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      navBtn.setAttribute("aria-expanded", "false");
    });
  });
}


// Portfolio filtering
const filterBtns = document.querySelectorAll(".pill-filter");
const cards = document.querySelectorAll(".work-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const f = btn.dataset.filter;
    cards.forEach(card => {
      const show = (f === "all") || (card.dataset.cat === f);
      card.style.display = show ? "" : "none";
    });
  });
});


// ✅ Contact form (Formspree)
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus"); // add <p id="formStatus"></p> in form

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (formStatus) {
      formStatus.textContent = "Sending...";
      formStatus.style.color = "#9aa3c7";
    }

    const data = new FormData(contactForm);

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        if (formStatus) {
          formStatus.textContent = "✅ Message sent successfully!";
          formStatus.style.color = "#73ffb3";
        }
        contactForm.reset();
      } else {
        if (formStatus) {
          formStatus.textContent = "❌ Something went wrong. Please try again.";
          formStatus.style.color = "#ff4f9a";
        }
      }
    } catch (err) {
      if (formStatus) {
        formStatus.textContent = "❌ Network error. Please try again later.";
        formStatus.style.color = "#ff4f9a";
      }
    }
  });
}


// Services "Learn more" modal
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

const svcCopy = {
  Strategy: "Includes audit, competitor scan, content pillars, monthly calendar, and KPI planning.",
  Management: "Includes scheduling, weekly posting, community replies, and optimisation based on analytics.",
  Ads: "Includes campaign setup, A/B testing creatives, audience targeting, and performance reporting.",
  Content: "Includes post design, reels editing direction, caption writing, and on-brand template system.",
  Engagement: "Includes community building, DM/comment workflows, and a response tone/FAQ playbook.",
  Analytics: "Includes weekly/monthly reporting, insights, and recommendations to improve results."
};

function openModal(title, body) {
  if (!modal || !modalTitle || !modalBody) return;
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".svc-link").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.svc;
    openModal(key, svcCopy[key] || "Details coming soon.");
  });
});
document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});


// ✅ Featured Works Lightbox: switch projects + scrollable MEDIA (images/videos)
const lightbox = document.getElementById("lightbox");
const lbStage = document.getElementById("lbStage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxMeta = document.getElementById("lightboxMeta");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxBg = document.getElementById("lightboxBg");
const lightboxTag = document.getElementById("lightboxTag");

const lbPrevProject = document.getElementById("lbPrevProject");
const lbNextProject = document.getElementById("lbNextProject");
const lbStrip = document.getElementById("lbStrip");

let projectList = [];
let projectIndex = 0;
let mediaIndex = 0;

function getVisibleCards() {
  return Array.from(document.querySelectorAll(".work-card"))
    .filter(c => c.style.display !== "none");
}

function isVideo(url) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

function parseMedia(card) {
  const raw = (card.dataset.media || card.dataset.images || card.dataset.img || "").trim();
  if (!raw) return [];
  return raw.split("|").map(s => s.trim()).filter(Boolean);
}

function renderStage(url) {
  if (!lbStage) return;

  // stop previous video by clearing stage
  lbStage.innerHTML = "";
  lbStage.style.opacity = "0";

  setTimeout(() => {
    if (isVideo(url)) {
      const v = document.createElement("video");
      v.src = url;
      v.controls = true;
      v.playsInline = true;
      v.preload = "metadata";
      lbStage.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Featured work media";
      img.loading = "lazy";
      lbStage.appendChild(img);
    }
    lbStage.style.opacity = "1";
  }, 120);
}

function renderThumbs(list) {
  if (!lbStrip) return;

  lbStrip.innerHTML = "";
  if (!list.length) return;

  list.forEach((u, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lb-thumb" + (i === mediaIndex ? " active" : "");

    if (isVideo(u)) {
      btn.innerHTML = `
        <div style="position:relative;width:100%;height:100%;">
          <div style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;
                      font-weight:900;background:rgba(0,0,0,.35);">
            ▶
          </div>
          <div style="width:100%;height:100%;background:#111;"></div>
        </div>
      `;
    } else {
      btn.innerHTML = `<img src="${u}" alt="Preview ${i+1}" loading="lazy">`;
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      mediaIndex = i;
      renderStage(list[mediaIndex]);

      lbStrip.querySelectorAll(".lb-thumb").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");

      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });

    lbStrip.appendChild(btn);
  });

  lbStrip.querySelector(".lb-thumb.active")?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function renderProject(card) {
  if (!card) return;

  const title = card.dataset.title || card.querySelector(".work-title")?.textContent || "Featured Work";
  const meta = card.dataset.meta || card.querySelector(".work-meta")?.textContent || "";
  const desc = card.dataset.desc || "";

  const media = parseMedia(card);
  mediaIndex = 0;

  if (lightboxTitle) lightboxTitle.textContent = title;
  if (lightboxMeta) lightboxMeta.textContent = meta;
  if (lightboxDesc) lightboxDesc.textContent = desc;
  if (lightboxTag) lightboxTag.textContent = meta || "Preview";

  if (media.length) {
    renderStage(media[0]);
    renderThumbs(media);
  } else {
    if (lbStage) lbStage.innerHTML = "";
    if (lbStrip) lbStrip.innerHTML = "";
  }
}

function openLightbox(card) {
  if (!lightbox) return;

  projectList = getVisibleCards();
  projectIndex = Math.max(0, projectList.indexOf(card));
  renderProject(projectList[projectIndex]);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lbStage) lbStage.innerHTML = ""; // stops video
  if (lbStrip) lbStrip.innerHTML = "";
}

function switchProject(delta) {
  if (!projectList.length) return;
  projectIndex = (projectIndex + delta + projectList.length) % projectList.length;
  renderProject(projectList[projectIndex]);
}

document.querySelectorAll(".work-card").forEach(card => {
  card.addEventListener("click", () => openLightbox(card));
});

lbPrevProject?.addEventListener("click", (e) => { e.stopPropagation(); switchProject(-1); });
lbNextProject?.addEventListener("click", (e) => { e.stopPropagation(); switchProject(1); });

lightboxClose?.addEventListener("click", closeLightbox);
lightboxBg?.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") switchProject(-1);
  if (e.key === "ArrowRight") switchProject(1);
});
