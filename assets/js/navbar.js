(function () {
  var ns = 'http://www.w3.org/2000/svg';
  var overlay = null;
  var navbarGroup = null;
  var separatorGroup = null;
  var initialNavbarTop = null;
  var initialSeparatorTop = null;

  // ─── CHALK COLOR ────────────────────────────────────────────────────────────
  function getChalkColor() {
    var colorKey = localStorage.getItem('chalk-color') || 'default';
    var CHALK_COLORS = {
      default:     { r: 244, g: 241, b: 229 },
      anger:       { r: 252, g:  49, b:  65 },
      orange:      { r: 253, g: 166, b: 102 },
      honeysuckle: { r: 247, g: 253, b: 128 },
      adonis:      { r:  92, g: 167, b: 251 },
      nicole:      { r: 144, g: 134, b: 227 },
    };
    var color = CHALK_COLORS[colorKey] || CHALK_COLORS.default;
    return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0.6)';
  }

  function rand(scale) {
    return (Math.random() - 0.5) * scale;
  }

  // ─── REALISTIC CHALK RECTANGLE PATH GENERATOR ───────────────────────────────
  // Creates a wobbly rectangle with hand-drawn imperfections
  function chalkyRectPath(x, y, width, height) {
    var segmentsPerSide = 24; // Dense segments for continuous wobble
    var points = [];

    // Generate points for all four sides with aggressive randomization
    function addSide(startX, startY, endX, endY, segments) {
      for (var i = 0; i <= segments; i++) {
        var t = i / segments;
        var baseX = startX + (endX - startX) * t;
        var baseY = startY + (endY - startY) * t;

        // Multi-layer randomness for organic imperfection
        // 1. Perpendicular wobble (makes lines wavy)
        var angle = Math.atan2(endY - startY, endX - startX);
        var perpAngle = angle + Math.PI / 2;
        var perpWobble = rand(3.5);
        baseX += Math.cos(perpAngle) * perpWobble;
        baseY += Math.sin(perpAngle) * perpWobble;

        // 2. Parallel jitter (uneven progress along line)
        var parallelJitter = rand(2);
        baseX += Math.cos(angle) * parallelJitter;
        baseY += Math.sin(angle) * parallelJitter;

        // 3. Random directional drift
        baseX += rand(1.5);
        baseY += rand(1.5);

        points.push({ x: baseX, y: baseY });
      }
    }

    // Top side (left to right)
    addSide(x, y, x + width, y, segmentsPerSide);
    // Right side (top to bottom)
    addSide(x + width, y, x + width, y + height, segmentsPerSide);
    // Bottom side (right to left)
    addSide(x + width, y + height, x, y + height, segmentsPerSide);
    // Left side (bottom to top)
    addSide(x, y + height, x, y, segmentsPerSide);

    // Build path using quadratic curves for organic feel
    var path = ['M', points[0].x, points[0].y];

    for (var j = 1; j < points.length - 1; j++) {
      var p0 = points[j];
      var p1 = points[j + 1];

      // Control point with jitter for curved segments
      var cpx = (p0.x + p1.x) / 2 + rand(3);
      var cpy = (p0.y + p1.y) / 2 + rand(3);

      path.push('Q', cpx, cpy, p1.x, p1.y);
    }

    // Close path with slight overshoot (hand-drawn characteristic)
    var overshoot = points[Math.floor(points.length * 0.05)];
    path.push('Q',
      overshoot.x + rand(4), overshoot.y + rand(4),
      points[0].x + rand(2), points[0].y + rand(2)
    );

    return path.join(' ');
  }

  // ─── REALISTIC CHALK LINE PATH GENERATOR ────────────────────────────────────
  // Creates a wobbly horizontal line with hand-drawn imperfections
  function chalkyLinePath(x1, y1, x2, y2) {
    var segments = 32; // Dense segments for continuous wobble
    var points = [];
    var length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    var angle = Math.atan2(y2 - y1, x2 - x1);
    var perpAngle = angle + Math.PI / 2;

    // Generate points along the line with aggressive randomization
    for (var i = 0; i <= segments; i++) {
      var t = i / segments;
      var baseX = x1 + (x2 - x1) * t;
      var baseY = y1 + (y2 - y1) * t;

      // Multi-layer randomness for organic imperfection
      // 1. Perpendicular wobble (makes line wavy)
      var perpWobble = rand(2.5);
      baseX += Math.cos(perpAngle) * perpWobble;
      baseY += Math.sin(perpAngle) * perpWobble;

      // 2. Parallel jitter (uneven progress along line)
      var parallelJitter = rand(1.5);
      baseX += Math.cos(angle) * parallelJitter;
      baseY += Math.sin(angle) * parallelJitter;

      // 3. Random directional drift
      baseX += rand(1);
      baseY += rand(1);

      points.push({ x: baseX, y: baseY });
    }

    // Build path using quadratic curves for organic feel
    var path = ['M', points[0].x, points[0].y];

    for (var j = 1; j < points.length - 1; j++) {
      var p0 = points[j];
      var p1 = points[j + 1];

      // Control point with jitter for curved segments
      var cpx = (p0.x + p1.x) / 2 + rand(2);
      var cpy = (p0.y + p1.y) / 2 + rand(2);

      path.push('Q', cpx, cpy, p1.x, p1.y);
    }

    // End with slight overshoot
    var lastPoint = points[points.length - 1];
    path.push('L', lastPoint.x + rand(2), lastPoint.y + rand(2));

    return path.join(' ');
  }

  // ─── CHALK SEPARATOR LINE RENDERER ──────────────────────────────────────────
  function drawSeparator() {
    var navbar = document.querySelector('.navbar');
    var links = document.querySelector('.navbar__links');
    if (!navbar || !links || !navbar.classList.contains('is-open')) return;

    // Ensure overlay exists
    if (!overlay) return;

    // Remove previous separator if exists
    if (separatorGroup && separatorGroup.parentNode) {
      separatorGroup.parentNode.removeChild(separatorGroup);
      separatorGroup = null;
    }

    // Get position for separator line (above the links)
    var navbarRect = navbar.getBoundingClientRect();
    var linksRect = links.getBoundingClientRect();

    var x1 = navbarRect.left + 12;
    var x2 = navbarRect.right - 12;
    var y = linksRect.top - 6;

    // Create group for all layers
    separatorGroup = document.createElementNS(ns, 'g');

    // Layer 1: Background dust/blur (subtle glow)
    var dustPath = document.createElementNS(ns, 'path');
    dustPath.setAttribute('d', chalkyLinePath(x1, y, x2, y));
    dustPath.setAttribute('fill', 'none');
    dustPath.setAttribute('stroke', getChalkColor());
    dustPath.setAttribute('stroke-width', '3');
    dustPath.setAttribute('stroke-linecap', 'round');
    dustPath.setAttribute('opacity', '0.3');
    dustPath.setAttribute('filter', 'url(#navbar-chalk-dust)');
    separatorGroup.appendChild(dustPath);

    // Layer 2: Main stroke with gaps (simulates chalk skipping)
    var mainPath = document.createElementNS(ns, 'path');
    mainPath.setAttribute('d', chalkyLinePath(x1, y, x2, y));
    mainPath.setAttribute('fill', 'none');
    mainPath.setAttribute('stroke', getChalkColor());
    mainPath.setAttribute('stroke-width', '2');
    mainPath.setAttribute('stroke-linecap', 'round');
    mainPath.setAttribute('opacity', '0.65');
    mainPath.setAttribute('filter', 'url(#navbar-chalk-grain)');

    // Create gaps in stroke with random pattern
    var gapPattern = [];
    var totalSegments = 10;
    for (var i = 0; i < totalSegments; i++) {
      var solid = 12 + Math.random() * 20;
      var gap = Math.random() > 0.7 ? Math.random() * 3 : 0; // 30% chance of gap
      gapPattern.push(solid, gap);
    }
    mainPath.setAttribute('stroke-dasharray', gapPattern.join(' '));
    separatorGroup.appendChild(mainPath);

    // Layer 3: Thin highlight overlay (variable thickness simulation)
    var highlightPath = document.createElementNS(ns, 'path');
    highlightPath.setAttribute('d', chalkyLinePath(x1, y + rand(0.5), x2, y + rand(0.5)));
    highlightPath.setAttribute('fill', 'none');
    highlightPath.setAttribute('stroke', getChalkColor());
    highlightPath.setAttribute('stroke-width', '1.2');
    highlightPath.setAttribute('stroke-linecap', 'round');
    highlightPath.setAttribute('opacity', '0.45');
    highlightPath.setAttribute('filter', 'url(#navbar-chalk-grain)');
    separatorGroup.appendChild(highlightPath);

    overlay.appendChild(separatorGroup);

    // Store initial position for scroll transforms
    initialSeparatorTop = y;

    // Animate drawing effect
    var paths = [dustPath, mainPath, highlightPath];
    paths.forEach(function (path, index) {
      var len = path.getTotalLength();
      path.style.strokeDasharray  = len + ' ' + len;
      path.style.strokeDashoffset = len;

      var duration = 0.35 + Math.random() * 0.1;
      var delay = index * 0.03;

      path.style.transition = 'stroke-dashoffset ' + duration + 's ease-out ' + delay + 's';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          path.style.strokeDashoffset = '0';
        });
      });
    });
  }

  function removeSeparator() {
    if (separatorGroup && separatorGroup.parentNode) {
      separatorGroup.parentNode.removeChild(separatorGroup);
      separatorGroup = null;
    }
  }

  // ─── UPDATE POSITIONS WITHOUT REDRAWING ─────────────────────────────────────
  // Repositions existing chalk drawings using transforms (no redraw)
  function updateChalkPositions() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Update navbar rectangle position
    if (navbarGroup && initialNavbarTop !== null) {
      var currentRect = navbar.getBoundingClientRect();
      var deltaY = currentRect.top - initialNavbarTop;
      navbarGroup.style.transform = 'translateY(' + deltaY + 'px)';
    }

    // Update separator position if menu is open
    if (separatorGroup && initialSeparatorTop !== null) {
      var links = document.querySelector('.navbar__links');
      if (links && navbar.classList.contains('is-open')) {
        var linksRect = links.getBoundingClientRect();
        var targetY = linksRect.top - 6;
        var deltaY = targetY - initialSeparatorTop;
        separatorGroup.style.transform = 'translateY(' + deltaY + 'px)';
      }
    }
  }

  // ─── CHALK RECTANGLE RENDERER ───────────────────────────────────────────────
  function drawNavbarChalk() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Create SVG overlay if it doesn't exist
    if (!overlay) {
      overlay = document.createElementNS(ns, 'svg');
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;overflow:visible';
      document.body.appendChild(overlay);

      // Create filter definitions (reuse same filters as chalk-circle.js)
      var defs = document.createElementNS(ns, 'defs');

      // Filter 1: Chalk grain texture
      var grainFilter = document.createElementNS(ns, 'filter');
      grainFilter.setAttribute('id', 'navbar-chalk-grain');
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

      // Filter 2: Chalk dust glow
      var dustFilter = document.createElementNS(ns, 'filter');
      dustFilter.setAttribute('id', 'navbar-chalk-dust');
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
    }

    // Remove previous navbar rectangle if exists
    if (navbarGroup && navbarGroup.parentNode) {
      navbarGroup.parentNode.removeChild(navbarGroup);
    }

    // Get navbar position and dimensions
    var rect = navbar.getBoundingClientRect();
    var padding = 0; // Match the existing border position
    var x = rect.left - padding;
    var y = rect.top - padding;
    var width = rect.width + padding * 2;
    var height = rect.height + padding * 2;

    // Create group for all layers
    navbarGroup = document.createElementNS(ns, 'g');

    // Layer 1: Background dust/blur (subtle glow)
    var dustPath = document.createElementNS(ns, 'path');
    dustPath.setAttribute('d', chalkyRectPath(x, y, width, height));
    dustPath.setAttribute('fill', 'none');
    dustPath.setAttribute('stroke', getChalkColor());
    dustPath.setAttribute('stroke-width', '4');
    dustPath.setAttribute('stroke-linecap', 'round');
    dustPath.setAttribute('stroke-linejoin', 'round');
    dustPath.setAttribute('opacity', '0.25');
    dustPath.setAttribute('filter', 'url(#navbar-chalk-dust)');
    navbarGroup.appendChild(dustPath);

    // Layer 2: Main stroke with gaps (simulates chalk skipping)
    var mainPath = document.createElementNS(ns, 'path');
    mainPath.setAttribute('d', chalkyRectPath(x, y, width, height));
    mainPath.setAttribute('fill', 'none');
    mainPath.setAttribute('stroke', getChalkColor());
    mainPath.setAttribute('stroke-width', '2.6');
    mainPath.setAttribute('stroke-linecap', 'round');
    mainPath.setAttribute('stroke-linejoin', 'round');
    mainPath.setAttribute('opacity', '0.75');
    mainPath.setAttribute('filter', 'url(#navbar-chalk-grain)');

    // Create gaps in stroke with random pattern
    var gapPattern = [];
    var totalSegments = 16;
    for (var i = 0; i < totalSegments; i++) {
      var solid = 18 + Math.random() * 28;
      var gap = Math.random() > 0.65 ? Math.random() * 4 : 0; // 35% chance of gap
      gapPattern.push(solid, gap);
    }
    mainPath.setAttribute('stroke-dasharray', gapPattern.join(' '));
    navbarGroup.appendChild(mainPath);

    // Layer 3: Thin highlight overlay (variable thickness simulation)
    var highlightPath = document.createElementNS(ns, 'path');
    highlightPath.setAttribute('d', chalkyRectPath(x + rand(0.8), y + rand(0.8), width, height));
    highlightPath.setAttribute('fill', 'none');
    highlightPath.setAttribute('stroke', getChalkColor());
    highlightPath.setAttribute('stroke-width', '1.4');
    highlightPath.setAttribute('stroke-linecap', 'round');
    highlightPath.setAttribute('stroke-linejoin', 'round');
    highlightPath.setAttribute('opacity', '0.4');
    highlightPath.setAttribute('filter', 'url(#navbar-chalk-grain)');
    navbarGroup.appendChild(highlightPath);

    overlay.appendChild(navbarGroup);

    // Store initial position for scroll transforms
    initialNavbarTop = y;
  }

  // ─── INITIALIZATION & EVENT LISTENERS ───────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Draw chalk navbar border
    drawNavbarChalk();

    // Redraw on window resize to reposition
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        drawNavbarChalk();
        var navbar = document.querySelector('.navbar');
        if (navbar && navbar.classList.contains('is-open')) {
          drawSeparator();
        }
      }, 150);
    });

    // Update positions on scroll (without redrawing)
    var scrolling = false;
    window.addEventListener('scroll', function () {
      if (!scrolling) {
        scrolling = true;
        requestAnimationFrame(function () {
          updateChalkPositions();
          scrolling = false;
        });
      }
    });

    // Redraw when chalk color changes (listen to storage events)
    window.addEventListener('storage', function (e) {
      if (e.key === 'chalk-color') {
        drawNavbarChalk();
        var navbar = document.querySelector('.navbar');
        if (navbar && navbar.classList.contains('is-open')) {
          drawSeparator();
        }
      }
    });

    // Burger menu toggle functionality
    var burger = document.querySelector('.navbar__burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
      var navbar = burger.closest('.navbar');
      var isOpen = navbar.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen);

      if (isOpen) {
        // Redraw chalk border and add separator when menu opens
        setTimeout(function () {
          drawNavbarChalk();
          drawSeparator();
        }, 50);
      } else {
        // Remove separator and redraw border when menu closes
        removeSeparator();
        setTimeout(drawNavbarChalk, 50);
      }
    });
  });
})();
