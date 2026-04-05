// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initBackToTop();
  initContactForm();
  initMobileMenu();
  initCountUp();
});

// ===== Navbar Scroll Effect =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ===== Smooth Scrolling =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          menuToggle.classList.remove('active');
        }
      }
    });
  });
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

// ===== Back to Top Button =====
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Contact Form =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (name && email && message) {
        // Hide form, show success
        form.style.display = 'none';
        successMsg.classList.add('show');

        // Reset form after 3 seconds
        setTimeout(() => {
          form.reset();
          form.style.display = 'block';
          successMsg.classList.remove('show');
        }, 4000);
      }
    });
  }
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

// ===== Count Up Animation =====
function initCountUp() {
  const stats = document.querySelectorAll('.hero-stat .number');

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = element.getAttribute('data-count');
        const suffix = element.getAttribute('data-suffix') || '';
        const prefix = element.getAttribute('data-prefix') || '';
        animateCount(element, parseInt(target), prefix, suffix);
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  stats.forEach(stat => observer.observe(stat));
}

function animateCount(element, target, prefix, suffix) {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const duration = 1500;
  const stepTime = duration / (target / increment);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = prefix + current + suffix;
  }, stepTime);
}

// ===== Newsletter Form =====
document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value.trim()) {
        const btn = newsletterForm.querySelector('button');
        btn.textContent = '✓ Subscribed!';
        btn.style.background = 'var(--green-600)';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
        }, 3000);
      }
    });
  }
});
