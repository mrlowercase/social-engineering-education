/**
 * Social Engineering Education Website — main.js
 * Author: Arvel Bon Dagcuta
 */

(function () {
  'use strict';

  /* ============================================================
     NAVIGATION — sticky scroll state & active link highlighting
     ============================================================ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class for shadow
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 90;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ============================================================
     THEME TOGGLE — Light/Dark Mode
     ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme');

  // Apply initial theme
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  /* ============================================================
     MOBILE NAVIGATION TOGGLE
     ============================================================ */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     SCROLL REVEAL — IntersectionObserver
     ============================================================ */
  function initReveal() {
    // Add reveal class to target elements
    const revealTargets = [
      '.overview-card',
      '.attack-card',
      '.consequence-item',
      '.prevention-card',
      '.article-card',
      '.reflection-paragraph',
      '.reference-item',
      '.stat-bar',
      '.discussion-block',
      '.section-header',
      '.about-layout',
    ];

    revealTargets.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('reveal');
      });
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // Only use IntersectionObserver if supported; otherwise show all
  if ('IntersectionObserver' in window) {
    initReveal();
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================================================
     SMOOTH SCROLL — polyfill for browsers without native support
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navH   = navbar ? navbar.offsetHeight : 68;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     STAGGER ANIMATION for grids
     ============================================================ */
  function staggerGrids() {
    const grids = [
      '.overview-cards',
      '.attack-grid',
      '.prevention-grid',
      '.articles-grid',
      '.consequence-list',
    ];

    grids.forEach(function (selector) {
      const grid = document.querySelector(selector);
      if (!grid) return;

      grid.classList.add('reveal-stagger');

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05 }
      );

      observer.observe(grid);
    });
  }

  if ('IntersectionObserver' in window) {
    staggerGrids();
  }

})();
