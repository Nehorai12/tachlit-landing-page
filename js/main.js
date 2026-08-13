/* ===================================================
   TACHLIT – Landing Page Scripts
   =================================================== */

(function () {
  'use strict';

  // --- Header scroll effect ---
  var header = document.querySelector('.header');
  var lastScroll = 0;

  function onScroll() {
    var scrollY = window.pageYOffset;
    if (scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Mobile menu ---
  var menuToggle = document.querySelector('.header__mobile-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.setAttribute('aria-hidden', String(isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // --- Floating CTA (mobile) ---
  var floatingCta = document.getElementById('floating-cta');
  var heroSection = document.getElementById('hero');
  var contactSection = document.getElementById('contact');

  function updateFloatingCta() {
    if (!floatingCta || window.innerWidth >= 1024) return;
    var heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
    var contactTop = contactSection ? contactSection.getBoundingClientRect().top : Infinity;
    var windowHeight = window.innerHeight;

    if (heroBottom < 0 && contactTop > windowHeight) {
      floatingCta.classList.add('floating-cta--visible');
      floatingCta.setAttribute('aria-hidden', 'false');
    } else {
      floatingCta.classList.remove('floating-cta--visible');
      floatingCta.setAttribute('aria-hidden', 'true');
    }
  }

  window.addEventListener('scroll', updateFloatingCta, { passive: true });
  window.addEventListener('resize', updateFloatingCta, { passive: true });

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq__item');
      var answer = item.querySelector('.faq__answer');
      var inner = answer.querySelector('.faq__answer-inner');
      var isOpen = item.getAttribute('data-open') === 'true';

      // Close all others
      document.querySelectorAll('.faq__item[data-open="true"]').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.setAttribute('data-open', 'false');
          openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq__answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.setAttribute('data-open', 'false');
        this.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        item.setAttribute('data-open', 'true');
        this.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + 20 + 'px';
        trackEvent('faq-open', this.querySelector('span').textContent);
      }
    });
  });

  // --- Testimonials Carousel ---
  var track = document.getElementById('testimonials-track');
  var prevBtn = document.getElementById('testimonials-prev');
  var nextBtn = document.getElementById('testimonials-next');
  var dotsContainer = document.getElementById('testimonials-dots');
  var currentSlide = 0;
  var slidesPerView = 1;
  var totalCards = 0;
  var totalSlides = 0;

  function getSlideCount() {
    if (!track) return;
    totalCards = track.children.length;
    if (window.innerWidth >= 1024) {
      slidesPerView = 3;
    } else if (window.innerWidth >= 768) {
      slidesPerView = 2;
    } else {
      slidesPerView = 1;
    }
    totalSlides = Math.ceil(totalCards / slidesPerView);
    if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;
  }

  function updateCarousel() {
    if (!track) return;
    var gap = parseInt(getComputedStyle(track).gap) || 24;
    var cardWidth = track.children[0].offsetWidth;
    var offset = currentSlide * (cardWidth + gap) * slidesPerView;
    // RTL: use positive translateX
    track.style.transform = 'translateX(' + offset + 'px)';
    updateDots();
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.className = 'testimonials__dot' + (i === currentSlide ? ' testimonials__dot--active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'המלצות ' + (i + 1));
      dot.setAttribute('aria-selected', String(i === currentSlide));
      dot.dataset.slide = i;
      dot.addEventListener('click', function () {
        currentSlide = parseInt(this.dataset.slide);
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.testimonials__dot').forEach(function (dot, idx) {
      dot.classList.toggle('testimonials__dot--active', idx === currentSlide);
      dot.setAttribute('aria-selected', String(idx === currentSlide));
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });
  }

  // Touch support for carousel
  if (track) {
    var touchStartX = 0;
    var touchEndX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      // RTL: swipe directions are reversed
      if (Math.abs(diff) > 50) {
        if (diff < 0 && currentSlide < totalSlides - 1) {
          currentSlide++;
          updateCarousel();
        } else if (diff > 0 && currentSlide > 0) {
          currentSlide--;
          updateCarousel();
        }
      }
    }, { passive: true });
  }

  function initCarousel() {
    getSlideCount();
    buildDots();
    updateCarousel();
  }

  window.addEventListener('resize', function () {
    getSlideCount();
    buildDots();
    updateCarousel();
  });

  // --- Form Validation ---
  var form = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      // Reset all errors
      form.querySelectorAll('.form__group').forEach(function (group) {
        group.classList.remove('form__group--error');
      });
      form.querySelectorAll('.form__input').forEach(function (input) {
        input.classList.remove('form__input--error');
      });

      // Validate required fields
      var name = form.querySelector('#full-name');
      if (!name.value.trim()) {
        showError(name);
        isValid = false;
      }

      var age = form.querySelector('#age');
      var ageVal = parseInt(age.value);
      if (!age.value || isNaN(ageVal) || ageVal < 14 || ageVal > 25) {
        showError(age);
        isValid = false;
      }

      var phone = form.querySelector('#phone');
      var phoneVal = phone.value.replace(/[\s\-()]/g, '');
      if (!phoneVal || phoneVal.length < 9 || phoneVal.length > 13) {
        showError(phone);
        isValid = false;
      }

      if (!isValid) return;

      // Submit
      var submitBtn = form.querySelector('.form__submit');
      submitBtn.classList.add('btn--loading');
      submitBtn.disabled = true;

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.style.display = 'none';
            formSuccess.classList.add('form__success--visible');
            trackEvent('form-submit-success');
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          submitBtn.classList.remove('btn--loading');
          submitBtn.disabled = false;
          alert('אירעה שגיאה בשליחת הטופס. נסו שוב או פנו אלינו ישירות.');
        });

      trackEvent('form-submit');
    });
  }

  function showError(input) {
    input.classList.add('form__input--error');
    input.closest('.form__group').classList.add('form__group--error');
  }

  // --- Scroll Reveal ---
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  // --- Analytics Event Tracking ---
  function trackEvent(eventName, eventData) {
    // Ready for GA/GTM integration
    // Replace with your analytics implementation
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, { event_label: eventData || '' });
    } else if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({ event: eventName, eventData: eventData || '' });
    }
    // Console log for development
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('[Analytics]', eventName, eventData || '');
    }
  }

  // Track CTA clicks
  document.querySelectorAll('[data-analytics]').forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent(this.dataset.analytics, this.textContent.trim());
    });
  });

  // Track scroll depth
  var scrollMilestones = { 50: false, 90: false };

  window.addEventListener('scroll', function () {
    var scrollPercent = Math.round(
      (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercent >= 50 && !scrollMilestones[50]) {
      scrollMilestones[50] = true;
      trackEvent('scroll-depth', '50%');
    }
    if (scrollPercent >= 90 && !scrollMilestones[90]) {
      scrollMilestones[90] = true;
      trackEvent('scroll-depth', '90%');
    }
  }, { passive: true });

  // --- Init ---
  onScroll();
  initCarousel();
  updateFloatingCta();
})();
