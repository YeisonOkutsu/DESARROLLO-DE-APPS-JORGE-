// HU-03: ordena las órdenes pendientes por prioridad y hora de llegada
function ordenarPendientes(ordenes) {
  const pesos = { Alta: 0, Media: 1, Baja: 2 };

  for (const o of ordenes) {
    if (!Object.hasOwn(pesos, o.prioridad)) {
      throw new Error(`Prioridad no válida en la orden ${o.numero}: ${o.prioridad}`);
    }
  }

  return [...ordenes].sort((a, b) => {
    if (pesos[a.prioridad] !== pesos[b.prioridad]) {
      return pesos[a.prioridad] - pesos[b.prioridad];
    }
    return a.horaLlegada.localeCompare(b.horaLlegada);
  });
}

module.exports = { ordenarPendientes };
