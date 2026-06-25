/* cursor.js — custom cursor, trailing dot, contextual labels & magnetic ----- */
import { $, $$, lerp, isFinePointer, prefersReducedMotion, rafThrottle } from './utils.js';

export function initCursor() {
  if (!isFinePointer() || prefersReducedMotion()) return;

  const ring = $('#cursor');
  const dot  = $('#cursorDot');
  if (!ring || !dot) return;

  // Inject the contextual label (e.g. "VIEW" over a project card).
  const label = document.createElement('span');
  label.className = 'cursor__label';
  ring.appendChild(label);

  // Inject a symbol for interactive links/buttons (e.g. "↗" or "→")
  const symbol = document.createElement('span');
  symbol.className = 'cursor__symbol';
  ring.appendChild(symbol);

  document.body.classList.add('has-cursor');

  // Target = real mouse; ring lerps toward it for a smooth trailing feel.
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;
  let visible = false;

  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    if (!visible) { visible = true; document.body.classList.add('cursor-active'); }

    // Dynamic hover states using fast event delegation inside mousemove
    const target = e.target?.closest?.('a, button, [data-magnetic], .filter__btn, input, textarea, [role="button"], [data-cursor], .project');
    if (!target) {
      ring.classList.remove('is-hover', 'is-label', 'is-input', 'is-interactive');
      label.textContent = '';
      symbol.textContent = '';
      return;
    }

    const isTextEntry = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    const isProject = target.classList.contains('project') || target.hasAttribute('data-cursor');
    const isLink = target.tagName === 'A';
    const isButton = target.tagName === 'BUTTON' || target.classList.contains('filter__btn') || target.getAttribute('role') === 'button';

    if (isTextEntry) {
      ring.classList.add('is-input');
      ring.classList.remove('is-hover', 'is-label', 'is-interactive');
      label.textContent = '';
      symbol.textContent = '';
    } else if (isProject) {
      ring.classList.remove('is-input', 'is-interactive');
      ring.classList.add('is-hover', 'is-label');
      const text = (target.dataset.cursor || 'View').trim();
      label.textContent = text;
      symbol.textContent = '';
    } else if (isLink || isButton) {
      ring.classList.remove('is-input', 'is-label');
      ring.classList.add('is-hover', 'is-interactive');
      label.textContent = '';
      symbol.textContent = isLink ? '↗' : '→';
    } else {
      ring.classList.remove('is-input', 'is-label', 'is-interactive');
      label.textContent = '';
      symbol.textContent = '';
    }
  }, { passive: true });

  // Hide the cursor when it leaves the window; restore on return.
  addEventListener('mouseout', (e) => { if (!e.relatedTarget) document.body.classList.remove('cursor-active'); });
  addEventListener('mousedown', () => ring.classList.add('is-down'));
  addEventListener('mouseup',   () => ring.classList.remove('is-down'));

  const render = () => {
    rx = lerp(rx, mx, 0.18);
    ry = my = lerp(ry, my, 0.18); // Wait, make sure we use standard my
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(render);
  };
  // Wait, let's fix the animation loop typo (ry = my = lerp...)
  // The original was:
  // ry = lerp(ry, my, 0.18);
  // Let's write it cleanly below:
  const renderClean = () => {
    rx = lerp(rx, mx, 0.18);
    ry = lerp(ry, my, 0.18);
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(renderClean);
  };
  requestAnimationFrame(renderClean);
}

/** Magnetic attraction: elements drift toward the cursor on hover. */
export function initMagnetic() {
  if (!isFinePointer() || prefersReducedMotion()) return;

  $$('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetStrength) || 0.35;
    const onMove = rafThrottle((e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}
