// HU-03: ordena las órdenes pendientes por prioridad y hora de llegada.

/**
 * @typedef {Object} Orden
 * @property {string} numero        Número de la orden, por ejemplo "SF-0201".
 * @property {'Alta'|'Media'|'Baja'} prioridad
 * @property {string} horaLlegada   Hora en formato "HH:MM" de 24 horas, por ejemplo "08:05".
 */

/** Peso de cada prioridad: el número más bajo se atiende primero. */
const PESO_PRIORIDAD = Object.freeze({ Alta: 0, Media: 1, Baja: 2 });

/** Hora de 24 horas con dos dígitos, de "00:00" a "23:59". */
const FORMATO_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Revisa que una orden tenga una forma válida antes de ordenarla.
 *
 * @param {*} orden          Elemento de la lista que se va a revisar.
 * @param {number} posicion  Posición del elemento en la lista (para el mensaje de error).
 * @returns {void}
 * @throws {TypeError} Si el elemento no es un objeto (por ejemplo null o un texto).
 * @throws {Error} Si la prioridad no es propia de PESO_PRIORIDAD (Alta, Media o Baja).
 * @throws {Error} Si horaLlegada no es un texto con formato "HH:MM" de 24 horas.
 */
function validarOrden(orden, posicion) {
  if (orden === null || typeof orden !== 'object') {
    throw new TypeError(`Orden no válida en la posición ${posicion}`);
  }
  // Object.hasOwn y no "in": "in" también acepta nombres heredados como "toString".
  if (!Object.hasOwn(PESO_PRIORIDAD, orden.prioridad)) {
    throw new Error(`Prioridad no válida en la orden ${orden.numero}: ${orden.prioridad}`);
  }
  if (typeof orden.horaLlegada !== 'string' || !FORMATO_HORA.test(orden.horaLlegada)) {
    throw new Error(
      `Hora de llegada no válida en la orden ${orden.numero}: ${orden.horaLlegada}`
    );
  }
}

/**
 * Revisa todas las órdenes de la lista; se detiene en la primera que no sea válida.
 *
 * @param {Array<*>} ordenes  Lista de órdenes que se va a revisar.
 * @returns {void}
 * @throws {TypeError|Error} Los mismos errores de validarOrden.
 */
function validarOrdenes(ordenes) {
  ordenes.forEach(validarOrden);
}

/**
 * Compara dos órdenes para Array.prototype.sort: primero por prioridad y,
 * si empatan, por hora de llegada (la más antigua primero).
 *
 * @param {Orden} a
 * @param {Orden} b
 * @returns {number} Negativo si a va antes, positivo si b va antes y 0 si empatan.
 */
function compararOrdenes(a, b) {
  const diferenciaPrioridad = PESO_PRIORIDAD[a.prioridad] - PESO_PRIORIDAD[b.prioridad];
  if (diferenciaPrioridad !== 0) {
    return diferenciaPrioridad;
  }
  // Con "HH:MM" ya validado, comparar como texto da el mismo orden que comparar las horas.
  if (a.horaLlegada < b.horaLlegada) return -1;
  if (a.horaLlegada > b.horaLlegada) return 1;
  return 0;
}

/**
 * Ordena las órdenes pendientes del taller para la cola de los técnicos (HU-03).
 *
 * Primero van las de prioridad Alta, luego Media y luego Baja; dentro de la misma
 * prioridad, la que llegó antes. Si dos órdenes empatan en prioridad y hora,
 * conservan el orden en que venían. La lista que recibe no se modifica.
 *
 * @param {Orden[]} ordenes  Órdenes pendientes (la función no filtra por estado).
 * @returns {Orden[]} Una lista nueva con las mismas órdenes ordenadas; [] si no hay órdenes.
 * @throws {TypeError} Si ordenes no es un arreglo o si algún elemento no es un objeto.
 * @throws {Error} Si alguna orden tiene una prioridad o una hora de llegada no válida.
 *
 * @example
 * ordenarPendientes([
 *   { numero: 'SF-0195', prioridad: 'Baja', horaLlegada: '08:00' },
 *   { numero: 'SF-0201', prioridad: 'Alta', horaLlegada: '10:30' },
 * ]); // → [SF-0201, SF-0195]
 */
function ordenarPendientes(ordenes) {
  if (!Array.isArray(ordenes)) {
    throw new TypeError('La lista de órdenes debe ser un arreglo');
  }
  validarOrdenes(ordenes);
  // Se copia la lista para no modificar la original.
  return [...ordenes].sort(compararOrdenes);
}

module.exports = { ordenarPendientes, validarOrden, compararOrdenes, PESO_PRIORIDAD };
