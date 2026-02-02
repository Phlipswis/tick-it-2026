// Theme Management
type Theme = 'light' | 'dark' | 'high-contrast';

const THEME_KEY = 'tick-it-theme';

// Get current theme from localStorage or default to 'light' if high contrast is not preferred
function getCurrentTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (
    savedTheme === 'light' ||
    savedTheme === 'dark' ||
    savedTheme === 'high-contrast'
  ) {
    return savedTheme;
  } //If no theme is saved and prefers-contrast is set to more, set high-contrast as theme
  if (window.matchMedia('(prefers-contrast: more)').matches) {
    return 'high-contrast';
  }
  return 'light';
}

// Apply theme to document
function applyTheme(theme: Theme): void {
  // Remove all theme attributes first
  document.documentElement.removeAttribute('data-theme');

  // Force a reflow
  void document.documentElement.offsetHeight;
  // https://stackoverflow.com/questions/21664940/force-browser-to-trigger-reflow-while-changing-css
  // It just works. - Todd Howard

  // Set new theme
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);

  // Save to localStorage
  localStorage.setItem(THEME_KEY, theme);

  // Update logo based on theme
  updateLogo(theme);

  // Update button states
  updateButtonStates(theme);

  console.log('Theme applied:', theme);
}

// Update logo based on current theme
function updateLogo(theme: Theme): void {
  const logoElement = document.getElementById('theme-logo') as HTMLImageElement;
  if (!logoElement) return;

  const logoMap: Record<Theme, string> = {
    light: './images/logo_lightmode.svg',
    dark: './images/logo_darkmode.svg',
    'high-contrast': './images/logo_high_contrast.svg'
  };

  logoElement.src = logoMap[theme];
}

// Update active button state
function updateButtonStates(activeTheme: Theme): void {
  document.querySelectorAll('.theme-btn').forEach((btn) => {
    if (btn instanceof HTMLButtonElement) {
      const btnTheme = btn.getAttribute('data-theme');
      if (btnTheme === activeTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
}

// Initialize theme buttons
function initThemeButtons(): void {
  document.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const theme = btn.getAttribute('data-theme');
      if (theme === 'light' || theme === 'dark' || theme === 'high-contrast') {
        applyTheme(theme);
      }
    });
  });
}

// Initialize theme on page load
function initTheme(): void {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);

  // Wait for DOM to be fully loaded before attaching button listeners
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeButtons);
  } else {
    initThemeButtons();
  }
}

// Apply theme immediately (before DOM is ready)
const initialTheme = getCurrentTheme();
document.documentElement.setAttribute('data-theme', initialTheme);
document.body.setAttribute('data-theme', initialTheme);

// Initialize when script loads
initTheme();
