// API local de la demo: expone la HU-03 en una ruta de Express y sirve la página de public/.
// Las órdenes viven en memoria (no hay base de datos todavía), así que se pierden al reiniciar.
const path = require('path');
const express = require('express');
const { ordenarPendientes, validarOrden } = require('./ordenes/ordenarPendientes');

const LARGO_MAXIMO_NUMERO = 20;

/**
 * Crea la aplicación de Express con su propia lista de órdenes pendientes.
 *
 * @param {Array<Object>} ordenesIniciales Órdenes con las que arranca la cola.
 * @returns {import('express').Express} La aplicación lista para escuchar o para probar.
 */
function crearApp(ordenesIniciales = []) {
  const pendientes = ordenesIniciales.map((orden) => ({ ...orden }));
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // HU-03: la cola de los técnicos, ordenada por prioridad y luego por hora de llegada.
  app.get('/api/ordenes/pendientes', (req, res) => {
    res.json(ordenarPendientes(pendientes));
  });

  // Registrar una orden pendiente. Se valida con las mismas reglas de la HU-03.
  app.post('/api/ordenes', (req, res) => {
    const { numero, prioridad, horaLlegada } = req.body ?? {};
    if (typeof numero !== 'string' || !numero.trim() || numero.length > LARGO_MAXIMO_NUMERO) {
      return res.status(400).json({ error: 'El número de la orden es obligatorio (máximo 20)' });
    }
    const orden = { numero: numero.trim(), prioridad, horaLlegada };
    try {
      validarOrden(orden, pendientes.length);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    pendientes.push(orden);
    return res.status(201).json(orden);
  });

  return app;
}

module.exports = { crearApp };
