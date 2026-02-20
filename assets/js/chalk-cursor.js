(function () {
  if (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) return;

  var el = document.createElement('div');
  el.id = 'chalk-cursor';
  // Hide immediately: no mouse events fire when the page loads with the
  // pointer already over it, so the element would sit at 0,0 until the
  // user moves the mouse.  We reveal it only once we have a real position.
  el.style.opacity = '0';
  document.body.appendChild(el);

  function setPos(e) {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY - 2 + 'px';
  }

  document.addEventListener('mousemove', function (e) {
    setPos(e);
    el.style.opacity = '1';
  });

  document.addEventListener('mouseleave', function () {
    el.style.opacity = '0';
  });

  // mouseenter carries clientX/clientY, so we can position the cursor
  // correctly the instant the pointer crosses into the viewport.
  document.addEventListener('mouseenter', function (e) {
    setPos(e);
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
