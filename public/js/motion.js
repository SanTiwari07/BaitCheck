'use strict';

(function (global) {
  const seenKeys = new Map();
  let revealObserver = null;

  function prefersReducedMotion() {
    return (
      typeof global.matchMedia === 'function' &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /**
   * Returns true only when a render key changes for a given slot,
   * preventing background polls or minor control toggles from replaying
   * one-shot entrance animations.
   */
  function consumeKey(slot, key) {
    if (prefersReducedMotion()) {
      seenKeys.set(slot, key);
      return false;
    }
    const prev = seenKeys.get(slot);
    if (prev === key) return false;
    seenKeys.set(slot, key);
    return true;
  }

  function resetSlot(slot) {
    seenKeys.delete(slot);
  }

  function applyStagger(container, selector, stepMs = 55, baseMs = 0) {
    if (!container || prefersReducedMotion()) return;
    const nodes = container.querySelectorAll(selector);
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].style.setProperty('--bc-delay', `${baseMs + i * stepMs}ms`);
      nodes[i].classList.add('bc-stagger-item');
    }
  }

  function triggerViewEnter(viewEl) {
    if (!viewEl || prefersReducedMotion()) return;
    viewEl.classList.remove('bc-view-enter');
    void viewEl.offsetWidth;
    viewEl.classList.add('bc-view-enter');
  }

  function animateScaleXFill(el) {
    if (!el || prefersReducedMotion()) return;
    el.classList.add('bc-bar-sweep');
  }

  function ensureObserver() {
    if (revealObserver || typeof global.IntersectionObserver !== 'function') {
      return revealObserver;
    }
    revealObserver = new global.IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );
    return revealObserver;
  }

  /**
   * Progressively reveals cards as they enter the viewport while keeping
   * everything immediately visible when reduced motion is preferred or
   * IntersectionObserver is unavailable.
   */
  function observeScrollReveals(container, selector, stepMs = 55) {
    if (!container) return;
    const nodes = container.querySelectorAll(selector);
    if (!nodes.length) return;

    if (prefersReducedMotion() || typeof global.IntersectionObserver !== 'function') {
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.add('is-revealed');
      }
      return;
    }

    const observer = ensureObserver();
    const vh = global.innerHeight || 800;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.style.setProperty('--bc-delay', `${Math.min(i, 5) * stepMs}ms`);
      node.classList.add('bc-scroll-reveal');
      const rect = node.getBoundingClientRect();
      if (rect.top < vh * 0.95) {
        node.classList.add('is-revealed');
      } else {
        observer.observe(node);
      }
    }
  }

  global.BaitCheckMotion = {
    prefersReducedMotion,
    consumeKey,
    resetSlot,
    applyStagger,
    triggerViewEnter,
    animateScaleXFill,
    observeScrollReveals
  };
})(window);
