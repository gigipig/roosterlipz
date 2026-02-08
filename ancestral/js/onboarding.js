/**
 * Landing page module
 * Handles the landing page display and transition to the main app
 */

/**
 * Initialize the landing page
 * Skip landing page if user has saved data (returning user)
 */
function initOnboarding() {
  if (userHasSavedData()) {
    hideLandingPage();
    return;
  }

  // Setup landing page interactions
  setupLandingPage();
}

/**
 * Setup landing page event handlers
 */
function setupLandingPage() {
  // CTA buttons → launch app
  const heroCta = document.getElementById('hero-get-started');
  const navCta = document.getElementById('nav-get-started');

  if (heroCta) heroCta.addEventListener('click', launchApp);
  if (navCta) navCta.addEventListener('click', launchApp);

  // FAQ accordion
  document.querySelectorAll('.faq-item-landing .faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item-landing').forEach(el => el.classList.remove('open'));
      // Toggle clicked
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Footer modal links
  document.querySelectorAll('.landing-footer .footer-link[data-modal]').forEach(link => {
    link.addEventListener('click', () => {
      const modalType = link.dataset.modal;
      if (modalType === 'methodology') {
        showMethodologyModal();
      } else {
        showModal(`${modalType}-modal`);
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('.landing-nav-links a[href^="#"], .hero-secondary[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/**
 * Launch the main app (hide landing, show app)
 */
function launchApp() {
  hideLandingPage();
}

/**
 * Hide landing page and show the main app
 */
function hideLandingPage() {
  const landing = document.getElementById('landing-page');
  const app = document.getElementById('app-container');

  if (landing) landing.classList.add('hidden');
  if (app) app.style.display = 'flex';
  document.body.classList.add('app-active');
}

// Keep old function name as alias for compatibility
function hideOnboarding() {
  hideLandingPage();
}
