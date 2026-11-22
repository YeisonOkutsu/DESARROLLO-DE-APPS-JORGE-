// Semana 7: pruebas de las reglas de la HU-03 diseñadas con particiones de equivalencia,
// valores límite y tablas de decisión (ver registro_pruebas.md). La IA generó un borrador;
// esta es la versión revisada. Cada esperado sale de la regla, no de ejecutar el código.
const {
  ordenarPendientes,
  validarOrden,
  compararOrdenes,
} = require('../src/ordenes/ordenarPendientes');
const { crearOrdenesSinteticas } = require('./datos/ordenesSinteticas');

const orden = (numero, prioridad, horaLlegada) => ({ numero, prioridad, horaLlegada });

// ---------------------------------------------------------------------------
// Regla 1. validarOrden: una orden es válida solo si es un objeto, su prioridad es
// exactamente Alta, Media o Baja y su hora de llegada es "HH:MM" de 00:00 a 23:59.
// ---------------------------------------------------------------------------
describe('validarOrden', () => {
  test.each([
    ['Alta', '08:00'], // P1 partición válida: prioridad Alta
    ['Media', '08:00'], // P2 partición válida: prioridad Media
    ['Baja', '08:00'], // P3 partición válida: prioridad Baja
    ['Alta', '00:00'], // L1 límite: primera hora válida del día
    ['Alta', '00:59'], // L3 límite: último minuto válido (59)
    ['Alta', '19:59'], // L5 límite: última hora que empieza por 1
    ['Alta', '20:00'], // L6 límite: primera hora que empieza por 2
    ['Alta', '23:59'], // L7 límite: última hora válida del día
  ])('acepta prioridad %s con hora %s', (prioridad, hora) => {
    expect(validarOrden(orden('SF-0400', prioridad, hora), 0)).toBeUndefined();
  });

  test.each([
    [null, 3], // P4 partición inválida: null
    ['SF-0402', 0], // P5 partición inválida: texto en vez de orden
    [42, 7], // P6 partición inválida: número
    [undefined, 1], // P7 partición inválida: no llegó nada
  ])('lanza TypeError con la posición si la orden es %p', (valor, posicion) => {
    const llamar = () => validarOrden(valor, posicion);
    expect(llamar).toThrow(TypeError);
    expect(llamar).toThrow(`Orden no válida en la posición ${posicion}`);
  });

  test.each([
    ['Urgentísima'], // P8 partición inválida: prioridad que no existe
    ['alta'], // P9 partición inválida: minúsculas (la regla dice exactamente "Alta")
    [' Alta'], // P10 partición inválida: con espacio adelante
    [''], // P11 partición inválida: texto vacío
    [undefined], // P12 partición inválida: sin prioridad
    ['toString'], // P13 partición inválida: nombre heredado de Object
  ])('lanza Error si la prioridad es %p', (prioridad) => {
    expect(() => validarOrden(orden('SF-0403', prioridad, '08:00'), 0)).toThrow(
      `Prioridad no válida en la orden SF-0403: ${prioridad}`
    );
  });

  test.each([
    ['00:60'], // L4 límite: primer minuto inválido (60)
    ['24:00'], // L8 límite: primera hora inválida después de 23:59
    ['23:60'], // L9 límite: minuto 60 en la última hora
    ['9:00'], // P14 partición inválida: hora de un dígito
    ['09:5'], // P15 partición inválida: minuto de un dígito
    ['0900'], // P16 partición inválida: sin dos puntos
    [''], // P17 partición inválida: texto vacío
    [900], // P18 partición inválida: número en vez de texto
  ])('lanza Error si la hora es %p', (hora) => {
    expect(() => validarOrden(orden('SF-0404', 'Media', hora), 0)).toThrow(
      `Hora de llegada no válida en la orden SF-0404: ${hora}`
    );
  });

  // Tabla de decisión: C1 ¿es objeto?, C2 ¿prioridad válida?, C3 ¿hora válida?
  // "-" = no importa. La regla revisa en ese orden y avisa el primer problema.
  test.each([
    // C1 C2 C3 -> resultado
    ['R1 no - -', null, TypeError, 'Orden no válida en la posición 5'],
    [
      'R2 sí no -',
      orden('SF-0405', 'Urgente', '99:99'),
      Error,
      'Prioridad no válida en la orden SF-0405: Urgente',
    ],
    [
      'R3 sí sí no',
      orden('SF-0406', 'Baja', '99:99'),
      Error,
      'Hora de llegada no válida en la orden SF-0406: 99:99',
    ],
  ])('tabla de decisión %s', (_regla, valor, tipo, mensaje) => {
    const llamar = () => validarOrden(valor, 5);
    expect(llamar).toThrow(tipo);
    expect(llamar).toThrow(mensaje);
  });

  test('tabla de decisión R4 sí sí sí: la orden es válida', () => {
    expect(validarOrden(orden('SF-0407', 'Baja', '12:00'), 5)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Regla 2. compararOrdenes: va primero la de mayor prioridad (Alta, Media, Baja);
// si empatan en prioridad, la que llegó antes; si empatan en todo, ninguna va antes.
// La regla solo define QUIÉN va primero, así que se compara el signo del resultado:
// -1 = a va antes, 1 = b va antes, 0 = empate.
// ---------------------------------------------------------------------------
describe('compararOrdenes', () => {
  // Tabla de decisión: C1 prioridad de a frente a b, C2 hora de a frente a b.
  test.each([
    ['Alta', '10:00', 'Media', '08:00', -1], // D1 C1 a mayor, C2 no importa (a llegó después)
    ['Alta', '10:00', 'Baja', '08:00', -1], // D1 con la distancia máxima de prioridad
    ['Media', '07:00', 'Alta', '09:00', 1], // D2 C1 a menor, C2 no importa (a llegó antes)
    ['Baja', '08:00', 'Alta', '10:00', 1], // D2 con la distancia máxima de prioridad
    ['Media', '08:00', 'Media', '10:00', -1], // D3 C1 igual, C2 a llegó antes
    ['Media', '10:00', 'Media', '08:00', 1], // D4 C1 igual, C2 a llegó después
    ['Media', '08:00', 'Media', '08:00', 0], // D5 C1 igual, C2 igual: empate
    ['Baja', '09:59', 'Baja', '10:00', -1], // límite: minutos seguidos al cambiar de hora
    ['Alta', '00:00', 'Alta', '23:59', -1], // límite: primera y última hora del día
  ])('%s %s frente a %s %s: signo %d', (pa, ha, pb, hb, signo) => {
    expect(Math.sign(compararOrdenes(orden('A', pa, ha), orden('B', pb, hb)))).toBe(signo);
  });
});

// ---------------------------------------------------------------------------
// Regla 3. ordenarPendientes: devuelve una lista nueva con las mismas órdenes, ordenadas
// con la regla 2; los empates conservan el orden de llegada a la lista; no cambia la
// lista original; si una orden no es válida, rechaza toda la operación.
// ---------------------------------------------------------------------------
describe('ordenarPendientes con datos sintéticos del taller', () => {
  let ordenes;
  beforeEach(() => {
    ordenes = crearOrdenesSinteticas(); // fixture: lista nueva en cada prueba
  });

  test('ordena las seis órdenes del taller según la HU-03', () => {
    // Esperado calculado a mano con la regla: Alta (08:15, 10:30), Media (00:00, 23:59),
    // Baja (07:45 y 07:45: empate, se conserva el orden de la lista).
    expect(ordenarPendientes(ordenes).map((o) => o.numero)).toEqual([
      'SF-0304',
      'SF-0302',
      'SF-0303',
      'SF-0305',
      'SF-0301',
      'SF-0306',
    ]);
  });

  test('no cambia los datos de cada orden (tildes, ñ, apóstrofo, texto vacío y costo 0)', () => {
    const copiaAntes = JSON.parse(JSON.stringify(ordenes));
    const resultado = ordenarPendientes(ordenes);
    const porNumero = (lista, numero) => lista.find((o) => o.numero === numero);
    for (const original of copiaAntes) {
      expect(porNumero(resultado, original.numero)).toEqual(original);
    }
    expect(porNumero(resultado, 'SF-0301').cliente).toBe('Begoña Ñáñez Ortiz');
    expect(porNumero(resultado, 'SF-0302').cliente).toBe("Andrés D'Alessandro Peña");
    expect(porNumero(resultado, 'SF-0303').falla).toBe('');
    expect(porNumero(resultado, 'SF-0306').costoEstimado).toBe(0);
  });

  test('rechaza toda la lista si una orden tiene la hora 24:00', () => {
    ordenes[2].horaLlegada = '24:00';
    expect(() => ordenarPendientes(ordenes)).toThrow(
      'Hora de llegada no válida en la orden SF-0303: 24:00'
    );
  });
});
