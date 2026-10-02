/* ============================================================
   LECTOR: carga de capítulos + ajustes de lectura
   ============================================================ */

/* ---------- Parámetros de la URL ---------- */
const params = new URLSearchParams(location.search);
const slug = params.get('h');
const capIdx = parseInt(params.get('c') || '0', 10);
const historia = biblioteca.find(h => h.slug === slug);

/* ---------- Cargar capítulo ---------- */
if (!historia) {
  document.body.innerHTML = '<p style="padding:2rem">Historia no encontrada.</p>';
} else {
  document.title = `${historia.capitulos[capIdx].titulo} — ${historia.titulo}`;
  document.getElementById('titulo-historia').textContent = historia.titulo;
  document.getElementById('titulo-capitulo').textContent = historia.capitulos[capIdx].titulo;

  fetch(historia.capitulos[capIdx].archivo)
    .then(r => {
      if (!r.ok) throw new Error('No encontrado');
      return r.text();
    })
    .then(html => {
      document.getElementById('contenido').innerHTML = html;
    })
    .catch(() => {
      document.getElementById('contenido').innerHTML =
        '<p>No se pudo cargar el capítulo. Verifica que el archivo exista.</p>';
    });

  /* ---------- Navegación prev / next ---------- */
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');

  if (capIdx > 0) {
    prev.href = `leer.html?h=${slug}&c=${capIdx - 1}`;
  } else {
    prev.style.visibility = 'hidden';
  }

  if (capIdx < historia.capitulos.length - 1) {
    next.href = `leer.html?h=${slug}&c=${capIdx + 1}`;
  } else {
    next.style.visibility = 'hidden';
  }
}

/* ============================================================
   AJUSTES DE LECTURA
   ============================================================ */
const CLAVE = 'ajustes-lectura';
const porDefecto = { tema: 'claro', fuente: 'serif', tamano: 18, inter: 1.8, ancho: 680 };
let ajustes = { ...porDefecto, ...JSON.parse(localStorage.getItem(CLAVE) || '{}') };

const fuentes = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Helvetica Neue', system-ui, sans-serif",
  dislexia: "Verdana, sans-serif"
};

function aplicar() {
  const r = document.documentElement;

  // El tema lo maneja tema.js, pero mantenemos el objeto local sincronizado
  ajustes.tema = r.dataset.tema || ajustes.tema;

  r.style.setProperty('--fuente', fuentes[ajustes.fuente]);
  r.style.setProperty('--tamano', ajustes.tamano + 'px');
  r.style.setProperty('--interlineado', ajustes.inter);
  r.style.setProperty('--ancho-lectura', ajustes.ancho + 'px');

  // Actualizar valores visibles
  const vTam = document.getElementById('val-tamano');
  const vInt = document.getElementById('val-inter');
  const vAnc = document.getElementById('val-ancho');
  if (vTam) vTam.textContent = ajustes.tamano;
  if (vInt) vInt.textContent = Number(ajustes.inter).toFixed(1);
  if (vAnc) vAnc.textContent = ajustes.ancho;

  // Sincronizar sliders
  const rTam = document.getElementById('rango-tamano');
  const rInt = document.getElementById('rango-inter');
  const rAnc = document.getElementById('rango-ancho');
  if (rTam) rTam.value = ajustes.tamano;
  if (rInt) rInt.value = ajustes.inter;
  if (rAnc) rAnc.value = ajustes.ancho;

  // Marcar seleccionados
  document.querySelectorAll('.temas .swatch').forEach(b =>
    b.classList.toggle('activo', b.dataset.tema === ajustes.tema));
  document.querySelectorAll('.fuentes button').forEach(b =>
    b.classList.toggle('activo', b.dataset.fuente === ajustes.fuente));

  localStorage.setItem(CLAVE, JSON.stringify(ajustes));
}

/* Exponer para que tema.js pueda sincronizar cuando cambie el tema global */
window.sincronizarTemaLector = function (nuevoTema) {
  ajustes.tema = nuevoTema;
  document.querySelectorAll('.temas .swatch').forEach(b =>
    b.classList.toggle('activo', b.dataset.tema === nuevoTema));
};

/* ---------- Panel de ajustes ---------- */
const panel = document.getElementById('panel-ajustes');
const btnAjustes = document.getElementById('btn-ajustes');

if (btnAjustes) {
  btnAjustes.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
  });
}

document.querySelectorAll('.temas .swatch').forEach(b => {
  b.addEventListener('click', () => {
    ajustes.tema = b.dataset.tema;
    document.documentElement.dataset.tema = ajustes.tema;
    // Actualizar icono del botón de tema
    const icono = document.getElementById('icono-tema');
    if (icono) icono.textContent = (ajustes.tema === 'oscuro' || ajustes.tema === 'negro') ? '☀' : '☾';
    // Guardar también en localStorage
    localStorage.setItem(CLAVE, JSON.stringify(ajustes));
    aplicar();
  });
});

document.querySelectorAll('.fuentes button').forEach(b => {
  b.addEventListener('click', () => {
    ajustes.fuente = b.dataset.fuente;
    aplicar();
  });
});

const rangoTamano = document.getElementById('rango-tamano');
const rangoInter = document.getElementById('rango-inter');
const rangoAncho = document.getElementById('rango-ancho');

if (rangoTamano) rangoTamano.addEventListener('input', e => { ajustes.tamano = +e.target.value; aplicar(); });
if (rangoInter)  rangoInter.addEventListener('input',  e => { ajustes.inter  = +e.target.value; aplicar(); });
if (rangoAncho)  rangoAncho.addEventListener('input',  e => { ajustes.ancho  = +e.target.value; aplicar(); });

/* Cerrar panel con Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && panel && !panel.hidden) panel.hidden = true;
});

/* Aplicar ajustes al cargar */
aplicar();

/* ============================================================
   ANTI-COPIA ESPECÍFICO DEL CONTENIDO
   ============================================================ */
const contenido = document.getElementById('contenido');
if (contenido) {
  ['copy', 'cut', 'contextmenu', 'selectstart', 'dragstart'].forEach(evt => {
    contenido.addEventListener(evt, e => e.preventDefault());
  });
}