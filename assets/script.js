    // Theme Switcher
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    function updateThemeUI(theme) {
      if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
        if (moonIcon) moonIcon.style.display = 'block';
        if (sunIcon) sunIcon.style.display = 'none';
        if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      } else {
        root.removeAttribute('data-theme');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'block';
        if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light theme');
      }
    }

    // Default system is natively dark. Only override if light theme was explicitly saved.
    const savedTheme = localStorage.getItem('theme');
    updateThemeUI(savedTheme === 'light' ? 'light' : 'dark');

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        const newTheme = isLight ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);
      });
    }

    // Mobile Menu Toggle & Keyboard Trap/Escape Handling
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    function closeMobileMenu() {
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileMenuBtn) {
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.focus();
        }
      }
    }

    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close menu on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          if (navLinks.classList.contains('active')) {
            closeMobileMenu();
          }
          // Also close any open dropdowns
          document.querySelectorAll('.nav-item-dropdown.mobile-open').forEach(dropdown => {
            dropdown.classList.remove('mobile-open');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up');
    if ('IntersectionObserver' in window) {
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
    } else {
      // Fallback for browsers without IntersectionObserver
      fadeElements.forEach(el => el.classList.add('visible'));
    }

    // Global Click Delegation for Accordions & Dropdowns
    document.addEventListener('click', (e) => {
      // FAQ Accordion Toggle
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
        questionBtn.setAttribute('aria-expanded', (!isActive).toString());
      }

      // Careers Job Card Accordion Toggle
      const jobBtn = e.target.closest('.job-card-header');
      if (jobBtn) {
        const jobCard = jobBtn.closest('.job-card');
        if (jobCard) {
          const isCurrentlyActive = jobCard.classList.contains('active');
          jobCard.classList.toggle('active');
          jobBtn.setAttribute('aria-expanded', (!isCurrentlyActive).toString());
        }
      }
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const companyInput = document.getElementById('contactCompany');
        const phoneInput = document.getElementById('contactPhone');
        const messageInput = document.getElementById('contactMessage');
        const statusBox = document.getElementById('formStatus');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const company = companyInput ? companyInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        // Collect multi-checkbox selected areas of interest
        const selectedInterests = [];
        contactForm.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
          selectedInterests.push(cb.value);
        });

        const subject = encodeURIComponent(`Consultation Request: ${name}${company ? ' (' + company + ')' : ''}`);
        let body = `Name: ${name}\nWork Email: ${email}\n`;
        if (company) body += `Company: ${company}\n`;
        if (phone) body += `Phone: ${phone}\n`;
        if (selectedInterests.length > 0) {
          body += `Areas of Interest: ${selectedInterests.join('; ')}\n`;
        }
        if (message) {
          body += `\nProject Details & Objectives:\n${message}\n`;
        }

        // Open user's email client with prefilled details
        const mailtoUrl = `mailto:contact@orbiz.one?subject=${subject}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;

        // Accessible on-screen confirmation
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 1.25rem; color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: 600; color: #10b981; font-size: 1.05rem;">
                <span aria-hidden="true">&#10003;</span> Consultation Request Prepared!
              </div>
              <p style="margin-bottom: 0.5rem;">Your default email application has opened with your inquiry pre-filled. Please review and press send.</p>
              <p style="margin-bottom: 0; font-size: 0.85rem; color: var(--text-muted);">
                If your email client did not open automatically, you can send your inquiry directly to: 
                <a href="mailto:contact@orbiz.one" style="color: var(--brand-red); font-weight: 600; text-decoration: underline;">contact@orbiz.one</a>
              </p>
            </div>
          `;
          statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }


