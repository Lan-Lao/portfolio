const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.site-header');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const backToTopButton = document.getElementById('back-to-top');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    const offset = header ? header.offsetHeight + 16 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', targetId);
  });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navAnchors.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
      });
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => navObserver.observe(section));

if (darkModeToggle) {
  const applyDarkMode = (enabled) => {
    document.body.classList.toggle('dark-mode', enabled);
    darkModeToggle.setAttribute('aria-pressed', String(enabled));
    darkModeToggle.textContent = enabled ? 'Light Mode' : 'Dark Mode';
  };

  const storedMode = localStorage.getItem('theme');
  applyDarkMode(storedMode === 'dark');

  darkModeToggle.addEventListener('click', () => {
    const nextDark = !document.body.classList.contains('dark-mode');
    applyDarkMode(nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
  });
}

if (backToTopButton) {
  const toggleBackToTop = () => {
    backToTopButton.classList.toggle('show', window.scrollY > 280);
  };

  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop();

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please complete all fields before submitting.';
      status.style.color = '#f87171';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#f87171';
      return;
    }

    status.textContent = 'Thank you! Your message has been validated.';
    status.style.color = '#34d399';
    form.reset();
  });
}
