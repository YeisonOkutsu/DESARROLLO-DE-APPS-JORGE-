# Registro de pruebas: tabla de casos y pruebas de la IA

Proyecto: Clasificador de solicitudes de reparación para Smartfix (HU-03, ordenar las órdenes pendientes)
Estudiante: Yeison Andrés Perdomo Losada
Fecha: 2026-11-22
Repositorio: https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE- (rama `semana7-pruebas`)

Mi proyecto está en JavaScript, así que en lugar de pytest uso **Jest 29.7.0**, con sus equivalentes:

| Lo que pide la tarea (pytest) | Lo que usé (Jest) |
|---|---|
| `@pytest.mark.parametrize` con un comentario por fila | `test.each([...])` con un comentario por fila |
| `pytest.raises` con el tipo de error | `expect(...).toThrow(TypeError)` y además el mensaje exacto |
| `pytest.approx` para decimales | No aplica: ninguna regla de la HU-03 usa decimales (`toBeCloseTo` sería el equivalente) |
| Fixture de pytest | Función `crearOrdenesSinteticas()` en `tests/datos/ordenesSinteticas.js`, que se llama en `beforeEach` |
| `pytest -v` | `npx jest --verbose` (o `npm test`) |

Las pruebas nuevas están en `tests/reglasHU03.test.js`. Las de las semanas 5 y 6 siguen en `tests/ordenarPendientes.test.js` y no las cambié. En total pasan **56 pruebas**.

## 1. Tabla de casos

Los códigos (P = partición, L = límite, R y D = filas de la tabla de decisión) son los mismos que van como comentario en cada fila del `test.each`.

### Regla 1: `validarOrden(orden, posicion)` decide si una orden se puede ordenar

**Regla completa (el oráculo):** sale del contrato de la HU-03 en el README. Cada orden tiene su número, su prioridad, que **solo puede ser Alta, Media o Baja**, y su hora de llegada en formato **«HH:MM» de 24 horas**, de 00:00 a 23:59 (supuesto del contrato, que en la semana 6 se volvió validación). Si algo de eso no se cumple, la orden se rechaza con un mensaje que dice qué está mal y en qué orden: «Orden no válida en la posición N», «Prioridad no válida en la orden SF-xxxx: valor» o «Hora de llegada no válida en la orden SF-xxxx: valor».

| Técnica | Partición o límite | Entrada | Esperado | Prueba que lo cubre |
|---|---|---|---|---|
| Partición válida | P1 prioridad Alta | Alta, 08:00 | Válida (no lanza nada) | `acepta prioridad Alta con hora 08:00` |
| Partición válida | P2 prioridad Media | Media, 08:00 | Válida | `acepta prioridad Media con hora 08:00` |
| Partición válida | P3 prioridad Baja | Baja, 08:00 | Válida | `acepta prioridad Baja con hora 08:00` |
| Partición inválida | P4 la orden es `null` | `null`, posición 3 | TypeError «Orden no válida en la posición 3» | `lanza TypeError con la posición si la orden es null` |
| Partición inválida | P5 la orden es un texto | `'SF-0402'`, posición 0 | TypeError «…posición 0» | `…si la orden es "SF-0402"` |
| Partición inválida | P6 la orden es un número | `42`, posición 7 | TypeError «…posición 7» | `…si la orden es 42` |
| Partición inválida | P7 no llegó nada | `undefined`, posición 1 | TypeError «…posición 1» | `…si la orden es undefined` |
| Partición inválida | P8 prioridad que no existe | Urgentísima | Error «Prioridad no válida en la orden SF-0403: Urgentísima» | `lanza Error si la prioridad es "Urgentísima"` |
| Partición inválida | P9 minúsculas | alta | Error de prioridad | `…si la prioridad es "alta"` |
| Partición inválida | P10 espacio adelante | « Alta» | Error de prioridad | `…si la prioridad es " Alta"` |
| Partición inválida | P11 texto vacío | «» | Error de prioridad | `…si la prioridad es ""` |
| Partición inválida | P12 sin prioridad | `undefined` | Error de prioridad | `…si la prioridad es undefined` |
| Partición inválida | P13 nombre heredado de Object | toString | Error de prioridad | `…si la prioridad es "toString"` |
| Límite | L1 primera hora del día | 00:00 | Válida | `acepta prioridad Alta con hora 00:00` |
| Límite | L2 último minuto inválido por debajo | No existe: no hay horas negativas en «HH:MM» | — | — |
| Límite | L3 último minuto válido | 00:59 | Válida | `…con hora 00:59` |
| Límite | L4 primer minuto inválido | 00:60 | Error de hora | `lanza Error si la hora es "00:60"` |
| Límite | L5 última hora que empieza por 1 | 19:59 | Válida | `…con hora 19:59` |
| Límite | L6 primera hora que empieza por 2 | 20:00 | Válida | `…con hora 20:00` |
| Límite | L7 última hora válida | 23:59 | Válida | `…con hora 23:59` |
| Límite | L8 primera hora inválida | 24:00 | Error de hora | `lanza Error si la hora es "24:00"` y `rechaza toda la lista si una orden tiene la hora 24:00` |
| Límite | L9 minuto 60 en la última hora | 23:60 | Error de hora | `…si la hora es "23:60"` |
| Partición inválida | P14 hora de un dígito | 9:00 | Error de hora | `…si la hora es "9:00"` |
| Partición inválida | P15 minuto de un dígito | 09:5 | Error de hora | `…si la hora es "09:5"` |
| Partición inválida | P16 sin dos puntos | 0900 | Error de hora | `…si la hora es "0900"` |
| Partición inválida | P17 texto vacío | «» | Error de hora | `…si la hora es ""` |
| Partición inválida | P18 número en vez de texto | 900 | Error de hora | `…si la hora es 900` |

**Tabla de decisión** (C1 ¿es un objeto?, C2 ¿la prioridad es válida?, C3 ¿la hora es válida?; «-» = no importa):

| Regla | C1 | C2 | C3 | Resultado | Prueba |
|---|---|---|---|---|---|
| R1 | No | - | - | TypeError «Orden no válida en la posición 5» | `tabla de decisión R1 no - -` |
| R2 | Sí | No | - | Error de prioridad (aunque la hora también esté mal: 99:99) | `tabla de decisión R2 sí no -` |
| R3 | Sí | Sí | No | Error de hora | `tabla de decisión R3 sí sí no` |
| R4 | Sí | Sí | Sí | Válida | `tabla de decisión R4 sí sí sí` |

Son 8 combinaciones posibles (2 × 2 × 2). Se simplifican a 4 porque, si la orden no es un objeto, no tiene sentido mirar su prioridad ni su hora, y si la prioridad está mal, se avisa eso primero.

**Ambigüedades encontradas:**
- **¿«alta» o « Alta» cuentan como Alta?** La regla dice «Alta, Media o Baja», sin decir nada de mayúsculas ni espacios. Decidí que **no**, porque la prioridad no la escribe una persona: la pone el sistema (la HU-02 la sugiere y el técnico la elige de una lista). Queda como pregunta para el cliente.
- **Si la prioridad y la hora están mal al mismo tiempo, ¿qué error se muestra?** La regla no lo dice. Decidí avisar el primero en el orden del contrato (prioridad y después hora), que es lo que dice la tabla de decisión en R2.
- **¿Un arreglo `[]` cuenta como orden?** En JavaScript un arreglo también es un objeto, así que pasa C1 y se rechaza por la prioridad, con el mensaje «…en la orden undefined: undefined». La regla no lo dice. No le hice prueba porque cualquier esperado que pusiera saldría del código, no de la regla. Lo dejé como pregunta.
- **El número de la orden no se valida** (puede venir vacío o repetido). La regla no dice nada. Lo dejé como pregunta para cuando se haga la HU de registrar órdenes.

### Regla 2: `compararOrdenes(a, b)` decide cuál de dos órdenes se atiende primero

**Regla completa (el oráculo):** HU-03, «ver las órdenes pendientes ordenadas **por prioridad y luego por hora de llegada** para atender primero lo urgente». Va primero la de mayor prioridad (Alta, luego Media, luego Baja). Si las dos tienen la misma prioridad, va primero la que llegó antes. Si tienen la misma prioridad y la misma hora, ninguna va antes que la otra. La regla solo dice **quién va primero**, así que el esperado es el signo: -1 si va primero `a`, 1 si va primero `b` y 0 si empatan.

**Tabla de decisión** (C1 prioridad de `a` frente a la de `b`, C2 hora de `a` frente a la de `b`):

| Regla | C1 | C2 | Esperado (signo) | Entradas de la prueba |
|---|---|---|---|---|
| D1 | `a` tiene mayor prioridad | - | -1 | Alta 10:00 frente a Media 08:00; Alta 10:00 frente a Baja 08:00 |
| D2 | `a` tiene menor prioridad | - | 1 | Media 07:00 frente a Alta 09:00; Baja 08:00 frente a Alta 10:00 |
| D3 | Igual | `a` llegó antes | -1 | Media 08:00 frente a Media 10:00 |
| D4 | Igual | `a` llegó después | 1 | Media 10:00 frente a Media 08:00 |
| D5 | Igual | Igual | 0 | Media 08:00 frente a Media 08:00 |

Son 9 combinaciones (3 × 3). Se simplifican a 5 porque, cuando la prioridad es distinta, la hora no importa. Para que eso quede probado de verdad, en D1 y D2 puse a propósito la hora al revés: la orden con más prioridad es la que llegó **después**.

| Técnica | Límite | Entrada | Esperado | Prueba |
|---|---|---|---|---|
| Límite | Minutos seguidos cuando cambia la hora | Baja 09:59 frente a Baja 10:00 | -1 | `Baja 09:59 frente a Baja 10:00: signo -1` |
| Límite | Primera y última hora del día | Alta 00:00 frente a Alta 23:59 | -1 | `Alta 00:00 frente a Alta 23:59: signo -1` |

**Ambigüedades encontradas:** el contrato supone que todas las horas son del mismo día. Una orden de las 23:59 y otra de las 00:00 **del día siguiente** quedarían al revés. La regla no habla de días, así que lo dejé como pregunta para el cliente: ¿la cola se reinicia cada día?

### Regla 3: `ordenarPendientes(ordenes)` arma la cola de atención (combina las reglas 1 y 2)

**Regla completa (el oráculo):** contrato de la HU-03 en el README. Devuelve una lista **nueva** con las mismas órdenes, ordenadas con la regla 2. Si dos órdenes empatan en prioridad y hora, conservan el orden en que estaban en la lista. La lista original no se cambia. Si alguna orden no es válida (regla 1), se rechaza toda la operación y no se devuelve nada.

| Técnica | Partición | Entrada | Esperado | Prueba |
|---|---|---|---|---|
| Partición válida | Varias órdenes de las tres prioridades, con empate | Las 6 órdenes sintéticas del fixture | SF-0304, SF-0302, SF-0303, SF-0305, SF-0301, SF-0306 (calculado a mano con la regla) | `ordena las seis órdenes del taller según la HU-03` |
| Partición válida | Órdenes con datos extra difíciles | Las 6 órdenes sintéticas | Cada orden sale con sus datos iguales, incluidos tildes, ñ, apóstrofo, falla vacía y costo 0 | `no cambia los datos de cada orden…` |
| Partición inválida | Una orden con la hora mal dentro de una lista buena | Fixture con SF-0303 a las 24:00 | Error «Hora de llegada no válida en la orden SF-0303: 24:00» | `rechaza toda la lista si una orden tiene la hora 24:00` |
| Límite | Lista de 0 órdenes | `[]` | `[]` | Ya estaba: `lista vacía devuelve una lista vacía (escenario 2 de HU-03)` |
| Límite | Lista de 1 orden | Una orden Baja | Esa misma orden | Ya estaba: `una sola orden devuelve esa misma orden` |
| Partición inválida | No es una lista | `null`, `{}`, texto | TypeError | Ya estaba (semana 6): `lanza TypeError si no recibe un arreglo` |
| Partición válida | No cambia la lista original | Dos órdenes | La lista original queda igual | Ya estaba: `no modifica la lista original` |

**Ambigüedades encontradas:** ninguna nueva, aparte de las de las reglas 1 y 2.

## 2. Pruebas de la IA descartadas o corregidas

**Prompt usado:** «Eres un tester de JavaScript. Te doy tres reglas de la HU-03 y mi tabla de casos revisada (particiones, límites y tablas de decisión). Escribe las pruebas con Jest en `tests/reglasHU03.test.js`: usa `test.each` con un comentario por fila que diga qué partición o límite cubre, `toThrow` con el tipo de error exacto y el mensaje, y esperados fijos que salgan de la regla. Usa los datos de `tests/datos/ordenesSinteticas.js` en un `beforeEach`. No modifiques el código de `src/`.» (Entrada 12 de la bitácora.)

El primer borrador de la IA tenía 33 pruebas y todas pasaban. Las revisé una por una con las tres preguntas: (1) ¿el esperado sale de la regla?, (2) ¿fallaría si rompo el código?, (3) ¿cubre algo que otra prueba no cubre? Las que no cambié las conservé tal cual.

| Prueba generada | Decisión | Por qué | En su lugar |
|---|---|---|---|
| `compararOrdenes`: «Alta 10:00 contra Baja 08:00 da -2» y «Baja contra Alta da 2» (`toBe(-2)`, `toBe(2)`) | Corregida | **El esperado salió del código, no de la regla.** La regla solo dice quién va primero; el -2 es la resta de los pesos (0 - 2). Lo comprobé: cambié el código para que devolviera -1 (sigue cumpliendo la regla) y fallaron 2 pruebas del borrador, mientras que la versión revisada siguió pasando | Comparo el signo: `Math.sign(...)` debe ser -1, 1 o 0. Lo mismo en las demás filas de la tabla |
| `compararOrdenes`: «una orden Alta va antes que una Baja» (`toBeLessThan(0)`) | Descartada | Redundante: es la misma fila «Alta frente a Baja» de la tabla de decisión | Nada; la cubre D1 |
| `validarOrden`: «devuelve algo al validar una orden correcta» (`not.toThrow()`) | Descartada | Redundante: las 3 particiones válidas ya comprueban con `toBeUndefined()`. Además, el nombre no decía lo que de verdad probaba | Nada; la cubren P1 a P3 |
| `validarOrden`: «lanza TypeError si la orden es…» (solo `toThrow(TypeError)`) | Corregida | Débil: no revisaba el mensaje. Si el código pusiera mal la posición («posición 0» siempre), la prueba igual pasaba, y la posición es lo que le dice al técnico cuál orden está mala | Reviso el tipo **y** el mensaje con la posición, y uso posiciones distintas (3, 0, 7, 1) |
| `ordenarPendientes`: «devuelve la misma cantidad de órdenes» (`toHaveLength(6)`) | Descartada | Débil: pasa aunque el orden esté completamente mal | `no cambia los datos de cada orden…`, que revisa cada orden por su número y sus datos |
| `ordenarPendientes`: «lista vacía devuelve lista vacía» | Descartada | Redundante: ya existe desde la semana 5 en `ordenarPendientes.test.js` | Nada |
| `ordenarPendientes`: «lanza error si una orden del taller tiene la hora mal» (`toThrow(Error)`) | Corregida | Débil: cualquier error la hace pasar, incluso un `TypeError` por otro motivo | Reviso el mensaje exacto «Hora de llegada no válida en la orden SF-0303: 24:00» |
| `compararOrdenes`: «Alta 10:00 contra Media 08:00 da -1» y las filas de empate en prioridad (-1, 1, 0) | Corregida | Pasaban, pero con el mismo problema que la de -2: piden un número exacto que la regla no define | Signo con `Math.sign`. Agregué además Media 07:00 frente a Alta 09:00, para que D2 también tenga un caso con prioridades vecinas y no solo con Baja frente a Alta |
| (faltaban) | Agregadas por mí | La IA no puso los límites de la tabla: 00:59 / 00:60, 19:59 / 20:00, ni los de `compararOrdenes` (09:59 frente a 10:00, 00:00 frente a 23:59). Tampoco hizo la tabla de decisión de `validarOrden` ni la prioridad « Alta» con espacio | Filas L3 a L6, la tabla R1 a R4, P10 y los dos límites de la regla 2 |

**Decisión:** Conservada, Corregida o Descartada.

## 3. Romper el código a propósito

Metí cada error en `src/ordenes/ordenarPendientes.js`, uno a la vez, corrí todas las pruebas y lo deshice con `git restore`. Lo hice dos veces: primero con las pruebas de la semana 6 (antes de escribir las nuevas) y después con la suite completa.

| Cambio introducido | Archivo y línea | ¿Alguna prueba falló? (semana 6) | ¿Alguna prueba falló? (semana 7) | Qué hice |
|---|---|---|---|---|
| M1 `2[0-3]` por `2[0-4]`: acepta 24:00 | ordenarPendientes.js:14 | **No, ninguna** | Sí: `…si la hora es "24:00"` y `rechaza toda la lista si una orden tiene la hora 24:00` | Agregué el límite L8 (24:00) |
| M2 `:[0-5]` por `:[0-6]`: acepta 23:60 | ordenarPendientes.js:14 | **No, ninguna** | Sí: `…si la hora es "00:60"` y `…"23:60"` | Agregué los límites L4 (00:60) y L9 (23:60) |
| M3 peso de Media de 1 a 3: Media queda después de Baja | ordenarPendientes.js:11 | Sí: `ordena por prioridad: Alta, luego Media, luego Baja` | Sí: esa y `ordena las seis órdenes del taller…` | Nada: el borde ya estaba protegido |
| M4 ordenar la lista original sin copiarla | ordenarPendientes.js:95 | Sí: `no modifica la lista original` | Sí: la misma | Nada |
| M5 `in` en lugar de `Object.hasOwn` | ordenarPendientes.js:31 | Sí: las 4 pruebas de prioridades heredadas | Sí: esas 4 y P13 | Nada |
| M6 `compararOrdenes` deja de mirar si `a` llegó antes | ordenarPendientes.js:66 | Sí: 1 prueba | Sí: 5 pruebas | Nada |
| M7 `<` por `<=` en la comparación de horas | ordenarPendientes.js:66 | Sí: `misma prioridad y misma hora conservan el orden…` | Sí: esa, D5 y la del fixture | Nada |
| M8 no revisar si llega una lista | ordenarPendientes.js:90 | Sí: `lanza TypeError si no recibe un arreglo` | Sí: la misma | Nada |
| M9 no revisar si la orden es un objeto | ordenarPendientes.js:27 | Sí: 1 prueba | Sí: 6 pruebas | Nada |

**Resultado:** con las pruebas de la semana 6, 2 de los 9 errores pasaban sin que nada fallara (M1 y M2), y justo eran los bordes de la hora. Con la suite de la semana 7 los 9 errores hacen fallar al menos una prueba.

## 4. Datos de prueba

**Origen:** datos sintéticos generados con IA y revisados a mano, en `tests/datos/ordenesSinteticas.js`. La función `crearOrdenesSinteticas()` devuelve una lista nueva cada vez y se llama en un `beforeEach`, que en Jest cumple el papel del fixture de pytest. Así ninguna prueba daña los datos de otra. Confirmo que no hay datos de personas reales: los nombres son inventados, los teléfonos son ficticios (todos con el prefijo de prueba 300 000 00xx) y no usé datos míos ni de mi familia.

**Contexto local:** 6 órdenes del taller Smartfix en Neiva, con equipos comunes aquí (Xiaomi, Samsung, Motorola, iPhone, Huawei, Tecno), fallas reales de taller y barrios de Neiva (Las Granjas, Cándido Leguízamo, Quebracho, Altico, Santa Inés, Ipanema).

**Casos difíciles incluidos:**
- Tildes y ñ: «Begoña Ñáñez Ortiz», «José Ángel Muñoz», «Íñigo Ríos Cañón», «Güiza».
- Apóstrofo: «Andrés D'Alessandro Peña», «Luz Dary O'Connor».
- Texto vacío: la falla de SF-0303 es «».
- Valor en cero: costo estimado 0 en SF-0303 y SF-0306.
- Horas en los bordes del día: 00:00 (SF-0303) y 23:59 (SF-0305).
- Empate total: SF-0301 y SF-0306 son Baja y llegaron a las 07:45, para probar que se conserva el orden de la lista.
