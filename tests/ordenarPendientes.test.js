const { ordenarPendientes } = require('../src/ordenes/ordenarPendientes');

// Ayuda para crear órdenes cortas en las pruebas
const orden = (numero, prioridad, horaLlegada) => ({ numero, prioridad, horaLlegada });
const numeros = (lista) => lista.map((o) => o.numero);

describe('HU-03 ordenarPendientes', () => {
  // ---- Casos normales ----
  test('ordena por prioridad: Alta, luego Media, luego Baja (escenario 1 de HU-03)', () => {
    const ordenes = [
      orden('SF-0195', 'Baja', '08:00'),
      orden('SF-0198', 'Media', '09:00'),
      orden('SF-0201', 'Alta', '10:30'),
    ];
    expect(numeros(ordenarPendientes(ordenes))).toEqual(['SF-0201', 'SF-0198', 'SF-0195']);
  });

  test('con la misma prioridad atiende primero la que llegó antes', () => {
    const ordenes = [
      orden('SF-0210', 'Alta', '11:00'),
      orden('SF-0207', 'Alta', '09:15'),
      orden('SF-0209', 'Media', '08:00'),
    ];
    expect(numeros(ordenarPendientes(ordenes))).toEqual(['SF-0207', 'SF-0210', 'SF-0209']);
  });

  // ---- Casos límite ----
  test('lista vacía devuelve una lista vacía (escenario 2 de HU-03)', () => {
    expect(ordenarPendientes([])).toEqual([]);
  });

  test('una sola orden devuelve esa misma orden', () => {
    const ordenes = [orden('SF-0215', 'Baja', '07:00')];
    expect(numeros(ordenarPendientes(ordenes))).toEqual(['SF-0215']);
  });

  test('misma prioridad y misma hora conservan el orden en que llegaron', () => {
    const ordenes = [
      orden('SF-0220', 'Media', '10:00'),
      orden('SF-0221', 'Media', '10:00'),
    ];
    expect(numeros(ordenarPendientes(ordenes))).toEqual(['SF-0220', 'SF-0221']);
  });

  test('no modifica la lista original', () => {
    const ordenes = [
      orden('SF-0195', 'Baja', '08:00'),
      orden('SF-0201', 'Alta', '10:30'),
    ];
    ordenarPendientes(ordenes);
    expect(numeros(ordenes)).toEqual(['SF-0195', 'SF-0201']);
  });

  // ---- Caso de error ----
  test('lanza error si una orden tiene una prioridad que no existe', () => {
    const ordenes = [
      orden('SF-0229', 'Alta', '08:00'),
      orden('SF-0230', 'Urgentísima', '09:00'),
    ];
    expect(() => ordenarPendientes(ordenes)).toThrow(
      'Prioridad no válida en la orden SF-0230: Urgentísima'
    );
  });
});
