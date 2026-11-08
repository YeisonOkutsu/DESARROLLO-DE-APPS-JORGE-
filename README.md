# Clasificador de solicitudes de reparación para Smartfix

Proyecto final del Seminario de Inteligencia Artificial Aplicada al Ciclo de Vida del Software (FET).

Estudiante: Yeison Andrés Perdomo Losada

El sistema registra las solicitudes de reparación de un taller de celulares, sugiere el tipo de falla y la prioridad con IA y ordena la cola de atención de los técnicos. Según el documento de diseño de la semana 4, el backend es una API en Node.js + Express; esta funcionalidad es la primera pieza de esa API.

## Funcionalidad de la semana 5

### Historia de usuario

**HU-03 (Must).** Como técnico, quiero ver las órdenes pendientes ordenadas por prioridad y luego por hora de llegada para atender primero lo urgente.

**Criterio de aceptación**

- **Escenario 1: orden de la lista.** Dado que hay tres órdenes pendientes: SF-0201 con prioridad Alta (llegó 10:30), SF-0198 con Media (09:00) y SF-0195 con Baja (08:00), cuando abro la lista, entonces las veo en este orden: SF-0201, SF-0198 y SF-0195.
- **Escenario 2: sin pendientes.** Dado que no hay órdenes pendientes, cuando abro la lista, entonces veo el mensaje «No hay órdenes pendientes». (La función devuelve una lista vacía y la pantalla muestra el mensaje.)
- **Escenario de error: prioridad no válida.** Dado que una orden llega con una prioridad que no existe, por ejemplo «Urgentísima», cuando se ordena la lista, entonces el sistema rechaza la operación con el mensaje «Prioridad no válida en la orden SF-xxxx: Urgentísima».

### Contrato de la función

**Nombre y firma**

```js
/**
 * @typedef {Object} Orden
 * @property {string} numero        Número de la orden, por ejemplo "SF-0201"
 * @property {'Alta'|'Media'|'Baja'} prioridad
 * @property {string} horaLlegada   Hora en formato "HH:MM" de 24 horas, por ejemplo "08:05"
 */

/**
 * @param {Orden[]} ordenes
 * @returns {Orden[]}
 */
function ordenarPendientes(ordenes)
```

Archivo: `src/ordenes/ordenarPendientes.js`

**Qué recibe**

Una lista (`Orden[]`) con las órdenes pendientes del taller. Cada orden tiene su número (`numero`), su prioridad (`prioridad`, que solo puede ser `Alta`, `Media` o `Baja`) y su hora de llegada (`horaLlegada`, texto `HH:MM`).

**Qué devuelve**

Una lista **nueva** (`Orden[]`) con las mismas órdenes, ordenadas primero por prioridad (Alta, luego Media, luego Baja) y, dentro de la misma prioridad, por hora de llegada, de la más antigua a la más reciente. La lista original no se modifica.

**Supuestos y casos límite**

- Todas las órdenes que recibe ya están pendientes; la función no filtra por estado.
- Todas las horas son del mismo día y vienen con dos dígitos (`08:05`, no `8:5`).
- Lista vacía: devuelve `[]` (la pantalla muestra «No hay órdenes pendientes»).
- Una sola orden: devuelve una lista con esa misma orden.
- Dos órdenes con la misma prioridad y la misma hora: conservan el orden en que llegaron en la lista.
- No modifica la lista que recibe.
- Error: si una orden tiene una prioridad distinta de `Alta`, `Media` o `Baja`, lanza un `Error` con el mensaje `Prioridad no válida en la orden <numero>: <prioridad>` y no devuelve nada.

**Ejemplos (entrada → salida)**

| # | Entrada | Salida |
|---|---|---|
| 1 | `[SF-0195 Baja 08:00, SF-0198 Media 09:00, SF-0201 Alta 10:30]` | `[SF-0201, SF-0198, SF-0195]` |
| 2 | `[SF-0210 Alta 11:00, SF-0207 Alta 09:15, SF-0209 Media 08:00]` | `[SF-0207, SF-0210, SF-0209]` |
| 3 | `[]` | `[]` |
| 4 | `[SF-0220 Media 10:00, SF-0221 Media 10:00]` | `[SF-0220, SF-0221]` |
| 5 | `[SF-0230 Urgentísima 09:00]` | Error: `Prioridad no válida en la orden SF-0230: Urgentísima` |

### Cómo ejecutar las pruebas

Se necesita Node.js 18 o superior. Desde la raíz del repositorio:

```bash
npm install
npm test
```

Las pruebas están en `tests/ordenarPendientes.test.js` y usan Jest.

### Estructura

```
.
├── README.md
├── bitacora_ia.md
├── package.json
├── src/ordenes/ordenarPendientes.js
└── tests/ordenarPendientes.test.js
```
