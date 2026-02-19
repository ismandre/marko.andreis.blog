(function () {
  var el = document.createElement('div');
  el.id = 'chalk-cursor';
  document.body.appendChild(el);

  document.addEventListener('mousemove', function (e) {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY-2 + 'px';
  });

  document.addEventListener('mouseleave', function () {
    el.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    el.style.opacity = '1';
  });

  var sel = 'a, button, [role="button"], input[type="submit"], input[type="button"], label';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(sel)) el.classList.add('is-circling');
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(sel)) el.classList.remove('is-circling');
  });
}());
