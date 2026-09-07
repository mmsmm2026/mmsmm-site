document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('nav.main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.classList.contains('nav-open')) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    statNums.forEach(function (el) {
      el.textContent = el.getAttribute('data-target');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNums.forEach(function (el) { observer.observe(el); });
});

document.addEventListener('DOMContentLoaded', function () {
  var shareButtons = document.querySelectorAll('[data-share]');
  if (!shareButtons.length) return;

  var shareMessage = "I'm proud to support MMSMM \u2014 helping wounded IDF soldiers heal, body, mind, and soul. Learn how you can help too:";
  var fallbackUrl = 'https://mmsmm.com/get-involved.html';

  shareButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var platform = btn.getAttribute('data-share');
      var isRealUrl = window.location.protocol === 'http:' || window.location.protocol === 'https:';
      var pageUrl = isRealUrl ? window.location.href : fallbackUrl;

      if (platform === 'facebook') {
        var fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '&quote=' + encodeURIComponent(shareMessage);
        window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=520');
      } else if (platform === 'whatsapp') {
        var waUrl = 'https://wa.me/?text=' + encodeURIComponent(shareMessage + ' ' + pageUrl);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var forms = document.querySelectorAll('form[data-ajax-form]');
  if (!forms.length) return;

  forms.forEach(function (form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            if (statusEl) {
              statusEl.textContent = "Thanks \u2014 your message has been sent. We'll be in touch soon.";
              statusEl.className = 'form-status success';
            }
          } else {
            return response.json().then(function (data) {
              throw new Error((data && data.error) || 'Submission failed');
            });
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = "Something went wrong sending your message. Please try again or email us directly.";
            statusEl.className = 'form-status error';
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
        });
    });
  });
});
