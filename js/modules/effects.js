// Small effects carried over from the old site:
// - entrance animations ([data-animation]): when scrolled into view, or on
//   page load with data-animation-trigger="load";
// - the homepage hero's slow parallax background;
// - "Read more" on the Team page.

export function initAnimations() {
  const items = [...document.querySelectorAll('[data-animation]')];
  const start = (el) => {
    el.style.animationDelay = el.dataset.animationDelay || '0s';
    el.classList.add('brx-animated', `brx-animate-${el.dataset.animation}`);
  };
  if (!('IntersectionObserver' in window)) { items.forEach(start); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { start(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  items.forEach((el) => (el.dataset.animationTrigger === 'load' ? start(el) : io.observe(el)));
}

export function initParallax() {
  const sections = document.querySelectorAll('.parallax-section');
  if (!sections.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const update = () => {
    const y = window.scrollY;
    sections.forEach((s) => { s.style.backgroundPosition = `center calc(50% + ${y * 0.5}px)`; });
  };
  document.addEventListener('scroll', update, { passive: true });
  update();
}

export function initReadMore() {
  document.querySelectorAll('.read-more').forEach((section) => {
    const button = section.querySelector('.read-more-link');
    const content = section.querySelector('.content');
    if (!button || !content) return;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !content.style.maxHeight;
      content.style.maxHeight = open ? `${content.scrollHeight}px` : '';
      section.classList.toggle('expanded', open);
      button.setAttribute('aria-expanded', String(open));
      button.firstChild.textContent = open ? 'Read less' : 'Read more';
      const icon = button.querySelector('i');
      if (icon) icon.style.transform = open ? 'rotate(180deg)' : '';
    });
  });
}
