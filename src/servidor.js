// Arranca la demo local: npm start y abrir http://localhost:3000
const { crearApp } = require('./app');

const PUERTO = Number(process.env.PORT) || 3000;

// Órdenes del escenario 1 de la HU-03, para que la cola no arranque vacía.
const ordenesDeEjemplo = [
  { numero: 'SF-0195', prioridad: 'Baja', horaLlegada: '08:00' },
  { numero: 'SF-0198', prioridad: 'Media', horaLlegada: '09:00' },
  { numero: 'SF-0201', prioridad: 'Alta', horaLlegada: '10:30' },
];

crearApp(ordenesDeEjemplo).listen(PUERTO, () => {
  console.log(`Smartfix: cola de atención en http://localhost:${PUERTO}`);
});
