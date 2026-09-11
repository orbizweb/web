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

    // Contact Form & Multi-Checkbox Interactive UX with Background Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      // Configuration: Connect to Google Apps Script Web App for automated Google Sheets logging & email dispatch.
      // Follow the steps in GOOGLE_SHEET_SETUP_GUIDE.md to deploy your webhook and paste the URL below:
      const GOOGLE_SCRIPT_WEBHOOK_URL = '';

      // Real-time visual feedback for multi-checkbox interest pills
      contactForm.querySelectorAll('.checkbox-card input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const card = checkbox.closest('.checkbox-card');
          if (card) {
            if (checkbox.checked) {
              card.classList.add('is-checked');
            } else {
              card.classList.remove('is-checked');
            }
          }
        });
      });

      // Clear validation errors on input
      ['contactName', 'contactEmail'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', () => {
            el.classList.remove('has-error');
          });
        }
      });

      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const companyInput = document.getElementById('contactCompany');
        const phoneInput = document.getElementById('contactPhone');
        const messageInput = document.getElementById('contactMessage');
        const statusBox = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitContactBtn');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const company = companyInput ? companyInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        // Validation: Name and Email
        let hasError = false;
        if (!name) {
          if (nameInput) nameInput.classList.add('has-error');
          hasError = true;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
          if (emailInput) emailInput.classList.add('has-error');
          hasError = true;
        }

        if (hasError) {
          if (statusBox) {
            statusBox.style.display = 'block';
            statusBox.setAttribute('role', 'alert');
            statusBox.innerHTML = `
              <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 0.9rem 1.1rem; color: var(--text-main); font-size: 0.9rem;">
                <strong style="color: #ef4444;">Please check required fields:</strong> Provide your Full Name and a valid Work Email so our leadership team can contact you.
              </div>
            `;
          }
          if (!name && nameInput) {
            nameInput.focus();
          } else if (emailInput) {
            emailInput.focus();
          }
          return;
        }

        // Collect multi-checkbox selected areas of interest
        const selectedInterests = [];
        contactForm.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
          selectedInterests.push(cb.value);
        });

        // Visual loading state
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Request Strategic Briefing &rarr;';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Scheduling Briefing...';
          submitBtn.style.opacity = '0.8';
        }

        // Check if Webhook URL is configured
        if (GOOGLE_SCRIPT_WEBHOOK_URL && GOOGLE_SCRIPT_WEBHOOK_URL.trim() !== '') {
          try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('company', company);
            formData.append('phone', phone);
            formData.append('interests', selectedInterests.join(', '));
            formData.append('message', message);

            await fetch(GOOGLE_SCRIPT_WEBHOOK_URL, {
              method: 'POST',
              mode: 'no-cors',
              body: formData
            });

            // Instant On-Screen Confirmation (Visitor Never Leaves Site)
            if (statusBox) {
              statusBox.style.display = 'block';
              statusBox.setAttribute('role', 'status');
              statusBox.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.12); border: 1.5px solid #10b981; border-radius: 10px; padding: 1.5rem; color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">
                  <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem; font-weight: 700; color: #10b981; font-size: 1.15rem;">
                    <span aria-hidden="true" style="font-size: 1.3rem;">&#10003;</span> Briefing Request Received!
                  </div>
                  <p style="margin-bottom: 0.6rem;">Thank you, <strong>${name}</strong>. Your consultation request has been logged and sent directly to Orbiz practice leadership.</p>
                  <p style="margin-bottom: 0; font-size: 0.88rem; color: var(--text-muted);">
                    We have dispatched an alert to our executive team. A practice lead will connect with you at <strong>${email}</strong> within <strong>4 business hours</strong>.
                  </p>
                </div>
              `;
              statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Reset form inputs & checkbox styling
            contactForm.reset();
            contactForm.querySelectorAll('.checkbox-card').forEach(c => c.classList.remove('is-checked'));

          } catch (err) {
            console.error('Submission error:', err);
            // Fallback to mailto if network issues
            triggerMailtoFallback(name, email, company, phone, selectedInterests, message, statusBox);
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
              submitBtn.style.opacity = '1';
            }
          }
        } else {
          // If webhook not yet configured, trigger structured dual mailto fallback
          triggerMailtoFallback(name, email, company, phone, selectedInterests, message, statusBox);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.style.opacity = '1';
          }
        }
      });
    }

    function triggerMailtoFallback(name, email, company, phone, selectedInterests, message, statusBox) {
      const subject = encodeURIComponent(`Executive Briefing Request: ${name}${company ? ' (' + company + ')' : ''}`);
      let body = `Hello Orbiz Leadership,\n\nI would like to request an executive briefing regarding our technology and engineering requirements:\n\n`;
      body += `Full Name: ${name}\n`;
      body += `Work Email: ${email}\n`;
      if (company) body += `Company / Organization: ${company}\n`;
      if (phone) body += `Phone / WhatsApp: ${phone}\n`;
      if (selectedInterests.length > 0) {
        body += `\nSelected Areas of Interest:\n- ${selectedInterests.join('\n- ')}\n`;
      }
      if (message) {
        body += `\nProject Scope & Objectives:\n${message}\n`;
      }
      body += `\nBest regards,\n${name}`;

      // Opens email prefilled to both contact@orbiz.one and orbizweb@gmail.com
      const mailtoUrl = `mailto:contact@orbiz.one?cc=orbizweb@gmail.com&subject=${subject}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;

      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.setAttribute('role', 'status');
        statusBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 1.25rem; color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: 600; color: #10b981; font-size: 1.05rem;">
              <span aria-hidden="true">&#10003;</span> Briefing Request Ready to Dispatch!
            </div>
            <p style="margin-bottom: 0.75rem;">Your default email application has opened with your inquiry pre-filled to <strong>contact@orbiz.one</strong> &amp; <strong>orbizweb@gmail.com</strong>. Simply click <strong>Send</strong>.</p>
            <div style="padding-top: 0.5rem; border-top: 1px dashed rgba(16, 185, 129, 0.3); font-size: 0.85rem; color: var(--text-muted);">
              Didn't see the email prompt? 
              <a href="${mailtoUrl}" style="color: var(--brand-red); font-weight: 600; text-decoration: underline;">Click here to open email directly</a> or email us at 
              <a href="mailto:contact@orbiz.one" style="color: var(--text-main); font-weight: 600;">contact@orbiz.one</a>.
            </div>
          </div>
        `;
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }


