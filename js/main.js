function initHoverLabels() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return;

  document.querySelectorAll('.wireframe-container svg .hover-target').forEach(target => {
    target.addEventListener('click', (e) => {
      e.preventDefault();
      const labelGroup = target.nextElementSibling;
      if (labelGroup && labelGroup.classList.contains('label-group')) {
        labelGroup.classList.toggle('visible');
      }
    });
  });
}

function initCategoryFilter() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');

      filterButtons.forEach(b => b.removeAttribute('aria-current'));
      button.setAttribute('aria-current', 'true');

      document.querySelectorAll('[data-category]').forEach(section => {
        if (category === 'all' || section.getAttribute('data-category') === category) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHoverLabels();
  initCategoryFilter();
});
