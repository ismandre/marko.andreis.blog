(function () {
  if (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) return;

  // Full-screen canvas overlay, sits just below the chalk cursor (z-index 9999)
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var isEmitting = false;
  var emitX = 0;
  var emitY = 0;
  var rafId = null;

  var INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, [tabindex]';
  var MAX_PARTICLES = 400;
  var EMIT_PER_FRAME = 4; // particles spawned each animation frame while held

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle(x, y) {
    // Bias size distribution toward tiny specks (most dust is fine powder)
    var size = 0.4 + Math.random() * Math.random() * 4.2;

    // Initial burst: particles shoot out in a small cloud, gravity takes over
    var burstVx = (Math.random() - 0.5) * 3.2;
    var burstVy = (Math.random() - 0.5) * 1.6 - 0.4; // slight upward bias

    return {
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 4,
      vx: burstVx,
      vy: burstVy,
      // Gravity varies per particle so they fall at slightly different rates
      gravity: 0.022 + Math.random() * 0.048,
      // Subtle air-drift accumulates over the particle lifetime
      drift: (Math.random() - 0.5) * 0.018,
      size: size,
      baseOpacity: 0.38 + Math.random() * 0.52,
      life: 0,
      maxLife: 75 + Math.random() * 130,
    };
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new particles only while the mouse button is held
    if (isEmitting && particles.length < MAX_PARTICLES) {
      for (var e = 0; e < EMIT_PER_FRAME; e++) {
        particles.push(createParticle(emitX, emitY));
      }
    }

    // Update physics and draw
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];

      // Physics step
      p.vy += p.gravity;
      p.vx += p.drift;
      p.x  += p.vx;
      p.y  += p.vy;
      p.life++;

      // Quadratic fade-out so particles linger bright then dissolve quickly at end
      var t = p.life / p.maxLife;
      var alpha = p.baseOpacity * (1 - t * t);

      if (p.life >= p.maxLife || p.y > canvas.height + 20 || alpha < 0.01) {
        particles.splice(i, 1);
        continue;
      }

      // Render particle
      ctx.save();
      if (p.size > 1.6) {
        // Larger fragments: soft radial gradient for a powdery, out-of-focus look
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0,   'rgba(244,241,229,' + alpha + ')');
        g.addColorStop(0.5, 'rgba(236,233,218,' + (alpha * 0.6) + ')');
        g.addColorStop(1,   'rgba(230,228,213,0)');
        ctx.fillStyle = g;
      } else {
        // Tiny specks: plain circle — no gradient needed at this scale
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgb(243,240,228)';
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Kill the loop when there is nothing left to draw
    if (!isEmitting && particles.length === 0) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  }

  // --- Event wiring ---

  document.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;                      // left-click only
    if (e.target.closest(INTERACTIVE)) return;       // skip links, buttons, etc.

    emitX = e.clientX + 5;
    emitY = e.clientY + 8;
    isEmitting = true;
    startLoop();
  });

  // Track cursor movement so dust follows the pointer while held
  document.addEventListener('mousemove', function (e) {
    if (isEmitting) {
      emitX = e.clientX + 5;
      emitY = e.clientY + 8;
    }
  });

  document.addEventListener('mouseup', function () {
    isEmitting = false;
  });

  // Stop emitting if the pointer leaves the window mid-drag
  document.addEventListener('mouseleave', function () {
    isEmitting = false;
  });
}());
