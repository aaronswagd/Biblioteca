/* ============================================================
   TEMA GLOBAL + ANTI-CAPTURA
   Se carga en todas las páginas del sitio.
   ============================================================ */

/* ---------- Tema compartido ---------- */
(function () {
  const CLAVE = 'ajustes-lectura';
  const temas = ['claro', 'sepia', 'oscuro', 'negro'];

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
      icono.textContent = (tema === 'oscuro' || tema === 'negro') ? '☀' : '☾';
    }
  }

  // Aplicar lo antes posible para evitar parpadeos
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

      // Si estamos en el lector, sincronizar su objeto interno
      if (typeof window.sincronizarTemaLector === 'function') {
        window.sincronizarTemaLector(siguiente);
      }
    });
  });
})();

/* ---------- Anti-captura: desenfoque al perder foco ---------- */
(function () {
  // En iOS Safari, 'blur' se dispara al tocar la barra de direcciones,
  // al hacer scroll, etc. Por eso lo desactivamos en dispositivos
  // táctiles / móviles. Solo funciona en escritorio.
  const esTactil = ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0);
  const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (esTactil || esMovil) return;

  const DURACION_MINIMA = 400;  // ms: ignora parpadeos rápidos
  let ultimaPerdida = 0;

  function desenfocar() {
    document.body.classList.add('captura-bloqueada');
  }
  function enfocar() {
    document.body.classList.remove('captura-bloqueada');
  }

  window.addEventListener('blur', () => {
    ultimaPerdida = Date.now();
    desenfocar();
  });

  window.addEventListener('focus', () => {
    if (Date.now() - ultimaPerdida < DURACION_MINIMA) return;
    enfocar();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) desenfocar();
    else enfocar();
  });
})();

/* ---------- Bloqueos generales del sitio ---------- */
(function () {
  // Clic derecho
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Atajos de teclado peligrosos
  document.addEventListener('keydown', e => {
    // F12
    if (e.key === 'F12') { e.preventDefault(); return; }
    // Ctrl+Shift+I / J / C (DevTools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey &&
        ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
    // Ctrl+C / X / U / S / P
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey &&
        ['c', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
    // Impr Pant: intento de limpiar el portapapeles
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      if (navigator.clipboard) navigator.clipboard.writeText('');
    }
  });
})();