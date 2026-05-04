(function () {
  "use strict";
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const body = document.body;
  if (!hamburger || !mobileMenu) return;
  let isOpen = false;
  function openMenu() {
    isOpen = true;
    hamburger.classList.add("open");
    mobileMenu.classList.add("open");
    body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
  }
  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }
  hamburger.addEventListener("click", toggleMenu);
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (
      isOpen &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-controls", "mobile-menu");
})();
