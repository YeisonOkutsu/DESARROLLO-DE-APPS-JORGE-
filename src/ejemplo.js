// Ejemplo de uso de ordenarPendientes con las órdenes del escenario 1 de la HU-03.
// Ejecución: npm run ejemplo
const { ordenarPendientes } = require('./ordenes/ordenarPendientes');

const pendientes = [
  { numero: 'SF-0195', prioridad: 'Baja', horaLlegada: '08:00' },
  { numero: 'SF-0198', prioridad: 'Media', horaLlegada: '09:00' },
  { numero: 'SF-0201', prioridad: 'Alta', horaLlegada: '10:30' },
];

const cola = ordenarPendientes(pendientes);

if (cola.length === 0) {
  console.log('No hay órdenes pendientes');
} else {
  console.log('Cola de atención de los técnicos:');
  cola.forEach((orden, i) => {
    console.log(`${i + 1}. ${orden.numero}  ${orden.prioridad}  ${orden.horaLlegada}`);
  });
}
