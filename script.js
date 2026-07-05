(function () {
  var heroFrame = document.querySelector('.hero .ledger-frame');
  var heroVideo = heroFrame ? heroFrame.querySelector('video') : null;

  if (heroFrame && heroVideo) {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      heroFrame.classList.add('video-unavailable');
    } else {
      heroVideo.addEventListener('error', function () {
        heroFrame.classList.add('video-unavailable');
      });
      if (heroVideo.error) heroFrame.classList.add('video-unavailable');
    }
  }

  var countEls = document.querySelectorAll('[data-count]');
  if (countEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var formatCount = function (el, n) {
      var decimals = parseInt(el.dataset.decimals || '0', 10);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      return prefix + n.toFixed(decimals) + suffix;
    };

    countEls.forEach(function (el) { el.textContent = formatCount(el, 0); });

    var animateCount = function (el) {
      var target = parseFloat(el.dataset.value);
      var duration = 1200;
      var start = null;

      var step = function (timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatCount(el, target * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatCount(el, target);
        }
      };
      requestAnimationFrame(step);
    };

    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countEls.forEach(function (el) { countObserver.observe(el); });
  }

  document.querySelectorAll('.mobile-nav-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstName = contactForm.firstName.value.trim();
      var lastName = contactForm.lastName.value.trim();
      var email = contactForm.email.value.trim();
      var message = contactForm.message.value.trim();
      var subject = 'Website message from ' + firstName + ' ' + lastName;
      var body = 'Name: ' + firstName + ' ' + lastName + '\nEmail: ' + email + '\n\n' + message;
      var mailto = 'mailto:kofodolv@lafayette.edu,duanek@lafayette.edu' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
      var status = document.getElementById('formStatus');
      if (status) {
        status.textContent = 'Opening your email client to send this message to our co-presidents…';
        status.setAttribute('data-state', 'sent');
      }
    });
  }

  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  toggle.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { observer.observe(el); });
})();
