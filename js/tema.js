/* ============================================================
   TEMA GLOBAL
   Se carga en todas las páginas del sitio.
   ============================================================ */

(function () {
  const CLAVE = 'ajustes-lectura';
  const temas = ['claro', 'sepia', 'oscuro', 'negro'];

  const iconos = {
    claro:  '🌕',  
    sepia:  '🌗',  
    oscuro: '🌘',  
    negro:  '🌑'   
  };

  function leerAjustes() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; }
    catch { return {}; }
  }

  function guardarTema(tema) {
    const aj = leerAjustes();
    aj.tema = tema;
    localStorage.setItem(CLAVE, JSON.stringify(aj));
  }

  function aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;
    const icono = document.getElementById('icono-tema');
    if (icono) {
      icono.textContent = iconos[tema] || iconos.claro;
    }
  }

  const inicial = leerAjustes().tema || 'claro';
  aplicarTema(inicial);

  document.addEventListener('DOMContentLoaded', () => {
    aplicarTema(inicial);
    const btn = document.getElementById('btn-tema');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const actual = document.documentElement.dataset.tema || 'claro';
      const i = temas.indexOf(actual);
      const siguiente = temas[(i + 1) % temas.length];
      aplicarTema(siguiente);
      guardarTema(siguiente);

      if (typeof window.sincronizarTemaLector === 'function') {
        window.sincronizarTemaLector(siguiente);
      }
    });
  });
})();

/* ---------- Bloqueos generales ---------- */
(function () {
  document.addEventListener('contextmenu', e => e.preventDefault());

  document.addEventListener('keydown', e => {
    if (e.key === 'F12') { e.preventDefault(); return; }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey &&
        ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }

    if ((e.ctrlKey || e.metaKey) && !e.shiftKey &&
        ['c', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }

    if (e.key === 'PrintScreen') {
      if (navigator.clipboard) navigator.clipboard.writeText('');
    }
  });
})();
