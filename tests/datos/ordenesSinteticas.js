// Datos de prueba SINTÉTICOS para la HU-03 (taller Smartfix, Neiva).
// Los generó la IA con contexto local (equipos, fallas y barrios de Neiva) y los revisé a mano.
// No son personas reales: los nombres son inventados y los teléfonos son ficticios,
// todos con el prefijo de prueba 300 000 00xx. Casos difíciles incluidos: tildes, ñ,
// apóstrofo, texto vacío, costo en cero y horas en los bordes del día (00:00 y 23:59).

/**
 * Devuelve una lista NUEVA de órdenes pendientes cada vez que se llama, para que una
 * prueba no pueda dañar los datos de otra.
 *
 * @returns {Array<Object>} Órdenes con los campos de la HU-03 y datos extra del taller.
 */
function crearOrdenesSinteticas() {
  return [
    {
      numero: 'SF-0301',
      prioridad: 'Baja',
      horaLlegada: '07:45',
      cliente: 'Begoña Ñáñez Ortiz',
      telefono: '300 000 0001',
      equipo: 'Xiaomi Redmi Note 12',
      falla: 'Cambio de batería; se descarga en dos horas',
      barrio: 'Las Granjas',
      costoEstimado: 85000,
    },
    {
      numero: 'SF-0302',
      prioridad: 'Alta',
      horaLlegada: '10:30',
      cliente: "Andrés D'Alessandro Peña",
      telefono: '300 000 0002',
      equipo: 'Samsung Galaxy A54',
      falla: 'Pantalla rota, no responde el táctil',
      barrio: 'Cándido Leguízamo',
      costoEstimado: 320000,
    },
    {
      numero: 'SF-0303',
      prioridad: 'Media',
      horaLlegada: '00:00',
      cliente: 'José Ángel Muñoz',
      telefono: '300 000 0003',
      equipo: 'Motorola Moto G84',
      falla: '',
      barrio: 'Quebracho',
      costoEstimado: 0,
    },
    {
      numero: 'SF-0304',
      prioridad: 'Alta',
      horaLlegada: '08:15',
      cliente: 'María Fernanda Güiza',
      telefono: '300 000 0004',
      equipo: 'iPhone 11',
      falla: 'Se mojó: no enciende',
      barrio: 'Altico',
      costoEstimado: 150000,
    },
    {
      numero: 'SF-0305',
      prioridad: 'Media',
      horaLlegada: '23:59',
      cliente: "Luz Dary O'Connor",
      telefono: '300 000 0005',
      equipo: 'Huawei P30 Lite',
      falla: 'El micrófono no se escucha en llamadas',
      barrio: 'Santa Inés',
      costoEstimado: 60000,
    },
    {
      numero: 'SF-0306',
      prioridad: 'Baja',
      horaLlegada: '07:45',
      cliente: 'Íñigo Ríos Cañón',
      telefono: '300 000 0006',
      equipo: 'Tecno Spark 10',
      falla: 'Revisión general',
      barrio: 'Ipanema',
      costoEstimado: 0,
    },
  ];
}

module.exports = { crearOrdenesSinteticas };
