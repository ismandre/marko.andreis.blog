(function () {
  if (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) return;

  // ─── CHALK COLOR PALETTE ────────────────────────────────────────────────────
  var CHALK_COLORS = {
    default:     { r: 244, g: 241, b: 229, hex: '#F4F1E5', label: 'Chalk'       },
    anger:       { r: 252, g:  49, b:  65, hex: '#FC3141', label: 'Anger'       },
    orange:      { r: 253, g: 166, b: 102, hex: '#FDA666', label: 'Orange'      },
    honeysuckle: { r: 247, g: 253, b: 128, hex: '#F7FD80', label: 'Honeysuckle' },
    adonis:      { r:  92, g: 167, b: 251, hex: '#5CA7FB', label: 'Adonis'      },
    nicole:      { r: 144, g: 134, b: 227, hex: '#9086E3', label: 'Nicole'      },
  };
  var colorKey   = localStorage.getItem('chalk-color') || 'default';
  var chalkColor = CHALK_COLORS[colorKey] || CHALK_COLORS.default;

  // ─── CHALK CURSOR COLORISER ─────────────────────────────────────────────────
  // Uses the chalk PNG as a CSS mask so we can fill it with any background-color.
  // For "default" we fall back to the original background-image approach.
  var CHALK_PNG = '/assets/img/white_chalk.png';

  function applyChalkCursorColor(key) {
    var cursor = document.getElementById('chalk-cursor');
    if (!cursor) return;

    if (key === 'default') {
      cursor.style.backgroundImage = 'url(\'' + CHALK_PNG + '\')';
      cursor.style.backgroundSize  = 'contain';
      cursor.style.backgroundRepeat   = 'no-repeat';
      cursor.style.backgroundPosition = 'center';
      cursor.style.backgroundColor = '';
      cursor.style.webkitMaskImage = 'none';
      cursor.style.maskImage       = 'none';
    } else {
      // Swap to mask + fill colour
      cursor.style.backgroundImage = 'none';
      cursor.style.backgroundColor = CHALK_COLORS[key].hex;

      var maskVal  = 'url(\'' + CHALK_PNG + '\')';
      cursor.style.webkitMaskImage    = maskVal;
      cursor.style.webkitMaskSize     = 'contain';
      cursor.style.webkitMaskRepeat   = 'no-repeat';
      cursor.style.webkitMaskPosition = 'center';
      cursor.style.maskImage          = maskVal;
      cursor.style.maskSize           = 'contain';
      cursor.style.maskRepeat         = 'no-repeat';
      cursor.style.maskPosition       = 'center';
    }
  }

  // Apply saved color immediately once the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyChalkCursorColor(colorKey); });
  } else {
    applyChalkCursorColor(colorKey);
  }

  // ─── CANVAS OVERLAY ─────────────────────────────────────────────────────────
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);

  var ctx           = canvas.getContext('2d');
  var particles     = [];
  var isEmitting    = false;
  var emitX         = 0;
  var emitY         = 0;
  var rafId         = null;
  var easterEggTimer = null;

  var INTERACTIVE    = 'a, button, [role="button"], input, select, textarea, label, [tabindex]';
  var MAX_PARTICLES  = 400;
  var EMIT_PER_FRAME = 4;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ─── PARTICLE SYSTEM ────────────────────────────────────────────────────────
  function createParticle(x, y) {
    var size = 0.4 + Math.random() * Math.random() * 4.2;
    return {
      x:           x + (Math.random() - 0.5) * 8,
      y:           y + (Math.random() - 0.5) * 4,
      vx:          (Math.random() - 0.5) * 3.2,
      vy:          (Math.random() - 0.5) * 1.6 - 0.4,
      gravity:     0.022 + Math.random() * 0.048,
      drift:       (Math.random() - 0.5) * 0.018,
      size:        size,
      baseOpacity: 0.38 + Math.random() * 0.52,
      life:        0,
      maxLife:     75 + Math.random() * 130,
      r: chalkColor.r,
      g: chalkColor.g,
      b: chalkColor.b,
    };
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isEmitting && particles.length < MAX_PARTICLES) {
      for (var e = 0; e < EMIT_PER_FRAME; e++) {
        particles.push(createParticle(emitX, emitY));
      }
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];

      p.vy   += p.gravity;
      p.vx   += p.drift;
      p.x    += p.vx;
      p.y    += p.vy;
      p.life++;

      var t     = p.life / p.maxLife;
      var alpha = p.baseOpacity * (1 - t * t);

      if (p.life >= p.maxLife || p.y > canvas.height + 20 || alpha < 0.01) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      var r = p.r, g = p.g, b = p.b;
      if (p.size > 1.6) {
        var gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gr.addColorStop(0,   'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')');
        gr.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',' + (alpha * 0.6) + ')');
        gr.addColorStop(1,   'rgba(' + r + ',' + g + ',' + b + ',0)');
        ctx.fillStyle = gr;
      } else {
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = 'rgb(' + r + ',' + g + ',' + b + ')';
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (!isEmitting && particles.length === 0) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(animate);
  }

  // ─── EASTER EGG MODAL ───────────────────────────────────────────────────────
  var EGG_SVG = '<svg viewBox="0 0 511.999 511.999" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%">'
    + '<g><path d="M147.425,223.734c-21.877,0-39.674,17.797-39.674,39.675c0,21.875,17.798,39.674,39.674,39.674'
    + 'c21.877,0,39.675-17.797,39.675-39.674S169.303,223.734,147.425,223.734z M147.425,286.245c-12.592,0-22.836-10.244-22.836-22.836'
    + 'c0-12.593,10.245-22.837,22.836-22.837c12.592,0,22.837,10.244,22.837,22.837C170.262,276.001,160.018,286.245,147.425,286.245z"/></g>'
    + '<g><path d="M255.999,223.734c-21.877,0-39.675,17.797-39.675,39.675c0,21.875,17.798,39.674,39.675,39.674'
    + 's39.674-17.797,39.674-39.674S277.876,223.734,255.999,223.734z M255.999,286.245c-12.592,0-22.837-10.244-22.837-22.836'
    + 'c0-12.593,10.245-22.837,22.837-22.837s22.836,10.244,22.836,22.837C278.836,276.001,268.592,286.245,255.999,286.245z"/></g>'
    + '<g><path d="M364.573,223.734c-21.877,0-39.675,17.797-39.675,39.675c0,21.875,17.798,39.674,39.675,39.674'
    + 'c21.877,0,39.674-17.797,39.674-39.674S386.449,223.734,364.573,223.734z M364.573,286.245c-12.592,0-22.837-10.244-22.837-22.836'
    + 'c0-12.593,10.245-22.837,22.837-22.837s22.836,10.244,22.836,22.837C387.409,276.001,377.165,286.245,364.573,286.245z"/></g>'
    + '<g><path d="M420.771,164.414c-0.1-0.391-0.218-0.773-0.369-1.141c-9.211-27.895-21.401-53.595-36.236-76.397'
    + 'c-17.15-26.359-37.63-48.191-59.227-63.136C302.494,8.21,278.655,0,255.999,0c-21.942,0-44.157,7.331-66.028,21.789'
    + 'c-3.878,2.564-4.944,7.787-2.38,11.665c2.564,3.879,7.787,4.945,11.666,2.381c19.068-12.606,38.158-18.997,56.742-18.997'
    + 'c43.994,0,82.561,34.41,106.534,68.297c-0.953-1.347-20.46,8.935-22.451,10.087c-3.759,2.173-7.47,4.566-10.748,7.431'
    + 'c-4.561,3.986-9.869,10.533-16.019,4.353c-7.116-7.149-15.267-12.801-24.074-16.845c-10.362-4.759-21.635-7.283-33.243-7.283'
    + 'c-21.406,0-42.253,8.995-57.317,24.129c-7.25,7.287-14.752-3.719-20.297-7.865c-8.36-6.253-17.899-10.957-28.002-13.617'
    + 'c-0.255-0.067-0.506-0.14-0.762-0.204c-0.085-0.022-0.169-0.047-0.254-0.068c7.784-10.746,16.121-20.481,24.883-29.044'
    + 'c3.325-3.25,3.388-8.579,0.138-11.904c-3.251-3.326-8.582-3.387-11.905-0.137c-12.498,12.212-24.155,26.583-34.65,42.714'
    + 'c-14.939,22.963-27.197,48.868-36.432,76.994c-12.62,38.442-19.021,79.084-19.021,120.794c0,28.664,3.077,55.482,9.146,79.707'
    + 'c5.232,20.886,12.758,40.133,22.372,57.211c16.772,29.796,39.543,52.887,67.677,68.632c25.462,14.249,54.656,21.781,84.427,21.781'
    + 'c20.9,0,41.318-3.647,60.689-10.839c4.359-1.619,6.58-6.463,4.963-10.823c-1.618-4.359-6.461-6.581-10.823-4.963'
    + 'c-17.49,6.494-35.937,9.786-54.83,9.786c-26.898,0-53.249-6.79-76.205-19.637c-23.493-13.148-42.882-32.042-57.715-56.223'
    + 'c0.081-0.074,0.155-0.152,0.235-0.226c0.742-0.689,1.469-1.385,2.173-2.091c0.024-0.024,0.049-0.047,0.074-0.071'
    + 'c2.611-2.623,5.65-3.28,8.474-1.968c0.942,0.438,1.859,1.093,2.73,1.968c5.808,5.835,12.299,10.687,19.279,14.472'
    + 'c11.631,6.31,24.615,9.657,38.037,9.657c21.474,0,41.83-8.569,57.319-24.129c3.046-3.062,6.674-3.442,9.865-1.146'
    + 'c0.025,0.018,0.049,0.04,0.074,0.058c0.202,0.148,0.403,0.304,0.602,0.474c0.223,0.191,0.443,0.396,0.661,0.614'
    + 'c6.775,6.807,14.483,12.277,22.808,16.276c10.704,5.142,22.43,7.853,34.509,7.853c21.474,0,41.829-8.569,57.317-24.129'
    + 'c2.392-2.403,5.144-3.156,7.762-2.254c0.199,0.068,0.396,0.152,0.593,0.239c0.038,0.018,0.077,0.029,0.117,0.047'
    + 'c0.942,0.438,1.86,1.093,2.731,1.968c0.731,0.734,1.49,1.458,2.261,2.175c0.075,0.07,0.144,0.141,0.22,0.211'
    + 'c-12.911,21.034-29.352,38.143-48.953,50.922c-3.895,2.54-4.994,7.755-2.454,11.651c2.539,3.895,7.755,4.994,11.649,2.455'
    + 'c23.714-15.463,43.208-36.571,57.942-62.744c9.612-17.074,17.14-36.323,22.372-57.211c6.068-24.225,9.146-51.043,9.146-79.707'
    + 'C439.621,243.152,433.276,202.698,420.771,164.414z M139.181,100.397c1.056-1.69,15.275,4.241,16.893,4.973'
    + 'c7.183,3.254,13.874,7.835,19.416,13.459c0.018,0.019,0.038,0.036,0.056,0.054c6.248,6.277,12.984,7.595,17.535,7.595'
    + 'c10.54,0,16.198-7.18,23.777-13.116c11.288-8.841,24.913-13.649,39.142-13.649c16.822,0,33.377,7.107,45.383,19.169'
    + 'c6.247,6.277,12.983,7.595,17.535,7.596c6.672,0,12.867-2.901,17.538-7.596c9.348-9.398,21.689-15.982,34.772-18.234'
    + 'c0.369-0.064,0.739-0.128,1.11-0.185c0.161-0.025,0.321-0.043,0.482-0.066c8.246,13.202,15.585,27.399,21.95,42.449'
    + 'c-0.018-0.011-0.036-0.02-0.056-0.034c-9.838-6.306-22.313-4.352-30.41,3.784c-11.972,12.028-28.363,19.169-45.382,19.169'
    + 'c-16.962,0-33.08-6.807-45.384-19.168c-4.655-4.68-10.883-7.596-17.536-7.596c-4.551,0-11.286,1.318-17.535,7.596'
    + 'c-11.815,11.869-28.362,19.169-45.383,19.169c-10.152,0-20.247-2.548-29.229-7.267c-8.898-4.675-15.302-13.702-24.413-17.6'
    + 'c-7.108-3.039-15.69-2.393-22.149,1.913c-0.019,0.012-0.037,0.021-0.056,0.034C123.596,127.797,130.936,113.599,139.181,100.397z'
    + ' M405.863,386.695c-2.251,5.889-4.757,11.681-7.54,17.338c-0.022-0.021-0.046-0.039-0.068-0.06'
    + 'c-0.152-0.138-0.304-0.263-0.456-0.395c-0.232-0.202-0.465-0.405-0.699-0.596c-9.951-8.076-23.889-6.901-32.799,2.053'
    + 'c-12.304,12.361-28.422,19.169-45.383,19.169c-14.842,0-29.036-5.213-40.597-14.797c-7.002-5.806-12.5-11.967-22.323-11.967'
    + 'c-4.551,0-11.288,1.318-17.535,7.596c-12.304,12.361-28.422,19.169-45.383,19.169c-8.933,0-17.624-1.906-25.655-5.499'
    + 'c-7.218-3.229-13.902-7.818-19.726-13.67c-2.734-2.747-5.561-4.544-8.258-5.697c-3.467-1.483-6.718-1.899-9.279-1.899'
    + 'c-5.563,0-10.96,2.052-15.262,5.541c-0.24,0.195-0.48,0.404-0.72,0.613c-0.145,0.126-0.291,0.246-0.435,0.377'
    + 'c-0.024,0.021-0.047,0.039-0.071,0.062c-5.744-11.679-10.519-24.347-14.257-37.83c0.244-0.136,0.486-0.274,0.732-0.406'
    + 'c24.789-13.461,55.635-8.331,75.397,11.527c9.85,9.894,25.278,9.838,35.07-0.001c12.302-12.361,28.419-19.169,45.381-19.169'
    + 'c10.602,0,20.873,2.659,30.09,7.671c5.481,2.981,10.479,6.807,14.945,11.153c4.921,4.79,10.887,7.94,17.885,7.94'
    + 'c4.551,0,11.286-1.318,17.537-7.596c12.302-12.361,28.419-19.169,45.382-19.169c6.898,0,29.433,2.115,30.221,9.959'
    + 'C412.563,373.145,407.665,381.979,405.863,386.695z M416.613,349.313c-0.04-0.02-0.082-0.038-0.122-0.057'
    + 'c-10.729-5.183-22.682-7.929-34.599-7.936c-0.019,0-0.038-0.001-0.057-0.001c-21.475,0-41.83,8.569-57.314,24.127'
    + 'c-2.395,2.407-5.148,3.158-7.766,2.256c-1.19-0.41-2.352-1.162-3.439-2.255c-3.462-3.479-7.18-6.587-11.087-9.349'
    + 'c-13.569-9.593-29.557-14.78-46.23-14.78c-21.476,0-41.83,8.569-57.315,24.128c-3.048,3.061-6.674,3.444-9.866,1.148'
    + 'c-0.456-0.328-0.902-0.711-1.338-1.148c-5.417-5.443-11.441-10.009-17.888-13.673c-11.986-6.811-25.465-10.455-39.428-10.455'
    + 'c-0.02,0-0.04,0.001-0.061,0.001c-11.876,0.008-23.848,2.727-34.538,7.91c-0.062,0.03-0.126,0.058-0.199,0.093'
    + 'c-4.084-19.956-6.15-41.649-6.15-64.652c0-38.768,5.769-76.546,17.149-112.346c0.609-1.918,9.969-6.572,11.604-7.904'
    + 'c4.509-3.672,9.915-11.795,16.458-7.093c0.456,0.328,0.904,0.711,1.339,1.148c15.486,15.559,35.842,24.128,57.316,24.128'
    + 'c8.053,0,15.949-1.204,23.49-3.531c12.568-3.878,24.15-10.873,33.828-20.597c3.047-3.062,6.672-3.444,9.863-1.147'
    + 'c0.456,0.328,0.903,0.711,1.338,1.148c15.487,15.559,35.843,24.128,57.317,24.128c8.053,0,15.949-1.204,23.488-3.531'
    + 'c12.568-3.878,24.15-10.873,33.829-20.598c2.391-2.402,5.14-3.156,7.76-2.254c4.578,1.576,8.068,5.333,11.562,8.503'
    + 'c1.528,1.386,9.575,6.018,10.078,7.602c11.38,35.8,17.149,73.578,17.149,112.344C422.784,307.673,420.717,329.366,416.613,349.313z"/></g>'
    + '</svg>';

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = [
      // ── Overlay: restore system cursor (body sets cursor:none site-wide)
      '#chalk-egg-overlay{',
        'position:fixed;inset:0;',
        'background:rgba(0,0,0,0.62);',
        'z-index:10000;',
        'display:flex;align-items:center;justify-content:center;',
        'animation:_cegg-fade 0.28s ease;',
        'cursor:default!important;',   // <-- fix 1: restore visible cursor on overlay
      '}',
      // All descendants of the overlay also get the system cursor back
      '#chalk-egg-overlay *{cursor:default!important;}',
      '#chalk-egg-overlay button{cursor:pointer!important;}',

      '@keyframes _cegg-fade{from{opacity:0}to{opacity:1}}',

      '#chalk-egg-modal{',
        'background:#1a1a1a;',
        'border:2px solid rgba(240,237,224,0.4);',
        'border-radius:255px 15px 225px 15px/15px 225px 15px 255px;',
        'padding:2.4rem 2.8rem 2rem;',
        'max-width:430px;width:calc(100% - 3rem);',
        'text-align:center;',
        'color:rgba(240,237,224,0.9);',
        "font-family:'KGNoRegretsSketch',cursive;font-size:18px;",
        'box-shadow:0 10px 48px rgba(0,0,0,0.85);',
        'animation:_cegg-up 0.36s cubic-bezier(0.22,1,0.36,1);',
      '}',
      '@keyframes _cegg-up{from{transform:translateY(20px) scale(0.96);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}',

      '#chalk-egg-icon{',
        'width:72px;height:72px;margin:0 auto 1.1rem;',
        'fill:rgba(240,237,224,0.85);',
        'display:block;',
      '}',
      '#chalk-egg-icon svg path{fill:rgba(240,237,224,0.85)}',

      '#chalk-egg-modal h2{',
        'margin:0 0 0.35rem;font-size:1.45rem;',
        'color:rgba(240,237,224,0.96);',
        'text-shadow:1px 1px 3px rgba(255,255,255,0.1);',
      '}',
      '#chalk-egg-modal>p{margin:0 0 1.5rem;font-size:0.92rem;opacity:0.7;}',

      '#chalk-egg-swatches{',
        'display:flex;justify-content:center;gap:0.8rem;',
        'flex-wrap:wrap;margin-bottom:1.6rem;',
      '}',
      '.cegg-swatch-wrap{display:flex;flex-direction:column;align-items:center;gap:0.3rem;}',

      '.cegg-swatch{',
        'width:34px;height:34px;border-radius:50%;',
        'border:2px solid transparent;',
        'transition:transform 0.14s,border-color 0.14s,box-shadow 0.14s;',
        'outline:none;',
      '}',
      '.cegg-swatch:hover{transform:scale(1.18);}',
      '.cegg-swatch.is-active{',
        'border-color:rgba(240,237,224,0.9);',
        'box-shadow:0 0 0 3px rgba(240,237,224,0.22);',
      '}',
      '.cegg-swatch-label{',
        'font-size:0.62rem;opacity:0.55;white-space:nowrap;',
        "font-family:'KGNoRegretsSketch',cursive;",
      '}',

      '#chalk-egg-close{',
        'background:none;',
        'border:1px solid rgba(240,237,224,0.35);',
        'color:rgba(240,237,224,0.65);',
        "font-family:'KGNoRegretsSketch',cursive;font-size:0.88rem;",
        'padding:0.42rem 1.5rem;',
        'border-radius:255px 15px 225px 15px/15px 225px 15px 255px;',
        'transition:opacity 0.15s;',
      '}',
      '#chalk-egg-close:hover{opacity:0.55;}',
    ].join('');
    document.head.appendChild(s);
  }

  function showEasterEgg() {
    if (document.getElementById('chalk-egg-overlay')) return;

    // Hide the chalk cursor while the modal is open so it doesn't float on top
    var chalkCursor = document.getElementById('chalk-cursor');
    if (chalkCursor) chalkCursor.style.opacity = '0';

    var overlay = document.createElement('div');
    overlay.id = 'chalk-egg-overlay';

    var modal = document.createElement('div');
    modal.id = 'chalk-egg-modal';

    // ── Icon
    var iconWrap = document.createElement('div');
    iconWrap.id = 'chalk-egg-icon';
    iconWrap.innerHTML = EGG_SVG;

    // ── Heading
    var heading = document.createElement('h2');
    heading.textContent = 'Easter Egg Found!';

    // ── Sub-text
    var sub = document.createElement('p');
    sub.textContent = 'You\u2019ve unlocked the chalk colour picker. Choose your colour:';

    // ── Colour swatches
    var swatchRow = document.createElement('div');
    swatchRow.id = 'chalk-egg-swatches';

    ['default', 'anger', 'orange', 'honeysuckle', 'adonis', 'nicole'].forEach(function (key) {
      var c    = CHALK_COLORS[key];
      var wrap = document.createElement('div');
      wrap.className = 'cegg-swatch-wrap';

      var btn = document.createElement('button');
      btn.className = 'cegg-swatch' + (colorKey === key ? ' is-active' : '');
      btn.style.background = c.hex;
      btn.title = c.label;
      btn.setAttribute('data-key', key);

      btn.addEventListener('click', function () {
        colorKey   = key;
        chalkColor = CHALK_COLORS[key];
        localStorage.setItem('chalk-color', key);
        // Recolour the chalk cursor immediately                        ← fix 2
        applyChalkCursorColor(key);
        document.querySelectorAll('.cegg-swatch').forEach(function (sw) {
          sw.classList.toggle('is-active', sw.getAttribute('data-key') === key);
        });
      });

      var lbl = document.createElement('span');
      lbl.className   = 'cegg-swatch-label';
      lbl.textContent = c.label;

      wrap.appendChild(btn);
      wrap.appendChild(lbl);
      swatchRow.appendChild(wrap);
    });

    // ── Close button
    var closeBtn = document.createElement('button');
    closeBtn.id          = 'chalk-egg-close';
    closeBtn.textContent = 'Close';

    function closeModal() {
      overlay.remove();
      // Restore chalk cursor visibility
      if (chalkCursor) chalkCursor.style.opacity = '1';
      document.removeEventListener('keydown', onEscKey);
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    function onEscKey(e) {
      if (e.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', onEscKey);

    modal.appendChild(iconWrap);
    modal.appendChild(heading);
    modal.appendChild(sub);
    modal.appendChild(swatchRow);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  injectStyles();

  // ─── EVENT WIRING ───────────────────────────────────────────────────────────
  document.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    if (e.target.closest(INTERACTIVE)) return;

    emitX = e.clientX + 5;
    emitY = e.clientY + 8;
    isEmitting = true;
    startLoop();

    easterEggTimer = setTimeout(function () {
      isEmitting = false;
      showEasterEgg();
    }, 3000);
  });

  document.addEventListener('mousemove', function (e) {
    if (isEmitting) {
      emitX = e.clientX + 5;
      emitY = e.clientY + 8;
    }
  });

  document.addEventListener('mouseup', function () {
    isEmitting = false;
    clearTimeout(easterEggTimer);
    easterEggTimer = null;
  });

  document.addEventListener('mouseleave', function () {
    isEmitting = false;
    clearTimeout(easterEggTimer);
    easterEggTimer = null;
  });
}());
