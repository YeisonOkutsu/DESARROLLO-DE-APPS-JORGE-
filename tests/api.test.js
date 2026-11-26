// Pruebas de la API local de la demo (semana 8): la ruta de la HU-03 y el registro de órdenes.
const request = require('supertest');
const { crearApp } = require('../src/app');

const ESCENARIO_1 = [
  { numero: 'SF-0195', prioridad: 'Baja', horaLlegada: '08:00' },
  { numero: 'SF-0198', prioridad: 'Media', horaLlegada: '09:00' },
  { numero: 'SF-0201', prioridad: 'Alta', horaLlegada: '10:30' },
];

const numeros = (ordenes) => ordenes.map((o) => o.numero);

describe('API de la cola de atención (HU-03)', () => {
  test('GET /api/ordenes/pendientes devuelve la cola del escenario 1 en orden', async () => {
    const respuesta = await request(crearApp(ESCENARIO_1)).get('/api/ordenes/pendientes');
    expect(respuesta.status).toBe(200);
    expect(numeros(respuesta.body)).toEqual(['SF-0201', 'SF-0198', 'SF-0195']);
  });

  test('sin órdenes, la cola es una lista vacía', async () => {
    const respuesta = await request(crearApp()).get('/api/ordenes/pendientes');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([]);
  });

  test('una orden Alta nueva queda después de la Alta que llegó antes', async () => {
    const app = crearApp(ESCENARIO_1);
    const nueva = { numero: 'SF-0210', prioridad: 'Alta', horaLlegada: '11:15' };
    const creada = await request(app).post('/api/ordenes').send(nueva);
    expect(creada.status).toBe(201);
    const cola = await request(app).get('/api/ordenes/pendientes');
    expect(numeros(cola.body)).toEqual(['SF-0201', 'SF-0210', 'SF-0198', 'SF-0195']);
  });

  test('rechaza con 400 una prioridad que no existe y no la agrega', async () => {
    const app = crearApp(ESCENARIO_1);
    const orden = { numero: 'SF-0211', prioridad: 'Urgentísima', horaLlegada: '11:20' };
    const respuesta = await request(app).post('/api/ordenes').send(orden);
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toBe('Prioridad no válida en la orden SF-0211: Urgentísima');
    const cola = await request(app).get('/api/ordenes/pendientes');
    expect(cola.body).toHaveLength(3);
  });

  test('rechaza con 400 la hora "9:00" sin el cero', async () => {
    const orden = { numero: 'SF-0212', prioridad: 'Media', horaLlegada: '9:00' };
    const respuesta = await request(crearApp()).post('/api/ordenes').send(orden);
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toMatch(/hora/i);
  });

  test('rechaza con 400 una orden sin número', async () => {
    const orden = { numero: '   ', prioridad: 'Alta', horaLlegada: '10:00' };
    const respuesta = await request(crearApp()).post('/api/ordenes').send(orden);
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toBe('El número de la orden es obligatorio (máximo 20)');
  });

  test('crearApp copia las órdenes iniciales y no cambia la lista que recibe', async () => {
    const iniciales = ESCENARIO_1.map((o) => ({ ...o }));
    const app = crearApp(iniciales);
    await request(app)
      .post('/api/ordenes')
      .send({ numero: 'SF-0213', prioridad: 'Baja', horaLlegada: '12:00' });
    expect(iniciales).toHaveLength(3);
  });
});
