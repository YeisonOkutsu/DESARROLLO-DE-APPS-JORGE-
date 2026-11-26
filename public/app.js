// Página de la demo: pide la cola a la API y la pinta.
// Todo el texto se escribe con textContent y no con innerHTML, para que un número de orden
// o un mensaje de error con <script> se vea como texto y no se ejecute (pendiente P-03).
const cola = document.getElementById('cola');
const vacia = document.getElementById('vacia');
const mensaje = document.getElementById('mensaje');

function celda(texto, clase) {
  const td = document.createElement('td');
  td.textContent = texto;
  if (clase) td.className = clase;
  return td;
}

async function cargarCola() {
  const respuesta = await fetch('/api/ordenes/pendientes');
  const ordenes = await respuesta.json();
  cola.replaceChildren();
  ordenes.forEach((orden, i) => {
    const fila = document.createElement('tr');
    fila.append(
      celda(String(i + 1)),
      celda(orden.numero),
      celda(orden.prioridad, orden.prioridad),
      celda(orden.horaLlegada),
    );
    cola.append(fila);
  });
  vacia.hidden = ordenes.length > 0;
}

function mostrar(texto, clase) {
  mensaje.textContent = texto;
  mensaje.className = clase;
}

document.getElementById('formulario').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const orden = {
    numero: document.getElementById('numero').value,
    prioridad: document.getElementById('prioridad').value,
    horaLlegada: document.getElementById('hora').value,
  };
  const respuesta = await fetch('/api/ordenes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orden),
  });
  const datos = await respuesta.json();
  if (respuesta.ok) {
    mostrar(`Orden ${datos.numero} agregada a la cola`, 'ok');
    await cargarCola();
  } else {
    mostrar(datos.error, 'error');
  }
});

cargarCola();
