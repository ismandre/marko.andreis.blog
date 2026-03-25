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
    return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0.6)';
  }

  function rand(scale) {
    return (Math.random() - 0.5) * scale;
  }

  // ─── REALISTIC CHALK ELLIPSE PATH GENERATOR ─────────────────────────────────
  // Creates a highly irregular, hand-drawn ellipse with:
  // - Dense interpolation for continuous wobble
  // - Per-segment jitter and deviation
  // - Intentional imperfections and overshoot
  function chalkyPath(cx, cy, rx, ry) {
    var segments = 36; // Dense segments for continuous wobble
    var points = [];
    var angleStep = (Math.PI * 2) / segments;

    // Generate points around ellipse with aggressive randomization
    for (var i = 0; i <= segments; i++) {
      var angle = i * angleStep;

      // Base ellipse position
      var x = cx + Math.cos(angle) * rx;
      var y = cy + Math.sin(angle) * ry;

      // Multi-layer randomness for organic imperfection
      // 1. Perpendicular wobble (makes circles wavy)
      var perpAngle = angle + Math.PI / 2;
      var perpWobble = rand(2.5);
      x += Math.cos(perpAngle) * perpWobble;
      y += Math.sin(perpAngle) * perpWobble;

      // 2. Radial jitter (uneven radius)
      var radialJitter = rand(1.5);
      x += Math.cos(angle) * radialJitter;
      y += Math.sin(angle) * radialJitter;

      // 3. Random directional drift
      x += rand(1);
      y += rand(1);

      points.push({ x: x, y: y });
    }

    // Build path using quadratic curves for organic feel
    var path = ['M', points[0].x, points[0].y];

    for (var j = 1; j < points.length - 1; j++) {
      var p0 = points[j];
      var p1 = points[j + 1];

      // Control point between current and next point with jitter
      var cpx = (p0.x + p1.x) / 2 + rand(2);
      var cpy = (p0.y + p1.y) / 2 + rand(2);

      path.push('Q', cpx, cpy, p1.x, p1.y);
    }

    // Close path with intentional overshoot (hand-drawn characteristic)
    var overshoot = points[Math.floor(segments * 0.15)];
    path.push('Q',
      overshoot.x + rand(3), overshoot.y + rand(3),
      points[0].x + rand(1.5), points[0].y + rand(1.5)
    );

    return path.join(' ');
  }

  var ns = 'http://www.w3.org/2000/svg';

  var overlay = document.createElementNS(ns, 'svg');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:10000;overflow:visible';
  document.body.appendChild(overlay);

  // ─── SVG FILTER DEFINITIONS (CHALK TEXTURE) ────────────────────────────────
  // Creates realistic chalk grain and dust effects using SVG filters
  var defs = document.createElementNS(ns, 'defs');

  // Filter 1: Chalk grain texture with turbulence
  var grainFilter = document.createElementNS(ns, 'filter');
  grainFilter.setAttribute('id', 'chalk-grain');
  grainFilter.setAttribute('x', '-50%');
  grainFilter.setAttribute('y', '-50%');
  grainFilter.setAttribute('width', '200%');
  grainFilter.setAttribute('height', '200%');

  var turbulence = document.createElementNS(ns, 'feTurbulence');
  turbulence.setAttribute('type', 'fractalNoise');
  turbulence.setAttribute('baseFrequency', '0.9');
  turbulence.setAttribute('numOctaves', '4');
  turbulence.setAttribute('result', 'noise');

  var displace = document.createElementNS(ns, 'feDisplacementMap');
  displace.setAttribute('in', 'SourceGraphic');
  displace.setAttribute('in2', 'noise');
  displace.setAttribute('scale', '2');
  displace.setAttribute('xChannelSelector', 'R');
  displace.setAttribute('yChannelSelector', 'G');

  grainFilter.appendChild(turbulence);
  grainFilter.appendChild(displace);

  // Filter 2: Chalk dust glow/blur effect
  var dustFilter = document.createElementNS(ns, 'filter');
  dustFilter.setAttribute('id', 'chalk-dust');
  dustFilter.setAttribute('x', '-50%');
  dustFilter.setAttribute('y', '-50%');
  dustFilter.setAttribute('width', '200%');
  dustFilter.setAttribute('height', '200%');

  var blur = document.createElementNS(ns, 'feGaussianBlur');
  blur.setAttribute('in', 'SourceGraphic');
  blur.setAttribute('stdDeviation', '0.8');

  dustFilter.appendChild(blur);

  defs.appendChild(grainFilter);
  defs.appendChild(dustFilter);
  overlay.appendChild(defs);

  // ─── REALISTIC CHALK STROKE RENDERER ────────────────────────────────────────
  // Draws multi-layered strokes with texture, gaps, and variable width
  function circleAndGo(link) {
    var href  = link.getAttribute('href');
    var isNew = link.getAttribute('target') === '_blank';
    var rect  = link.getBoundingClientRect();
    var pad   = 10;
    var cx = rect.left + rect.width  / 2;
    var cy = rect.top  + rect.height / 2;
    var rx = Math.max(rect.width  / 2 + pad, 32);
    var ry = Math.max(rect.height / 2 + pad, 14);

    var group = document.createElementNS(ns, 'g');
    var paths = [];

    // Layer 1: Background dust/blur (subtle glow)
    var dustPath = document.createElementNS(ns, 'path');
    dustPath.setAttribute('d', chalkyPath(cx, cy, rx, ry));
    dustPath.setAttribute('fill', 'none');
    dustPath.setAttribute('stroke', getChalkColor());
    dustPath.setAttribute('stroke-width', '3.5');
    dustPath.setAttribute('stroke-linecap', 'round');
    dustPath.setAttribute('stroke-linejoin', 'round');
    dustPath.setAttribute('opacity', '0.25');
    dustPath.setAttribute('filter', 'url(#chalk-dust)');
    group.appendChild(dustPath);
    paths.push(dustPath);

    // Layer 2: Main stroke with gaps (simulates chalk skipping)
    var mainPath = document.createElementNS(ns, 'path');
    mainPath.setAttribute('d', chalkyPath(cx, cy, rx, ry));
    mainPath.setAttribute('fill', 'none');
    mainPath.setAttribute('stroke', getChalkColor());
    mainPath.setAttribute('stroke-width', '2.6');
    mainPath.setAttribute('stroke-linecap', 'round');
    mainPath.setAttribute('stroke-linejoin', 'round');
    mainPath.setAttribute('opacity', '0.7');
    mainPath.setAttribute('filter', 'url(#chalk-grain)');

    // Create gaps in stroke by using dash array with random pattern
    var gapPattern = [];
    var totalSegments = 12;
    for (var i = 0; i < totalSegments; i++) {
      // Random solid segments with occasional small gaps
      var solid = 15 + Math.random() * 25;
      var gap = Math.random() > 0.7 ? Math.random() * 3 : 0; // 30% chance of gap
      gapPattern.push(solid, gap);
    }
    mainPath.setAttribute('stroke-dasharray', gapPattern.join(' '));

    group.appendChild(mainPath);
    paths.push(mainPath);

    // Layer 3: Thin overlay for highlights (variable thickness simulation)
    var highlightPath = document.createElementNS(ns, 'path');
    highlightPath.setAttribute('d', chalkyPath(cx, cy, rx + rand(1), ry + rand(1)));
    highlightPath.setAttribute('fill', 'none');
    highlightPath.setAttribute('stroke', getChalkColor());
    highlightPath.setAttribute('stroke-width', '1.4');
    highlightPath.setAttribute('stroke-linecap', 'round');
    highlightPath.setAttribute('opacity', '0.4');
    highlightPath.setAttribute('filter', 'url(#chalk-grain)');
    group.appendChild(highlightPath);
    paths.push(highlightPath);

    overlay.appendChild(group);

    // ─── ANIMATED DRAWING EFFECT ────────────────────────────────────────────
    // Animate each layer with slightly uneven timing for organic feel
    paths.forEach(function (path, index) {
      var len = path.getTotalLength();
      path.style.strokeDasharray  = len + ' ' + len;
      path.style.strokeDashoffset = len;

      // Variable animation speed per layer
      var duration = 0.45 + Math.random() * 0.12;
      var delay = index * 0.04;
      var easing = index === 1 ? 'ease-out' : 'ease-in-out';

      path.style.transition = 'stroke-dashoffset ' + duration + 's ' + easing + ' ' + delay + 's';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          path.style.strokeDashoffset = '0';
        });
      });
    });

    // Navigate after animation completes
    setTimeout(function () {
      if (isNew) {
        window.open(href, '_blank', 'noopener noreferrer');
      } else {
        window.location.href = href;
      }
      setTimeout(function () {
        if (group.parentNode) overlay.removeChild(group);
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
