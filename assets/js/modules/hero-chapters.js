/* hero-chapters.js — Scroll-driven chapter sync, stagger transitions, counters, and indicators */
import { $, $$, prefersReducedMotion } from './utils.js';

let currentIdx = 0;
let techAnimated = false;
let processAnimated = false;
let countersAnimated = false;

// Eased counter count-up using requestAnimationFrame
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // easeOutQuad
    const easedProgress = progress * (2 - progress);
    obj.textContent = Math.floor(easedProgress * (end - start) + start);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      obj.textContent = end;
    }
  };
  requestAnimationFrame(step);
}

function triggerTechAnimation() {
  const pills = $$('.tech-pill');
  const cards = $$('.build-card');
  
  pills.forEach((pill, idx) => {
    setTimeout(() => {
      if (currentIdx === 1) pill.classList.add('is-visible');
    }, idx * 80);
  });
  
  cards.forEach((card, idx) => {
    setTimeout(() => {
      if (currentIdx === 1) card.classList.add('is-visible');
    }, idx * 150);
  });
}

function resetTechAnimation() {
  $$('.tech-pill').forEach((pill) => pill.classList.remove('is-visible'));
  $$('.build-card').forEach((card) => card.classList.remove('is-visible'));
}

function triggerProcessAnimation() {
  const line = $('.process-line');
  const steps = $$('.process-step');
  
  if (line) line.classList.add('is-visible');
  steps.forEach((step, idx) => {
    setTimeout(() => {
      if (currentIdx === 2) step.classList.add('is-visible');
    }, idx * 150);
  });
}

function resetProcessAnimation() {
  const line = $('.process-line');
  if (line) line.classList.remove('is-visible');
  $$('.process-step').forEach((step) => step.classList.remove('is-visible'));
}

function triggerCountersAnimation() {
  $$('.stat-counter__number').forEach((el) => {
    const targetVal = parseInt(el.dataset.target, 10);
    animateValue(el, 0, targetVal, 1500);
  });
}

export function initHeroChapters() {
  const hero = $('#hero');
  const dotsNav = $('#heroDots');
  if (!hero) return;

  let heroTop = 0;
  let heroHeight = 0;
  let windowHeight = 0;
  let scrollable = 0;

  function updateDimensions() {
    heroTop = hero.offsetTop;
    heroHeight = hero.offsetHeight;
    windowHeight = window.innerHeight;
    scrollable = heroHeight - windowHeight;
  }

  // Update layout calculations on resize/load
  updateDimensions();
  window.addEventListener('resize', updateDimensions);
  window.addEventListener('load', updateDimensions);
  setTimeout(updateDimensions, 1000);

  // Setup intersection observer to show/hide the dot navigation
  if (dotsNav) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        dotsNav.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { rootMargin: '-10% 0px -10% 0px' });
    observer.observe(hero);
  }

  // Handle dot navigation clicks
  const dots = $$('.hero-dot');
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateDimensions();
      const targetProgress = 0.125 + idx * 0.25;
      const targetScroll = heroTop + targetProgress * scrollable;
      const lenis = window.__lenisInstance;
      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    });
  });

  // Main scroll sync logic
  function syncChapters() {
    const lenis = window.__lenisInstance;
    const scrollY = lenis ? lenis.scroll : window.scrollY;
    
    updateDimensions();
    const progress = scrollable > 0
      ? Math.min(1, Math.max(0, (scrollY - heroTop) / scrollable))
      : 0;

    const newIdx = Math.min(3, Math.floor(progress * 4));
    
    if (newIdx === currentIdx) return;

    const leftChapters = $$('.hero__col--left .hero__chapter');
    const rightChapters = $$('.hero__col--right .hero__chapter');

    // Transition out current active chapter
    const oldLeft = leftChapters[currentIdx];
    const oldRight = rightChapters[currentIdx];
    if (oldLeft) {
      oldLeft.classList.remove('is-active');
      oldLeft.classList.add('is-leaving');
      setTimeout(() => oldLeft.classList.remove('is-leaving'), 300);
    }
    if (oldRight) {
      oldRight.classList.remove('is-active');
      oldRight.classList.add('is-leaving');
      setTimeout(() => oldRight.classList.remove('is-leaving'), 300);
    }

    // Reset stagger flags when leaving chapters
    if (currentIdx === 1) {
      resetTechAnimation();
      techAnimated = false;
    }
    if (currentIdx === 2) {
      resetProcessAnimation();
      processAnimated = false;
      countersAnimated = false;
    }

    // Set new active chapter
    currentIdx = newIdx;
    
    const newLeft = leftChapters[newIdx];
    const newRight = rightChapters[newIdx];
    if (newLeft) newLeft.classList.add('is-active');
    if (newRight) newRight.classList.add('is-active');

    // Update dot indicator
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === newIdx);
    });

    // Trigger stagger animations for the newly active chapter
    if (newIdx === 1 && !techAnimated) {
      techAnimated = true;
      triggerTechAnimation();
    } else if (newIdx === 2) {
      if (!processAnimated) {
        processAnimated = true;
        triggerProcessAnimation();
      }
      if (!countersAnimated) {
        countersAnimated = true;
        triggerCountersAnimation();
      }
    }
  }

  // Initial state check
  const initialScrollY = window.__lenisInstance ? window.__lenisInstance.scroll : window.scrollY;
  const initialProgress = scrollable > 0 ? Math.min(1, Math.max(0, (initialScrollY - heroTop) / scrollable)) : 0;
  const initialIdx = Math.min(3, Math.floor(initialProgress * 4));
  currentIdx = initialIdx;

  const leftChapters = $$('.hero__col--left .hero__chapter');
  const rightChapters = $$('.hero__col--right .hero__chapter');

  leftChapters.forEach((ch, idx) => {
    ch.classList.toggle('is-active', idx === initialIdx);
    ch.classList.remove('is-leaving');
  });
  rightChapters.forEach((ch, idx) => {
    ch.classList.toggle('is-active', idx === initialIdx);
    ch.classList.remove('is-leaving');
  });
  dots.forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === initialIdx);
  });

  if (initialIdx === 1) {
    techAnimated = true;
    triggerTechAnimation();
  } else if (initialIdx === 2) {
    processAnimated = true;
    countersAnimated = true;
    triggerProcessAnimation();
    triggerCountersAnimation();
  }

  // Hook into Lenis or window scroll
  const lenis = window.__lenisInstance;
  if (lenis) {
    lenis.on('scroll', syncChapters);
  } else {
    window.addEventListener('scroll', syncChapters, { passive: true });
  }
}
