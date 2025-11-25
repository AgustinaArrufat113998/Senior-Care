const toggles = {
  notifEmail: document.getElementById("notifEmail"),
  notifSms: document.getElementById("notifSms"),
  notifInapp: document.getElementById("notifInapp"),
  privacyPhone: document.getElementById("privacyPhone"),
  privacyRating: document.getElementById("privacyRating"),
};

const languageSelect = document.getElementById("settingLanguage");
const emailLabel = document.getElementById("settingEmail");
const msgEl = document.getElementById("settingsMsg");

const STORAGE_KEY = "seniorcareSettings";

const defaultPrefs = {
  notifEmail: true,
  notifSms: false,
  notifInapp: true,
  privacyPhone: true,
  privacyRating: true,
  language: "es",
};

const showMsg = (text, type = "info") => {
  if (!msgEl) return;
  const colors = { info: "#0d6efd", success: "green", error: "red", warning: "orange" };
  msgEl.textContent = text;
  msgEl.style.color = colors[type] || "#0d6efd";
};

const getUserEmail = () => {
  const user = JSON.parse(localStorage.getItem("userData") || "null");
  return user?.email || "No configurado";
};

const loadPrefs = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return { ...defaultPrefs, ...(saved || {}) };
  } catch {
    return { ...defaultPrefs };
  }
};

const paintPrefs = (prefs) => {
  Object.entries(toggles).forEach(([key, el]) => {
    if (el) el.checked = Boolean(prefs[key]);
  });
  if (languageSelect) languageSelect.value = prefs.language || "es";
  if (emailLabel) emailLabel.textContent = getUserEmail();
};

const savePrefs = () => {
  const prefs = {
    notifEmail: toggles.notifEmail?.checked,
    notifSms: toggles.notifSms?.checked,
    notifInapp: toggles.notifInapp?.checked,
    privacyPhone: toggles.privacyPhone?.checked,
    privacyRating: toggles.privacyRating?.checked,
    language: languageSelect?.value || "es",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  showMsg("Configuración guardada.", "success");
};

const restoreDefaults = () => {
  paintPrefs(defaultPrefs);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPrefs));
  showMsg("Configuración restablecida.", "info");
};

document.addEventListener("DOMContentLoaded", () => {
  paintPrefs(loadPrefs());

  document.getElementById("saveSettings")?.addEventListener("click", savePrefs);
  document.getElementById("restoreSettings")?.addEventListener("click", restoreDefaults);
});
