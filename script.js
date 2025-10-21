// couleur et classe utilitaires
const ACCENT_CLASS = 'menu-highlight';

/* 1) Hover sur image : faire ressortir lien correspondant dans menu */
document.querySelectorAll('[data-menu-target]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const key = el.getAttribute('data-menu-target');
    highlightMenuLink(key, true);
  });
  el.addEventListener('mouseleave', () => {
    const key = el.getAttribute('data-menu-target');
    highlightMenuLink(key, false);
  });

  // si c'est un lien, garder le comportement normal au clic
});

/* 2) Scroll smooth pour les ancres internes */
document.documentElement.style.scrollBehavior = 'smooth';

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
/* Bonus : quand on clique sur une image ou titre, s'assurer navigation normale (déjà lien) */

// Lightbox pour images de projet
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.project-images img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
    });
  });
  lightbox.addEventListener('click', function() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
  });
});

// Marquer les images comme portrait ou paysage
(function markOrientations() {
  const imgs = document.querySelectorAll('.project-images img');
  imgs.forEach(img => {
    function applyClass() {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const cls = img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait';
      img.classList.add(cls);
    }
    if (img.complete) {
      applyClass();
    } else {
      img.addEventListener('load', applyClass);
    }
  });
})();