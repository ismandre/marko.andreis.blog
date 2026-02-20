(function () {
  // ─── CHALK COLOR PALETTE ────────────────────────────────────────────────────
  var CHALK_COLORS = {
    default:     { r: 244, g: 241, b: 229, hex: '#F4F1E5' },
    anger:       { r: 252, g:  49, b:  65, hex: '#FC3141' },
    orange:      { r: 253, g: 166, b: 102, hex: '#FDA666' },
    honeysuckle: { r: 247, g: 253, b: 128, hex: '#F7FD80' },
    adonis:      { r:  92, g: 167, b: 251, hex: '#5CA7FB' },
    nicole:      { r: 144, g: 134, b: 227, hex: '#9086E3' },
  };

  function getChalkColor() {
    var colorKey = localStorage.getItem('chalk-color') || 'default';
    var color = CHALK_COLORS[colorKey] || CHALK_COLORS.default;
    return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0.9)';
  }

  function rand(scale) {
    return (Math.random() - 0.5) * scale;
  }

  // Generates a wobbly closed ellipse path with a slight hand-drawn overshoot
  function chalkyPath(cx, cy, rx, ry) {
    var K = 0.5523; // cubic bezier approximation constant for ellipses
    var jx = function () { return rand(rx * 0.1); };
    var jy = function () { return rand(ry * 0.1); };

    // Four cardinal points with jitter
    var tx = cx + jx(), ty = cy - ry + jy(); // top
    var ex = cx + rx + jx(), ey = cy       + jy(); // right
    var bx = cx + jx(), by = cy + ry       + jy(); // bottom
    var wx = cx - rx + jx(), wy = cy       + jy(); // left

    return [
      'M', tx, ty,
      'C', cx + rx * K + jx(), cy - ry + jy(),
           cx + rx + jx(),     cy - ry * K + jy(),
           ex, ey,
      'C', cx + rx + jx(),     cy + ry * K + jy(),
           cx + rx * K + jx(), cy + ry + jy(),
           bx, by,
      'C', cx - rx * K + jx(), cy + ry + jy(),
           cx - rx + jx(),     cy + ry * K + jy(),
           wx, wy,
      'C', cx - rx + jx(),     cy - ry * K + jy(),
           cx - rx * K + jx(), cy - ry + jy(),
           tx, ty,
      // slight overshoot past start for hand-drawn feel
      'C', cx - rx * 0.1 + jx(), cy - ry * 1.18 + jy(),
           cx + rx * 0.35 + jx(), cy - ry * 1.05 + jy(),
           cx + rx * 0.2  + jx(), cy - ry * 0.88 + jy()
    ].join(' ');
  }

  var ns = 'http://www.w3.org/2000/svg';

  var overlay = document.createElementNS(ns, 'svg');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:10000;overflow:visible';
  document.body.appendChild(overlay);

  function circleAndGo(link) {
    var href  = link.getAttribute('href');
    var isNew = link.getAttribute('target') === '_blank';
    var rect  = link.getBoundingClientRect();
    var pad   = 10;
    var cx = rect.left + rect.width  / 2;
    var cy = rect.top  + rect.height / 2;
    var rx = Math.max(rect.width  / 2 + pad, 32);
    var ry = Math.max(rect.height / 2 + pad, 14);

    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', chalkyPath(cx, cy, rx, ry));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', getChalkColor());
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linecap', 'round');
    overlay.appendChild(path);

    var len = path.getTotalLength();
    path.style.strokeDasharray  = len;
    path.style.strokeDashoffset = len;
    path.style.transition = 'stroke-dashoffset 0.52s ease-out';

    // Double rAF ensures transition fires after the initial dashoffset is painted
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        path.style.strokeDashoffset = '0';
      });
    });

    setTimeout(function () {
      if (isNew) {
        window.open(href, '_blank', 'noopener noreferrer');
      } else {
        window.location.href = href;
      }
      setTimeout(function () {
        if (path.parentNode) overlay.removeChild(path);
      }, 200);
    }, 600);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    // Skip anchor-only and javascript: links — let them work normally
    if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return;
    e.preventDefault();
    circleAndGo(link);
  });
}());
