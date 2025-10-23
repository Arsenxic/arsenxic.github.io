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

// ...existing code...
(function setupImageGrid() {
  const imgs = Array.from(document.querySelectorAll('.project-images img'));

  // Ajoute classes portrait / landscape selon dimensions
  function markOrientation(img) {
    if (!img.naturalWidth || !img.naturalHeight) return;
    img.classList.toggle('landscape', img.naturalWidth >= img.naturalHeight);
    img.classList.toggle('portrait', img.naturalWidth < img.naturalHeight);
  }

  // Quand toutes les images sont chargées (ou au load individuel)
  imgs.forEach(img => {
    if (img.complete) {
      markOrientation(img);
    } else {
      img.addEventListener('load', () => markOrientation(img));
    }
  });

  // Après un petit délai (pour s'assurer que orientations sont posées), appliquer règles de paire
  function applyPairRules() {
    // clear previous wide flags
    imgs.forEach(i => i.classList.remove('landscape-wide'));

    for (let i = 0; i < imgs.length - 1; i++) {
      const cur = imgs[i];
      const next = imgs[i + 1];
      if (!cur.classList.contains('landscape') && !cur.classList.contains('portrait')) continue;
      if (!next.classList.contains('landscape') && !next.classList.contains('portrait')) continue;

      // si paysage suivi d'un portrait => agrandir le paysage
      if (cur.classList.contains('landscape') && next.classList.contains('portrait')) {
        cur.classList.add('landscape-wide');
        i++; // sauter next, on a déjà géré la paire
        continue;
      }

      // si portrait suivi d'un paysage => agrandir le paysage (le suivant)
      if (cur.classList.contains('portrait') && next.classList.contains('landscape')) {
        next.classList.add('landscape-wide');
        i++; // sauter next
        continue;
      }
    }
  }

  // exécuter après petits délais / sur resize (quelques images peuvent charger plus tard)
  function scheduleApply() {
    setTimeout(applyPairRules, 120);
  }
  scheduleApply();
  window.addEventListener('load', scheduleApply);
  window.addEventListener('resize', scheduleApply);
})();
// ...existing code...