// Minimal navbar script - handles burger menu toggle only
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Burger menu toggle functionality
    var burger = document.querySelector('.navbar__burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
      var navbar = burger.closest('.navbar');
      var isOpen = navbar.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen);
    });
  });
})();
