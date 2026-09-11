    // Theme Switcher
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    // Default system is natively dark. Only override if light theme was explicitly saved.
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      root.setAttribute('data-theme', 'light');
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    } else {
      root.removeAttribute('data-theme');
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
      if (root.getAttribute('data-theme') === 'light') {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
      }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // FAQ Accordion Toggle
    document.addEventListener('click', (e) => {
      const questionBtn = e.target.closest('.faq-question');
      if (questionBtn) {
        const faqItem = questionBtn.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Optional: close other open items in the same container
        const container = faqItem.closest('.faq-container');
        if (container) {
          container.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
              item.classList.remove('active');
              const btn = item.querySelector('.faq-question');
              if (btn) btn.setAttribute('aria-expanded', 'false');
            }
          });
        }

        faqItem.classList.toggle('active');
        questionBtn.setAttribute('aria-expanded', !isActive);
      }

      // Mobile dropdown toggle
      const dropdownToggle = e.target.closest('.dropdown-toggle');
      if (dropdownToggle && window.innerWidth <= 900) {
        const parent = dropdownToggle.closest('.nav-item-dropdown');
        if (parent) {
          e.preventDefault();
          parent.classList.toggle('mobile-open');
        }
      }
    });
