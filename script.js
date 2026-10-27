(() => {
  const STORAGE_KEY = "jaga-sri-portfolio-v1";
  const body = document.body;
  const editToggle = document.getElementById("editToggle");
  const editBanner = document.getElementById("editBanner");
  const saveBtn = document.getElementById("saveBtn");
  const closeEditBtn = document.getElementById("closeEditBtn");
  const exportBtn = document.getElementById("exportBtn");
  const toast = document.getElementById("toast");
  let editing = false;
  let toastTimer;

  const editableFields = () => [...document.querySelectorAll("[data-edit]")];
  const listFields = () => [...document.querySelectorAll("[data-edit-list]")];
  const linkFields = () => [...document.querySelectorAll("[data-link]")];

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function collectProfile() {
    const fields = {};
    editableFields().forEach(el => fields[el.dataset.edit] = el.textContent.trim());
    const lists = {};
    listFields().forEach(el => lists[el.dataset.editList] = [...el.querySelectorAll("span")].map(s => s.textContent.trim()));
    const links = {};
    linkFields().forEach(el => links[el.dataset.link] = el.getAttribute("href") || "");
    return { fields, lists, links };
  }

  function renderList(el, values) {
    el.innerHTML = "";
    values.forEach(value => {
      const span = document.createElement("span");
      span.textContent = value;
      el.appendChild(span);
    });
  }

  function applyProfile(profile) {
    if (!profile) return;
    editableFields().forEach(el => {
      const value = profile.fields && profile.fields[el.dataset.edit];
      if (typeof value === "string") el.textContent = value;
    });
    listFields().forEach(el => {
      const value = profile.lists && profile.lists[el.dataset.editList];
      if (Array.isArray(value)) renderList(el, value);
    });
    linkFields().forEach(el => {
      const value = profile.links && profile.links[el.dataset.link];
      if (typeof value === "string" && value.trim()) el.setAttribute("href", value);
    });
    updateLinkLabels();
  }

  function updateLinkLabels() {
    const map = {
      project1Url: "project1Url", project2Url: "project2Url",
      project3Url: "project3Url", project4Url: "project4Url"
    };
    Object.keys(map).forEach(key => {
      const el = document.querySelector(`[data-link="${key}"]`);
      if (el) {
        const valid = el.getAttribute("href") && el.getAttribute("href") !== "#";
        el.style.opacity = valid ? "1" : ".45";
        el.title = valid ? "Open project repository" : "Add a repository URL in edit mode";
      }
    });
  }

  function enterEditMode() {
    editing = true;
    body.classList.add("editing");
    editBanner.hidden = false;
    editToggle.textContent = "✓ Editing";
    editableFields().forEach(el => {
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
      el.setAttribute("aria-label", "Editable text: " + el.dataset.edit);
    });
    listFields().forEach(el => el.setAttribute("tabindex", "0"));
    notify("Edit mode enabled. Click text or a skill group to change it.");
  }

  function exitEditMode() {
    editing = false;
    body.classList.remove("editing");
    editBanner.hidden = true;
    editToggle.textContent = "✎ Edit portfolio";
    editableFields().forEach(el => {
      el.removeAttribute("contenteditable");
      el.removeAttribute("spellcheck");
      el.removeAttribute("aria-label");
    });
    listFields().forEach(el => el.removeAttribute("tabindex"));
  }

  function saveProfile(showToast = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collectProfile()));
      if (showToast) notify("Saved in this browser. Export a backup before clearing browser data.");
    } catch (err) {
      notify("Could not save in this browser. Export your profile JSON as a backup.");
    }
  }

  function normalizeUrl(raw, type) {
    const value = raw.trim();
    if (!value) return "";
    if (type === "email") {
      const email = value.replace(/^mailto:/i, "");
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "mailto:" + email : null;
    }
    if (value === "#") return "#";
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : "https://" + value);
      if (!["http:", "https:"].includes(url.protocol)) return null;
      return url.href;
    } catch { return null; }
  }

  editToggle.addEventListener("click", () => editing ? exitEditMode() : enterEditMode());
  closeEditBtn.addEventListener("click", () => { saveProfile(false); exitEditMode(); notify("Changes saved and edit mode closed."); });
  saveBtn.addEventListener("click", () => saveProfile());

  document.addEventListener("click", event => {
    if (!editing) return;
    const list = event.target.closest("[data-edit-list]");
    if (list) {
      event.preventDefault();
      const key = list.dataset.editList;
      const current = [...list.querySelectorAll("span")].map(s => s.textContent).join(", ");
      const value = prompt("Edit this group. Separate each item with a comma:", current);
      if (value !== null) {
        const items = value.split(",").map(s => s.trim()).filter(Boolean).slice(0, 18);
        renderList(list, items);
        saveProfile(false);
        notify("Skill / tag group updated.");
      }
      return;
    }
    const link = event.target.closest("[data-link]");
    if (link) {
      event.preventDefault();
      const key = link.dataset.link;
      const current = link.getAttribute("href") || "";
      const promptText = key === "email" ? "Enter your email address:" :
        key.toLowerCase().includes("url") ? "Enter the full project repository URL (for example, https://github.com/username/repo):" :
        "Enter the full URL (for example, https://github.com/your-username):";
      const raw = prompt(promptText, current === "#" ? "" : current);
      if (raw === null) return;
      const type = key === "email" ? "email" : "url";
      const value = normalizeUrl(raw, type);
      if (value === null) { notify("That link does not look valid. Please try again."); return; }
      link.setAttribute("href", value || "#");
      if (key === "email") {
        const emailText = raw.replace(/^mailto:/i, "").trim() || "your.email@example.com";
        document.querySelectorAll('[data-edit="emailText"],[data-edit="emailText2"]').forEach(el => el.textContent = emailText);
      }
      saveProfile(false);
      notify("Link updated.");
    }
  });

  exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(collectProfile(), null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "portfolio-profile.json"; a.click();
    URL.revokeObjectURL(url);
    notify("Profile JSON exported.");
  });

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); menuToggle.textContent = "☰";
  }));

  document.getElementById("year").textContent = new Date().getFullYear();
  try {
    if (!localStorage.getItem("portfolio-reset-done")) {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem("portfolio-reset-done", "yes");
}

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) applyProfile(JSON.parse(saved));
  } catch { /* Ignore malformed browser storage; the starter content remains usable. */ }
  updateLinkLabels();


})();