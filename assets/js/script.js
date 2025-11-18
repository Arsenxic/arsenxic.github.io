// couleur et classe utilitaires
const ACCENT_CLASS = 'menu-highlight';

/* replace top-level handlers with an init function that can be called again after dynamic insertion */
(function(){
  let installed = false;

  function setupDelegatedHover() {
    // use mouseover/mouseout + relatedTarget check to emulate mouseenter/mouseleave with delegation
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    function onMouseOver(e) {
      const el = e.target.closest('[data-menu-target]');
      if (!el) return;
      const related = e.relatedTarget;
      if (related && el.contains(related)) return; // coming from inside same element
      const key = el.getAttribute('data-menu-target');
      highlightMenuLink(key, true);
    }

    function onMouseOut(e) {
      const el = e.target.closest('[data-menu-target]');
      if (!el) return;
      const related = e.relatedTarget;
      if (related && el.contains(related)) return; // moving to child
      const key = el.getAttribute('data-menu-target');
      highlightMenuLink(key, false);
    }
  }

  function setupLightboxAndOrientation(container = document) {
    // lightbox: use delegation so it works for newly-inserted DOM
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    document.addEventListener('click', function (e) {
      const img = e.target.closest('.project-images img');
      if (img) {
        if (lightbox && lightboxImg) {
          lightboxImg.src = img.src;
          lightbox.style.display = 'flex';
        }
      }
      // close lightbox when clicking on the overlay (or close button)
      if (lightbox && (e.target === lightbox || e.target.closest && e.target.closest('.lightbox-close'))) {
        lightbox.style.display = 'none';
        if (lightboxImg) lightboxImg.src = '';
      }
    });

    // mark orientations for images currently in DOM (and those already loaded)
    const imgs = container.querySelectorAll('.project-images img');
    imgs.forEach(img => {
      function applyClass() {
        if (!img.naturalWidth || !img.naturalHeight) return;
        const cls = img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait';
        img.classList.add(cls);
      }
      if (img.complete) {
        applyClass();
      } else {
        img.addEventListener('load', applyClass, { once: true });
      }
      img.style.cursor = 'zoom-in';
    });
  }

  // conserve le comportement global : scroll smooth
  document.documentElement.style.scrollBehavior = 'smooth';

  // expose and install
  function initInteractions(container = document) {
    // idempotence simple : n'installer les handlers globaux qu'une seule fois
    if (!installed) {
      setupDelegatedHover();
      installed = true;
    }
    // pour parties spécifiques (images) on ré-applique au container passé
    setupLightboxAndOrientation(container);
  }

  // exposer globalement pour que load-sidebar.js appelle initInteractions() après insertion
  window.initInteractions = initInteractions;

  // appel initial au chargement de la page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initInteractions(document));
  } else {
    initInteractions(document);
  }

})();

/* Fonctions d'aide */
function highlightMenuLink(key, on){
  if(!key) return;
  // trouver le lien du menu qui a data-project-link = key
  const menuEl = document.querySelector(`[data-project-link="${key}"]`);
  if(menuEl){
    if(on){
      menuEl.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent') || 'rgb(0,120,255)';
      menuEl.style.textDecoration = 'underline';
    } else {
      menuEl.style.color = '';
      menuEl.style.textDecoration = '';
    }
  }
}

// ==== CHANGEMENT : suppression des blocs redondants ====
// Les anciens handlers suivants ont été supprimés car initInteractions() les gère déjà :
// - le bloc document.addEventListener('DOMContentLoaded', ...) qui installait le lightbox
// - l'IIFE markOrientations() qui marquait portrait/landscape
// Si nécessaire, relancer initInteractions(document) après insertion dynamique d'éléments.