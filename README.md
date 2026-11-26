# Clasificador de solicitudes de reparación para Smartfix

Proyecto final del Seminario de Inteligencia Artificial Aplicada al Ciclo de Vida del Software (FET).

Estudiante: Yeison Andrés Perdomo Losada

## 1. Qué es

El sistema registra las solicitudes de reparación de un taller de celulares, sugiere el tipo de falla y la prioridad con IA y ordena la cola de atención de los técnicos. Según el documento de diseño de la semana 4, el backend es una API en Node.js + Express; esta funcionalidad es la primera pieza de esa API.

### Funcionalidad de la semana 5

#### Historia de usuario

**HU-03 (Must).** Como técnico, quiero ver las órdenes pendientes ordenadas por prioridad y luego por hora de llegada para atender primero lo urgente.

**Criterio de aceptación**

- **Escenario 1: orden de la lista.** Dado que hay tres órdenes pendientes: SF-0201 con prioridad Alta (llegó 10:30), SF-0198 con Media (09:00) y SF-0195 con Baja (08:00), cuando abro la lista, entonces las veo en este orden: SF-0201, SF-0198 y SF-0195.
- **Escenario 2: sin pendientes.** Dado que no hay órdenes pendientes, cuando abro la lista, entonces veo el mensaje «No hay órdenes pendientes». (La función devuelve una lista vacía y la pantalla muestra el mensaje.)
- **Escenario de error: prioridad no válida.** Dado que una orden llega con una prioridad que no existe, por ejemplo «Urgentísima», cuando se ordena la lista, entonces el sistema rechaza la operación con el mensaje «Prioridad no válida en la orden SF-xxxx: Urgentísima».

#### Contrato de la función

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
| 6 | `[SF-0250 Alta 9:00]` | Error: `Hora de llegada no válida en la orden SF-0250: 9:00` |
| 7 | `null` | TypeError: `La lista de órdenes debe ser un arreglo` |

**Cambios de la semana 6 (revisión de seguridad).** Antes nadie revisaba que las horas llegaran como `HH:MM`, y una hora como `9:00` quedaba después de `10:00` sin ningún aviso. Ahora la función revisa los datos y lanza un error claro si no recibe una lista, si alguna orden no es un objeto o si la hora no tiene el formato `HH:MM` de 24 horas. Los detalles están en [revision_seguridad.md](revision_seguridad.md).

## 2. Requisitos

- Node.js 18.18 o más nuevo (yo lo probé con Node.js 24) y npm, que viene con Node.
- Git, para descargar el repositorio.
- Por ahora no necesita base de datos ni claves. Las variables que va a usar la API están en `.env.example`.

## 3. Instalación

```bash
git clone -b semana7-pruebas https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-.git clasificador-smartfix
cd clasificador-smartfix
npm ci
```

`npm ci` instala las mismas versiones que están en `package-lock.json`, así a todos les queda igual. Cuando el proyecto use variables de entorno, copia `.env.example` con el nombre `.env` y llena los valores. El `.env` no se sube a Git.

## 4. Ejecución

### Demo local (semana 8)

```bash
npm ci
npm start
```

Después abre http://localhost:3000 en el navegador. La página muestra la cola de los técnicos con las órdenes del escenario 1 y tiene un formulario para agregar órdenes. Las órdenes nuevas se ubican en su lugar según la prioridad y la hora. Si eliges la prioridad «Urgentísima» o escribes una hora como «9:00», la API responde 400 y el error se ve en rojo. Las órdenes viven en memoria: al detener el servidor (Ctrl + C) se pierden. Para usar otro puerto: `PORT=4000 npm start` (en PowerShell: `$env:PORT=4000; npm start`).

La API tiene dos rutas:

- `GET /api/ordenes/pendientes`: devuelve la cola ordenada con `ordenarPendientes`.
- `POST /api/ordenes`: recibe `{ numero, prioridad, horaLlegada }`, lo valida con `validarOrden` y responde 201, o 400 con `{ error }`.

### Ejemplo por consola

Para ver la función sola, con las órdenes del escenario 1:

```bash
npm run ejemplo
```

Salida esperada:

```
Cola de atención de los técnicos:
1. SF-0201  Alta  10:30
2. SF-0198  Media  09:00
3. SF-0195  Baja  08:00
```

## 5. Pruebas

```bash
npm test
npm run lint
```

- `npm test` corre las 63 pruebas. En `tests/api.test.js` están las 7 de la API de la demo (semana 8), hechas con supertest. En `tests/ordenarPendientes.test.js` están las de las semanas 5 y 6: los casos normales, los casos límite y los de error de la HU-03, más las pruebas de abuso (datos mal formados y prioridades tramposas como `__proto__` o `toString`). En `tests/reglasHU03.test.js` están las de la semana 7, diseñadas con particiones de equivalencia, valores límite y tablas de decisión; usan los datos sintéticos de `tests/datos/ordenesSinteticas.js`. El diseño de cada caso está en [registro_pruebas.md](registro_pruebas.md).
- `npx jest --verbose` muestra el nombre de cada prueba (es el equivalente de `pytest -v`).
- `npm run lint` revisa el código con ESLint, incluyendo reglas de seguridad. La configuración está en `eslint.config.js` y debe terminar sin avisos.
- `npm audit` busca fallas conocidas en las librerías que usa el proyecto. Lo que salió está explicado en los pendientes del informe.

### Pipeline (semana 8)

El archivo `.github/workflows/ci.yml` hace que GitHub Actions, en cada push y en cada pull request, instale las dependencias con `npm ci`, corra `npm run lint` y corra `npm test` en Node.js 20. Si algo falla, la ejecución sale en rojo. Las ejecuciones se ven en la pestaña **Actions** del repositorio: https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/actions/workflows/ci.yml

## 6. Estructura

```
.
├── README.md                 Este archivo
├── bitacora_ia.md            Bitácora de uso de IA
├── revision_seguridad.md     Informe de revisión de código y seguridad (semana 6)
├── registro_pruebas.md       Tabla de casos y revisión de las pruebas de la IA (semana 7)
├── .env.example              Variables de entorno sin valores
├── .gitignore
├── LICENSE
├── eslint.config.js          Configuración del linter
├── package.json
├── package-lock.json
├── public/
│   ├── index.html            Página de la demo local
│   └── app.js                Pide la cola a la API y la pinta (solo textContent)
├── src/
│   ├── app.js                API de Express: rutas de la cola y del registro de órdenes
│   ├── servidor.js           Arranca la demo con npm start
│   ├── ejemplo.js            Ejemplo que se ejecuta con npm run ejemplo
│   └── ordenes/
│       └── ordenarPendientes.js
└── tests/
    ├── ordenarPendientes.test.js   Pruebas de las semanas 5 y 6
    ├── reglasHU03.test.js          Pruebas de las reglas (semana 7)
    ├── api.test.js                 Pruebas de la API de la demo (semana 8)
    └── datos/
        └── ordenesSinteticas.js    Datos sintéticos del taller (sin personas reales)
```

## 7. Uso de IA

Usé Claude (Anthropic), en modo chat y en modo agente. En la semana 5 me ayudó a proponer las pruebas, implementar la HU-03 y mejorar el código. En la semana 6 lo usé para una segunda revisión de seguridad y para las correcciones. En la semana 7 me ayudó a proponer casos de prueba, a escribir un borrador de las pruebas y a generar datos sintéticos; revisé cada prueba contra la regla y las que corregí o descarté están en [registro_pruebas.md](registro_pruebas.md). El agente trabajó en una rama aparte (`semana6-revision`), con un commit por cada corrección, y revisé los cambios antes de subirlos. Todo lo que sugirió lo comprobé con las pruebas y el linter. En [bitacora_ia.md](bitacora_ia.md) está qué acepté, qué cambié y qué rechacé, y en [revision_seguridad.md](revision_seguridad.md) está cuáles hallazgos de la IA eran reales y cuáles no.

## 8. Autor y licencia

- Autor: Yeison Andrés Perdomo Losada, Fundación Escuela Tecnológica de Neiva (FET).
- Licencia: MIT. Ver [LICENSE](LICENSE).

## Anexo: notas de la semana 5

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
