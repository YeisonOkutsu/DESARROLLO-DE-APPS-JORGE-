// HU-03: ordena las órdenes pendientes por prioridad y hora de llegada.

// Peso de cada prioridad: el número más bajo se atiende primero.
const PESO_PRIORIDAD = Object.freeze({ Alta: 0, Media: 1, Baja: 2 });

function validarPrioridades(ordenes) {
  ordenes.forEach((orden, posicion) => {
    if (orden === null || typeof orden !== 'object') {
      throw new TypeError(`Orden no válida en la posición ${posicion}`);
    }
    if (!Object.hasOwn(PESO_PRIORIDAD, orden.prioridad)) {
      throw new Error(`Prioridad no válida en la orden ${orden.numero}: ${orden.prioridad}`);
    }
  });
}

function compararOrdenes(a, b) {
  const diferenciaPrioridad = PESO_PRIORIDAD[a.prioridad] - PESO_PRIORIDAD[b.prioridad];
  if (diferenciaPrioridad !== 0) {
    return diferenciaPrioridad;
  }
  // Misma prioridad: primero la que llegó antes ("HH:MM" se compara como texto).
  return a.horaLlegada.localeCompare(b.horaLlegada);
}

function ordenarPendientes(ordenes) {
  if (!Array.isArray(ordenes)) {
    throw new TypeError('La lista de órdenes debe ser un arreglo');
  }
  validarPrioridades(ordenes);
  // Se copia la lista para no modificar la original.
  return [...ordenes].sort(compararOrdenes);
}

module.exports = { ordenarPendientes, PESO_PRIORIDAD };
