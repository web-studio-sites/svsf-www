// Header menus, matching the old Bricks site: dropdowns open on hover on
// larger screens and on tap on phones; below 768px the menu is a full-screen
// overlay opened with the burger button.
const MOBILE = window.matchMedia('(max-width: 767px)');

export function initHeader() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  const dropdowns = [...nav.querySelectorAll('.brxe-dropdown')];

  const setOpen = (dd, open) => {
    dd.classList.toggle('open', open);
    dd.querySelector('.brx-submenu-toggle button')?.setAttribute('aria-expanded', String(open));
    if (open && dd.classList.contains('brx-has-megamenu') && !MOBILE.matches) placeMegaMenu(dd);
  };

  // The Supply & Funding mega menu lines up with the left edge of the menu,
  // as Bricks does with its "mega menu" setting.
  const placeMegaMenu = (dd) => {
    const content = dd.querySelector('.brx-dropdown-content');
    const left = nav.getBoundingClientRect().left - dd.getBoundingClientRect().left;
    content.style.left = `${left}px`;
  };

  // Bricks' styles keep dropdowns hidden until its script has positioned them.
  nav.querySelectorAll('.brx-dropdown-content').forEach((c) => c.classList.add('brx-submenu-positioned'));

  dropdowns.forEach((dd) => {
    // A short delay before closing, so moving the mouse from the link down
    // into the menu (or brushing past its edge) doesn't snap it shut.
    let closeTimer;
    dd.addEventListener('mouseenter', () => {
      if (MOBILE.matches) return;
      clearTimeout(closeTimer);
      dropdowns.forEach((other) => other !== dd && setOpen(other, false));
      setOpen(dd, true);
    });
    dd.addEventListener('mouseleave', () => {
      if (MOBILE.matches) return;
      closeTimer = setTimeout(() => setOpen(dd, false), 250);
    });
    dd.querySelector('.brx-submenu-toggle')?.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !dd.classList.contains('open');
      dropdowns.forEach((other) => other !== dd && setOpen(other, false));
      setOpen(dd, open);
    });
    dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget)) setOpen(dd, false); });
  });

  // Moving onto any other top-level menu item closes an open dropdown at
  // once (the closing delay is only for travelling down into the menu).
  nav.querySelectorAll('.brx-nav-nested-items > li').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (MOBILE.matches) return;
      dropdowns.forEach((dd) => dd !== item && dd.classList.contains('open') && setOpen(dd, false));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { dropdowns.forEach((dd) => setOpen(dd, false)); setMobile(false); }
  });

  // Mobile overlay.
  const openBtn = nav.querySelector('.nav-open');
  const closeBtn = nav.querySelector('.nav-close');
  const setMobile = (open) => {
    nav.classList.toggle('brx-open', open);
    document.body.classList.toggle('no-scroll', open);
    openBtn?.setAttribute('aria-expanded', String(open));
    openBtn?.classList.toggle('is-active', open);
    closeBtn?.classList.toggle('is-active', open);
    closeBtn?.setAttribute('aria-expanded', String(open));
    if (open) closeBtn?.focus();
  };
  openBtn?.addEventListener('click', () => setMobile(true));
  closeBtn?.addEventListener('click', () => { setMobile(false); openBtn?.focus(); });
  MOBILE.addEventListener('change', () => setMobile(false));

  // Links that go nowhere yet (e.g. the portal) shouldn't jump to the top.
  nav.querySelectorAll('a[href="#"]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
}
