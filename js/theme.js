/**
 * Theme switcher: light and dark themes with a saved preference.
 * The page is readable in the default theme without this script.
 */

/** localStorage key for the saved preference. */
const THEME_KEY = "theme";

/** Theme used when nothing is saved or storage is unavailable. */
const DEFAULT_THEME = "dark";

const toggle = document.querySelector("#theme-toggle");

/**
 * Read the saved theme, or fall back to the default.
 * @returns {string} "light" or "dark"
 */
function loadTheme() {
  try {
    // getItem returns null when nothing is saved. Return the saved value or DEFAULT_THEME.
    const saved = localStorage.getItem(THEME_KEY);
    return saved || DEFAULT_THEME;
  } catch (error) {
    // Storage is blocked. Warn and return DEFAULT_THEME.
    console.warn("Theme preference could not be accessed from local storage. Applying default.");
    return DEFAULT_THEME;
  }
}

/**
 * Try to save the theme. Failure is allowed; the page keeps the theme either way.
 * @param {string} theme
 * @returns {void}
 */
function saveTheme(theme) {
  try {
    // setItem
    localStorage.setItem(THEME_KEY,theme);
  } catch (error) {
    // Warn only.
    console.warn("Local theme can't be saved.");
  }
}

/**
 * Put the theme on the html element and update the button label.
 * The one place that knows how a theme is applied.
 * @param {string} theme
 * @returns {void}
 */
function applyTheme(theme) {
  // document.documentElement.dataset.theme = ...
  // if the toggle exists, set its textContent to name the opposite action
  document.documentElement.dataset.theme = theme;
  if(toggle) toggle.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
}

/**
 * Switch to the other theme, apply it, then try to save it.
 * @returns {void}
 */
function toggleTheme() {
  // current = html element's data-theme, or DEFAULT_THEME
  // next = the opposite of current
  // apply, then save, in that order
  const current = document.documentElement.dataset.theme || DEFAULT_THEME;
  const next = current === "dark" ? "light":"dark";
  applyTheme(next);
  saveTheme(next);
}

// Page load: apply whatever was saved before anyone sees the button.
applyTheme(loadTheme());

// Only pages with the control reach this point in a useful way.
if (toggle) {
  toggle.hidden = false;
  toggle.addEventListener("click", toggleTheme);
}