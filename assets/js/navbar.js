document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.navbar__burger');
  if (!burger) return;

  burger.addEventListener('click', function () {
    var navbar = burger.closest('.navbar');
    var isOpen = navbar.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen);
  });
});
