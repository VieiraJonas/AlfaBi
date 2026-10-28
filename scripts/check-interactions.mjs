import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
function script(file) {
  return fs.readFileSync(file, 'utf8').split('<script>')[1].split('</script>')[0].replace(/^import .*;$/gm, '');
}
function fixture(reduced = false) {
  const reads = [], writes = [], frames = new Map(), nodes = new Map(), listeners = new Map();
  let frameID = 0;
  function node(id) {
    if (nodes.has(id)) return nodes.get(id);
    const events = new Map(), attributes = new Map(), classes = new Set();
    const n = {
      events, attributes, complete: true, duration: 4, readyState: 2, currentTime: 0,
      seeking: false, scrollLeft: 0, scrollWidth: 1000, clientWidth: 400,
      children: [{}, {}, {}], textContent: '', seekable: { length: 1, end: () => 4 },
      classList: { add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c), toggle: (c, on) => on ? classes.add(c) : classes.delete(c) },
      style: { setProperty: (k, v) => writes.push(k), removeProperty: k => writes.push(k) },
      getBoundingClientRect: () => { reads.push(id); return { width: 300, height: 800, left: 0, top: 0 }; },
      addEventListener: (type, fn) => events.set(type, fn),
      getAttribute: k => attributes.get(k), setAttribute: (k, v) => attributes.set(k, v),
      pause() {}, load() {}, scrollBy: options => { n.scrollLeft += options.left; },
      querySelector: () => node('poster'),
    };
    if (id === 'reviews-track') n.firstElementChild = node('first-review');
    nodes.set(id, n); return n;
  }
  const context = vm.createContext({
    document: {
      getElementById: node, querySelectorAll: () => [],
      documentElement: node('html'), fonts: { ready: Promise.resolve() },
      createElement: () => node('external-script'), head: { appendChild() {} },
    },
    matchMedia: () => ({ matches: reduced, addEventListener() {} }),
    requestAnimationFrame: fn => { frames.set(++frameID, fn); return frameID; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: () => 1, clearTimeout() {},
    ResizeObserver: class { constructor(fn) { this.fn = fn; } observe() {} },
    window: { addEventListener: (type, fn) => listeners.set(type, fn), scrollBy() {} },
    getComputedStyle: () => ({ columnGap: '20' }),
    ScrollTrigger: { refresh() {} },
    gsap: { context: fn => { fn(); return { revert() {} }; }, to: () => ({ scrollTrigger: { kill() {} }, kill() {} }), from() {}, registerPlugin() {} },
    performance: { now: () => 7000 }, scrollY: 0, innerHeight: 800,
    location: { hash: '' }, ALFABI_CONFIG: { video: '/video.mp4', gsap: '/gsap.js', scrollTrigger: '/scroll.js' },
    URL, fetch, console,
  });
  const run = code => vm.runInContext(code, context);
  const tick = () => { const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn()); };
  return { run, tick, node, frames, reads, writes };
}
const reviews = fixture();
reviews.run(script('src/components/sections/TestimonialsSection.astro'));
reviews.tick(); reviews.tick();
assert.equal(reviews.node('reviews-prev').disabled, true);
assert.equal(reviews.node('reviews-next').disabled, false);
reviews.node('reviews-next').events.get('click')();
assert.equal(reviews.node('reviews-track').scrollLeft, 320);
reviews.node('reviews-track').events.get('scroll')(); reviews.tick();
assert.equal(reviews.node('review-count').textContent, '02 / 03');
reviews.node('reviews-track').scrollLeft = 600;
reviews.node('reviews-track').events.get('scroll')(); reviews.tick();
assert.equal(reviews.node('reviews-next').disabled, true);
reviews.node('reviews-track').events.get('keydown')({ key: 'ArrowLeft', preventDefault() {} });
assert.equal(reviews.node('reviews-track').scrollLeft, 280);
const hero = fixture();
hero.run(script('src/components/sections/HeroSection.astro'));
assert.equal(hero.node('hero-video').src, undefined, 'Video must wait for poster paint');
hero.tick(); assert.equal(hero.node('hero-video').src, undefined);
hero.tick(); assert.equal(hero.node('hero-video').src, '/video.mp4');
hero.run('librariesReady = true; setupScroll();'); hero.tick();
assert.equal(hero.node('hero-scene').style.height, '2200px');
hero.run('playhead.progress = .5; updateScene();'); hero.tick();
assert.ok(Math.abs(hero.node('hero-video').currentTime - 1.9995) < .001);
hero.run('failVideo();');
assert.equal(hero.node('html').classList.contains('scene-static'), true);
const reduced = fixture(true);
reduced.run(script('src/components/sections/HeroSection.astro')); reduced.tick(); reduced.tick();
assert.equal(reduced.node('hero-video').src, undefined);
assert.equal(reduced.node('html').classList.contains('scene-static'), true);
console.log('PASS: review navigation, keyboard and boundaries; deferred hero loading, video seeking, failure fallback and reduced motion.');
