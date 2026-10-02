/* ============================================================
   BIBLIOTECA: cuadrícula + modal
   ============================================================ */
const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const modalContenido = document.getElementById('modal-contenido');

/* ---------- Construir cuadrícula ---------- */
biblioteca.forEach((h, i) => {
  const card = document.createElement('div');
  card.className = 'tarjeta';
  card.innerHTML = `
    <img src="${h.portada}" alt="${h.titulo}" loading="lazy">
    <h3>${h.titulo}</h3>
  `;
  card.addEventListener('click', () => abrirModal(i));
  grid.appendChild(card);
});

/* ---------- Abrir modal con detalle ---------- */
function abrirModal(i) {
  const h = biblioteca[i];
  const fecha = new Date(h.fecha).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  modalContenido.innerHTML = `
    <div class="modal-cabecera">
      <img src="${h.portada}" alt="${h.titulo}">
      <div>
        <h2>${h.titulo}</h2>
        <p class="meta">${h.generos.join(' · ')}</p>
        <p class="meta">Publicado el ${fecha}</p>
        <p class="meta">${h.capitulos.length} ${h.capitulos.length === 1 ? 'capítulo' : 'capítulos'}</p>
      </div>
    </div>
    <section class="modal-sinopsis">
      <h4>Sinopsis</h4>
      <p>${h.sinopsis}</p>
    </section>
    <section class="modal-capitulos">
      <h4>Capítulos</h4>
      <ol>
        ${h.capitulos.map((c, idx) => `
          <li><a href="leer.html?h=${h.slug}&c=${idx}">${c.titulo}</a></li>
        `).join('')}
      </ol>
    </section>
  `;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

/* ---------- Cerrar modal ---------- */
modal.addEventListener('click', e => {
  if (e.target.dataset.cerrar !== undefined) cerrarModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) cerrarModal();
});

function cerrarModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}