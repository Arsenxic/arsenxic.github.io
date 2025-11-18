// ...existing code...
(function loadSidebar(){
  const placeholder = document.getElementById('sidebar-placeholder');
  if (!placeholder) return;

  // chemins candidats (racine et chemins relatifs pour pages en sous-dossiers / tests locaux)
  const candidatePaths = [
    '/includes/sidebar.html',
    'includes/sidebar.html',
    '../includes/sidebar.html',
    '../../includes/sidebar.html'
  ];

  (async () => {
    try {
      const { html } = await fetchFromCandidates(candidatePaths);
      await insertHtmlAndExecuteScripts(placeholder, html);
      if (window.initInteractions && typeof window.initInteractions === 'function') {
        window.initInteractions();
      }
    } catch (err) {
      console.error('Erreur lors du chargement de la sidebar:', err);
    }
  })();

  async function fetchFromCandidates(paths) {
    for (const p of paths) {
      try {
        const url = new URL(p, location.href).href;
        const resp = await fetch(url, { cache: 'no-cache' });
        if (!resp.ok) continue;
        const text = await resp.text();
        return { html: text, url };
      } catch (e) {
        // ignore and try next
      }
    }
    throw new Error('Impossible de charger includes/sidebar.html depuis les chemins testés: ' + paths.join(', '));
  }

  // insère le HTML et ré-exécute les <script> (internes et externes) pour que leur code s'exécute
  async function insertHtmlAndExecuteScripts(container, html) {
    container.innerHTML = html;
    const scripts = Array.from(container.querySelectorAll('script'));
    if (scripts.length === 0) return;

    await Promise.all(scripts.map(oldScript => {
      return new Promise(resolve => {
        const newScript = document.createElement('script');

        // conserver l'attribut type si présent
        if (oldScript.type) newScript.type = oldScript.type;

        if (oldScript.src) {
          // résoudre les src relatifs par rapport à la page courante
          newScript.src = new URL(oldScript.getAttribute('src'), location.href).href;
          newScript.async = oldScript.async;
          newScript.onload = () => resolve();
          newScript.onerror = () => {
            console.warn('Échec chargement script de la sidebar:', newScript.src);
            resolve();
          };
          // remplacer : le nouvel élément sera inséré dans le DOM et déclenchera le chargement
          oldScript.parentNode.replaceChild(newScript, oldScript);
        } else {
          // script inline : remplacer pour que le navigateur l'exécute immédiatement
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
          // exécution inline synchrones ; on considère terminé
          resolve();
        }
      });
    }));
  }
})();