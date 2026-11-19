/* Wireframe labels.
   Each .hover-target is followed in the markup by its .label-group. Labels are
   moved to the end of their SVG so they paint above every shape, then shown
   on hover, focus or tap of their target. Canvases with labels get a toggle. */
function initWireframeLabels() {
  document.querySelectorAll('.wireframe-container svg').forEach(svg => {
    const pairs = [];
    svg.querySelectorAll('.hover-target').forEach(target => {
      const group = target.nextElementSibling;
      if (group && group.classList.contains('label-group')) pairs.push([target, group]);
    });
    if (!pairs.length) return;

    pairs.forEach(([target, group]) => {
      svg.appendChild(group);
      const show = on => {
        target.classList.toggle('is-active', on);
        group.classList.toggle('visible', on);
      };
      target.addEventListener('pointerenter', () => show(true));
      target.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') show(false); });
      target.addEventListener('click', e => {
        e.preventDefault();
        if (e.pointerType !== 'mouse') show(!group.classList.contains('visible'));
      });
    });

    const container = svg.closest('.wireframe-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'label-toggle';
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Show labels';
    button.addEventListener('click', () => {
      const on = !container.classList.contains('show-labels');
      container.classList.toggle('show-labels', on);
      button.setAttribute('aria-pressed', String(on));
      button.textContent = on ? 'Hide labels' : 'Show labels';
    });
    container.appendChild(button);
  });
}

function initCategoryFilter() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const category = button.getAttribute('data-filter');

      filterButtons.forEach(b => b.removeAttribute('aria-current'));
      button.setAttribute('aria-current', 'true');

      document.querySelectorAll('[data-category]').forEach(section => {
        section.hidden = !(category === 'all' || section.getAttribute('data-category') === category);
      });
    });
  });
}

function initCategoryCounts() {
  document.querySelectorAll('[data-category]').forEach(section => {
    const heading = section.querySelector('.category-heading');
    const count = section.querySelectorAll('.component-grid > li').length;
    if (heading && count) heading.setAttribute('data-count', count === 1 ? '1 component' : `${count} components`);
  });
}

/* Wide tables: page through columns with buttons, drag with the mouse,
   or use the arrow keys once the table has focus. The pinned first
   column is subtracted so a page step never hides unseen columns. */
function initTableScroll() {
  document.querySelectorAll('.table-scroll').forEach(scroller => {
    const controls = document.querySelector(`.table-scroll-controls [aria-controls="${scroller.id}"]`)?.parentElement;
    const pinned = () => scroller.querySelector('th:first-child')?.offsetWidth || 0;
    const page = dir => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scroller.scrollBy({ left: dir * Math.max(120, scroller.clientWidth - pinned() - 40), behavior: reduce ? 'auto' : 'smooth' });
    };
    const update = () => {
      if (!controls) return;
      const max = scroller.scrollWidth - scroller.clientWidth;
      controls.hidden = max <= 1;
      controls.querySelector('[data-scroll="-1"]').disabled = scroller.scrollLeft <= 1;
      controls.querySelector('[data-scroll="1"]').disabled = scroller.scrollLeft >= max - 1;
    };
    controls?.querySelectorAll('[data-scroll]').forEach(b => b.addEventListener('click', () => page(Number(b.dataset.scroll))));
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    scroller.addEventListener('keydown', e => {
      if (e.target !== scroller) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scroller.scrollBy({ left: e.key === 'ArrowRight' ? 80 : -80 });
      } else if (e.key === 'PageDown' || e.key === 'PageUp') {
        e.preventDefault();
        page(e.key === 'PageDown' ? 1 : -1);
      }
    });

    // Mouse drag (touch already scrolls natively). Links still work on a click.
    let start = null;
    scroller.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      start = { x: e.clientX, left: scroller.scrollLeft, moved: false };
    });
    window.addEventListener('pointermove', e => {
      if (!start) return;
      const dx = e.clientX - start.x;
      if (Math.abs(dx) > 4) { start.moved = true; scroller.classList.add('is-dragging'); }
      if (start.moved) scroller.scrollLeft = start.left - dx;
    });
    window.addEventListener('pointerup', () => {
      if (start?.moved) scroller.addEventListener('click', e => e.preventDefault(), { capture: true, once: true });
      start = null;
      scroller.classList.remove('is-dragging');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;
    anchor.addEventListener('click', e => {
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        history.replaceState(null, '', `#${id}`);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initWireframeLabels();
  initCategoryFilter();
  initCategoryCounts();
  initTableScroll();
  initSmoothScroll();
});
