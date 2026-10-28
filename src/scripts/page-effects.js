import { ALFABI_CONFIG } from '../config/site';
const motion = matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('[data-contact]').forEach(link => {
      const message = link.dataset.contact === 'visit' ? ALFABI_CONFIG.visitMessage : ALFABI_CONFIG.teamMessage;
      link.href = `https://wa.me/${ALFABI_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    });

    const revealTargets = document.querySelectorAll('.reveal-up,.reveal-zoom');
    let revealObserver;
    function setupReveals() {
      revealObserver?.disconnect();
      if (motion.matches || !('IntersectionObserver' in window)) {
        revealTargets.forEach(target => { target.classList.remove('will-reveal'); target.classList.add('active'); });
        return;
      }
      revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active'); revealObserver.unobserve(entry.target);
      }), { threshold: .08, rootMargin: '0px 0px -20px 0px' });
      revealTargets.forEach((target, i) => {
        if (target.classList.contains('active')) return;
        target.classList.add('will-reveal');
        target.style.transitionDelay = `${(i % 3) * 60}ms`;
        revealObserver.observe(target);
      });
    }
    if ('IntersectionObserver' in window) {
      const atmosphereObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-inview', entry.isIntersecting)), { rootMargin: '80px' });
      document.querySelectorAll('.chapter,.hero-frame,.promise-strip,.location-section,.site-footer').forEach(section => atmosphereObserver.observe(section));
    }
    setupReveals(); motion.addEventListener('change', setupReveals);
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      const pending = new Map();
      let pointerFrame = 0;
      function paintGlows() {
        pointerFrame = 0;
        // Batch all measurements first; apply all style updates afterwards.
        const positions = [...pending].map(([card, point]) => {
          const rect = card.getBoundingClientRect();
          return { card, x: point.x - rect.left, y: point.y - rect.top };
        });
        pending.clear();
        for (const { card, x, y } of positions) {
          card.style.setProperty('--mx', `${x}px`);
          card.style.setProperty('--my', `${y}px`);
        }
      }
      document.querySelectorAll('.hover-glow').forEach(card => card.addEventListener('pointermove', event => {
        pending.set(card, { x: event.clientX, y: event.clientY });
        if (!pointerFrame) pointerFrame = requestAnimationFrame(paintGlows);
      }, { passive: true }));
    }
