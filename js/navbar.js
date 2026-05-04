(function () {
  'use strict';
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const SCROLL_THRESHOLD = 60;
  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();
