# Registro de pruebas: tabla de casos y pruebas de la IA

Proyecto: Clasificador de solicitudes de reparación para Smartfix (HU-03, ordenar las órdenes pendientes)
Estudiante: Yeison Andrés Perdomo Losada
Fecha: 2026-11-22
Repositorio: https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE- (rama `semana7-pruebas`)

Mi proyecto está hecho en JavaScript, así que no usé pytest sino **Jest 29.7.0**, que es lo que se usa en JavaScript para lo mismo. Esta es la equivalencia:

| Lo que pide la tarea (pytest) | Lo que usé (Jest) |
|---|---|
| `@pytest.mark.parametrize` con un comentario por fila | `test.each([...])`, también con un comentario por fila |
| `pytest.raises` con el tipo de error | `expect(...).toThrow(TypeError)`, y además reviso el mensaje |
| `pytest.approx` para decimales | No lo necesité: en la HU-03 no hay decimales (en Jest sería `toBeCloseTo`) |
| Fixture de pytest | La función `crearOrdenesSinteticas()` de `tests/datos/ordenesSinteticas.js`, que llamo en un `beforeEach` |
| `pytest -v` | `npx jest --verbose` (o simplemente `npm test`) |

Las pruebas nuevas de esta semana están en `tests/reglasHU03.test.js`. Las de las semanas 5 y 6 siguen en `tests/ordenarPendientes.test.js` y no las toqué. En total pasan **56 pruebas**.

## 1. Tabla de casos

Le puse un código a cada caso (P de partición, L de límite, y R o D para las filas de las tablas de decisión). Ese mismo código aparece como comentario al lado de cada prueba, así es fácil ir de la tabla a la prueba.

### Regla: `validarOrden` revisa si una orden se puede meter en la cola

**Regla completa (el oráculo):** sale de la HU-03 y del contrato que escribí en el README. Cada orden tiene número, prioridad y hora de llegada. La prioridad **solo puede ser Alta, Media o Baja**, y la hora tiene que venir como **«HH:MM» de 24 horas**, o sea, de 00:00 a 23:59. Si algo de eso falla, la orden se rechaza con un mensaje que dice qué está mal:
- «Orden no válida en la posición N», si lo que llegó ni siquiera es una orden.
- «Prioridad no válida en la orden SF-xxxx: valor».
- «Hora de llegada no válida en la orden SF-xxxx: valor».

| Técnica | Partición o límite | Entrada | Esperado | Prueba que lo cubre |
|---|---|---|---|---|
| Partición válida | P1 prioridad Alta | Alta, 08:00 | La acepta (no lanza nada) | `acepta prioridad Alta con hora 08:00` |
| Partición válida | P2 prioridad Media | Media, 08:00 | La acepta | `acepta prioridad Media con hora 08:00` |
| Partición válida | P3 prioridad Baja | Baja, 08:00 | La acepta | `acepta prioridad Baja con hora 08:00` |
| Partición inválida | P4 llega `null` | `null`, posición 3 | TypeError «Orden no válida en la posición 3» | `lanza TypeError con la posición si la orden es null` |
| Partición inválida | P5 llega un texto | `'SF-0402'`, posición 0 | TypeError «…posición 0» | `…si la orden es "SF-0402"` |
| Partición inválida | P6 llega un número | `42`, posición 7 | TypeError «…posición 7» | `…si la orden es 42` |
| Partición inválida | P7 no llega nada | `undefined`, posición 1 | TypeError «…posición 1» | `…si la orden es undefined` |
| Partición inválida | P8 una prioridad que no existe | Urgentísima | Error «Prioridad no válida en la orden SF-0403: Urgentísima» | `lanza Error si la prioridad es "Urgentísima"` |
| Partición inválida | P9 en minúsculas | alta | Error de prioridad | `…si la prioridad es "alta"` |
| Partición inválida | P10 con un espacio adelante | « Alta» | Error de prioridad | `…si la prioridad es " Alta"` |
| Partición inválida | P11 vacía | «» | Error de prioridad | `…si la prioridad es ""` |
| Partición inválida | P12 sin prioridad | `undefined` | Error de prioridad | `…si la prioridad es undefined` |
| Partición inválida | P13 un nombre tramposo de JavaScript | toString | Error de prioridad | `…si la prioridad es "toString"` |
| Límite | L1 la primera hora del día | 00:00 | La acepta | `acepta prioridad Alta con hora 00:00` |
| Límite | L2 antes de 00:00 | No hay: en «HH:MM» no existen horas negativas | — | — |
| Límite | L3 el último minuto que sirve | 00:59 | La acepta | `…con hora 00:59` |
| Límite | L4 el primer minuto que no sirve | 00:60 | Error de hora | `lanza Error si la hora es "00:60"` |
| Límite | L5 la última hora que empieza por 1 | 19:59 | La acepta | `…con hora 19:59` |
| Límite | L6 la primera hora que empieza por 2 | 20:00 | La acepta | `…con hora 20:00` |
| Límite | L7 la última hora del día | 23:59 | La acepta | `…con hora 23:59` |
| Límite | L8 la primera hora que ya no existe | 24:00 | Error de hora | `lanza Error si la hora es "24:00"` y `rechaza toda la lista si una orden tiene la hora 24:00` |
| Límite | L9 minuto 60 en la última hora | 23:60 | Error de hora | `…si la hora es "23:60"` |
| Partición inválida | P14 la hora con un solo dígito | 9:00 | Error de hora | `…si la hora es "9:00"` |
| Partición inválida | P15 el minuto con un solo dígito | 09:5 | Error de hora | `…si la hora es "09:5"` |
| Partición inválida | P16 sin los dos puntos | 0900 | Error de hora | `…si la hora es "0900"` |
| Partición inválida | P17 vacía | «» | Error de hora | `…si la hora es ""` |
| Partición inválida | P18 un número en vez de texto | 900 | Error de hora | `…si la hora es 900` |

**Tabla de decisión.** Esta función revisa tres cosas: C1 ¿lo que llegó es una orden?, C2 ¿la prioridad sirve?, C3 ¿la hora sirve? El guion («-») quiere decir que esa condición no importa en esa fila.

| Regla | C1 | C2 | C3 | Resultado | Prueba |
|---|---|---|---|---|---|
| R1 | No | - | - | TypeError «Orden no válida en la posición 5» | `tabla de decisión R1 no - -` |
| R2 | Sí | No | - | Error de prioridad (aunque la hora también esté mal: 99:99) | `tabla de decisión R2 sí no -` |
| R3 | Sí | Sí | No | Error de hora | `tabla de decisión R3 sí sí no` |
| R4 | Sí | Sí | Sí | La acepta | `tabla de decisión R4 sí sí sí` |

Con tres condiciones de sí o no salen 8 combinaciones, pero las dejé en 4. Si lo que llegó no es una orden, no tiene sentido mirar la prioridad ni la hora. Y si la prioridad está mal, se avisa eso primero, sin importar la hora.

**Ambigüedades encontradas:**
- **¿«alta» o « Alta» cuentan como Alta?** La regla dice «Alta, Media o Baja» y no aclara nada de mayúsculas ni espacios. Decidí que no cuentan, porque la prioridad no la escribe una persona a mano: la pone el sistema (la HU-02 la sugiere y el técnico la elige de una lista). Igual queda como pregunta para el cliente.
- **Si la prioridad y la hora están mal al mismo tiempo, ¿qué error sale?** La regla no lo dice. Decidí que salga el primero, en el mismo orden del contrato: primero la prioridad y después la hora (fila R2).
- **¿Una lista vacía `[]` cuenta como orden?** En JavaScript una lista también es un «objeto», así que pasa la primera revisión y termina rechazada por la prioridad, con el mensaje raro «…en la orden undefined: undefined». La regla no dice nada. No le hice prueba, porque cualquier resultado que esperara lo iba a sacar de lo que hace el código y no de la regla. Queda como pregunta.
- **El número de la orden no se revisa:** puede llegar vacío o repetido y la regla no dice qué hacer. Lo dejo para cuando haga la HU de registrar órdenes.

### Regla: `compararOrdenes` decide cuál de dos órdenes se atiende primero

**Regla completa (el oráculo):** la HU-03 dice: «quiero ver las órdenes pendientes ordenadas **por prioridad y luego por hora de llegada** para atender primero lo urgente». Va primero la de más prioridad (Alta, después Media, después Baja). Si las dos tienen la misma prioridad, va primero la que llegó antes. Si tienen la misma prioridad y llegaron a la misma hora, ninguna va antes que la otra.

La regla solo dice **quién va primero**, no un número. Por eso lo que reviso es el signo del resultado: -1 si va primero `a`, 1 si va primero `b` y 0 si empatan.

**Tabla de decisión.** C1 compara la prioridad de `a` con la de `b`, y C2 compara sus horas de llegada.

| Regla | C1 | C2 | Esperado (signo) | Entradas de la prueba |
|---|---|---|---|---|
| D1 | `a` tiene más prioridad | - | -1 | Alta 10:00 frente a Media 08:00; Alta 10:00 frente a Baja 08:00 |
| D2 | `a` tiene menos prioridad | - | 1 | Media 07:00 frente a Alta 09:00; Baja 08:00 frente a Alta 10:00 |
| D3 | Igual | `a` llegó antes | -1 | Media 08:00 frente a Media 10:00 |
| D4 | Igual | `a` llegó después | 1 | Media 10:00 frente a Media 08:00 |
| D5 | Igual | Igual | 0 | Media 08:00 frente a Media 08:00 |

Salen 9 combinaciones (3 × 3), pero quedan en 5 porque, si la prioridad es distinta, la hora ya no importa. Para comprobar eso de verdad, en D1 y D2 puse a propósito que la orden con más prioridad sea la que llegó **después**: si el código mirara primero la hora, esas pruebas fallarían.

| Técnica | Límite | Entrada | Esperado | Prueba |
|---|---|---|---|---|
| Límite | Dos minutos seguidos justo cuando cambia la hora | Baja 09:59 frente a Baja 10:00 | -1 | `Baja 09:59 frente a Baja 10:00: signo -1` |
| Límite | La primera y la última hora del día | Alta 00:00 frente a Alta 23:59 | -1 | `Alta 00:00 frente a Alta 23:59: signo -1` |

**Ambigüedades encontradas:** el contrato supone que todas las horas son del mismo día. Una orden de las 23:59 y otra de las 00:00 **del día siguiente** quedarían al revés. La regla no habla de días, así que se lo voy a preguntar al cliente: ¿la cola empieza de cero cada día?

### Regla: `ordenarPendientes` arma la cola de atención (usa las dos reglas anteriores)

**Regla completa (el oráculo):** sale del contrato de la HU-03 en el README. Devuelve una lista **nueva** con las mismas órdenes, ordenadas como dice `compararOrdenes`. Si dos órdenes empatan en prioridad y en hora, quedan en el mismo orden en que venían. La lista original no se toca. Y si alguna orden no sirve (según `validarOrden`), se rechaza todo y no se devuelve nada.

| Técnica | Partición | Entrada | Esperado | Prueba |
|---|---|---|---|---|
| Partición válida | Varias órdenes de las tres prioridades, con un empate | Las 6 órdenes inventadas del fixture | SF-0304, SF-0302, SF-0303, SF-0305, SF-0301, SF-0306 (lo saqué a mano con la regla) | `ordena las seis órdenes del taller según la HU-03` |
| Partición válida | Órdenes con datos difíciles | Las 6 órdenes inventadas | Cada orden sale con sus datos iguales: tildes, ñ, apóstrofo, falla vacía y costo 0 | `no cambia los datos de cada orden…` |
| Partición inválida | Una orden con la hora mala dentro de una lista buena | El fixture con SF-0303 a las 24:00 | Error «Hora de llegada no válida en la orden SF-0303: 24:00» | `rechaza toda la lista si una orden tiene la hora 24:00` |
| Límite | Lista sin órdenes | `[]` | `[]` | Ya existía: `lista vacía devuelve una lista vacía (escenario 2 de HU-03)` |
| Límite | Lista con una sola orden | Una orden Baja | Esa misma orden | Ya existía: `una sola orden devuelve esa misma orden` |
| Partición inválida | No llega una lista | `null`, `{}`, un texto | TypeError | Ya existía (semana 6): `lanza TypeError si no recibe un arreglo` |
| Partición válida | La lista original no cambia | Dos órdenes | La lista original queda igual | Ya existía: `no modifica la lista original` |

**Ambigüedades encontradas:** ninguna nueva, fuera de las que ya anoté en las otras dos funciones.

## 2. Pruebas de la IA descartadas o corregidas

**Prompt usado:** «Eres un tester de JavaScript. Te doy tres reglas de la HU-03 y mi tabla de casos revisada (particiones, límites y tablas de decisión). Escribe las pruebas con Jest en `tests/reglasHU03.test.js`: usa `test.each` con un comentario por fila que diga qué partición o límite cubre, `toThrow` con el tipo de error exacto y el mensaje, y esperados fijos que salgan de la regla. Usa los datos de `tests/datos/ordenesSinteticas.js` en un `beforeEach`. No modifiques el código de `src/`.» (Entrada 12 de la bitácora.)

La IA me entregó un primer borrador con 33 pruebas, y todas pasaban. Pero que pasen no quiere decir que estén bien, así que las revisé una por una con las tres preguntas: ¿el esperado sale de la regla?, ¿fallaría si rompo el código?, ¿prueba algo que ninguna otra prueba revisa? Las que no aparecen en esta tabla las dejé como venían.

| Prueba generada | Decisión | Por qué | En su lugar |
|---|---|---|---|
| `compararOrdenes`: «Alta 10:00 contra Baja 08:00 da -2» y «Baja contra Alta da 2» (`toBe(-2)`, `toBe(2)`) | Corregida | **El esperado lo sacó del código, no de la regla.** La regla solo dice quién va primero, y ese -2 sale de restar los pesos que usa el código (0 − 2). Para estar seguro, cambié el código para que devolviera -1, que también cumple la regla, y 2 pruebas del borrador fallaron, mientras que las mías siguieron pasando | Ahora reviso solo el signo con `Math.sign(...)`: -1, 1 o 0. Hice lo mismo con las demás filas |
| `compararOrdenes`: «Alta 10:00 contra Media 08:00 da -1» y las de misma prioridad (-1, 1, 0) | Corregida | Pasaban, pero tenían el mismo problema que la del -2: pedían un número exacto que la regla no dice | Signo con `Math.sign`. También agregué Media 07:00 frente a Alta 09:00, para que D2 no tuviera solo el caso de Baja contra Alta |
| `compararOrdenes`: «una orden Alta va antes que una Baja» (`toBeLessThan(0)`) | Descartada | Repetida: es la misma fila «Alta frente a Baja» de la tabla de decisión | Nada, ya la cubre D1 |
| `validarOrden`: «devuelve algo al validar una orden correcta» (`not.toThrow()`) | Descartada | Repetida: las tres pruebas de prioridades válidas ya revisan eso. Además, el nombre no decía lo que de verdad probaba | Nada, ya la cubren P1, P2 y P3 |
| `validarOrden`: «lanza TypeError si la orden es…» (solo `toThrow(TypeError)`) | Corregida | Se quedaba corta: no revisaba el mensaje. Si el código pusiera mal la posición (por ejemplo, siempre «posición 0»), la prueba igual pasaba, y la posición es lo que le dice al técnico cuál orden está mala | Reviso el tipo **y** el mensaje, y uso posiciones distintas (3, 0, 7 y 1) |
| `ordenarPendientes`: «devuelve la misma cantidad de órdenes» (`toHaveLength(6)`) | Descartada | Se quedaba corta: pasa aunque el orden esté completamente mal | La prueba `no cambia los datos de cada orden…`, que revisa cada orden por su número y sus datos |
| `ordenarPendientes`: «lista vacía devuelve lista vacía» | Descartada | Repetida: esa prueba ya existe desde la semana 5 | Nada |
| `ordenarPendientes`: «lanza error si una orden del taller tiene la hora mal» (`toThrow(Error)`) | Corregida | Se quedaba corta: pasaba con cualquier error, incluso uno que no tuviera nada que ver con la hora | Reviso el mensaje exacto: «Hora de llegada no válida en la orden SF-0303: 24:00» |
| (las que faltaban) | Agregadas por mí | Al borrador le faltaban límites de mi tabla: 00:59 / 00:60 y 19:59 / 20:00, y en `compararOrdenes` los de 09:59 frente a 10:00 y 00:00 frente a 23:59. Tampoco tenía la tabla de decisión de `validarOrden` ni la prioridad « Alta» con un espacio | Las filas L3 a L6, la tabla R1 a R4, P10 y los dos límites de `compararOrdenes` |

**Decisión:** Conservada, Corregida o Descartada.

## 3. Romper el código a propósito

Metí cada error en `src/ordenes/ordenarPendientes.js`, uno a la vez. Después de cada uno corrí todas las pruebas y lo deshice con `git restore`. Lo hice dos veces: primero con las pruebas que tenía de la semana 6, antes de escribir las nuevas, y después con todas las pruebas de esta semana.

| Cambio introducido | Archivo y línea | ¿Falló alguna prueba? (semana 6) | ¿Falló alguna prueba? (semana 7) | Qué hice |
|---|---|---|---|---|
| M1 cambié `2[0-3]` por `2[0-4]`, así que acepta 24:00 | ordenarPendientes.js:14 | **No, ninguna** | Sí: `…si la hora es "24:00"` y `rechaza toda la lista si una orden tiene la hora 24:00` | Agregué el límite L8 (24:00) |
| M2 cambié `:[0-5]` por `:[0-6]`, así que acepta 23:60 | ordenarPendientes.js:14 | **No, ninguna** | Sí: `…si la hora es "00:60"` y `…"23:60"` | Agregué los límites L4 (00:60) y L9 (23:60) |
| M3 le cambié el peso a Media de 1 a 3, así que queda después de Baja | ordenarPendientes.js:11 | Sí: `ordena por prioridad: Alta, luego Media, luego Baja` | Sí: esa y `ordena las seis órdenes del taller…` | Nada, ese caso ya estaba protegido |
| M4 ordené la lista original en vez de una copia | ordenarPendientes.js:95 | Sí: `no modifica la lista original` | Sí: la misma | Nada |
| M5 usé `in` en vez de `Object.hasOwn` | ordenarPendientes.js:31 | Sí: las 4 pruebas de prioridades tramposas | Sí: esas 4 y P13 | Nada |
| M6 hice que `compararOrdenes` no mire si `a` llegó antes | ordenarPendientes.js:66 | Sí: 1 prueba | Sí: 5 pruebas | Nada |
| M7 cambié `<` por `<=` al comparar las horas | ordenarPendientes.js:66 | Sí: `misma prioridad y misma hora conservan el orden…` | Sí: esa, D5 y la del fixture | Nada |
| M8 quité la revisión de que llegue una lista | ordenarPendientes.js:90 | Sí: `lanza TypeError si no recibe un arreglo` | Sí: la misma | Nada |
| M9 quité la revisión de que cada orden sea un objeto | ordenarPendientes.js:27 | Sí: 1 prueba | Sí: 6 pruebas | Nada |

**Resultado:** con las pruebas de la semana 6, 2 de los 9 errores pasaban sin que nada fallara (M1 y M2), y justo eran los bordes de la hora, que nadie había probado. Con las pruebas de esta semana, los 9 errores hacen fallar al menos una prueba.

## 4. Datos de prueba

**Origen:** son datos inventados (sintéticos). Los generó la IA y yo los revisé a mano. Están en `tests/datos/ordenesSinteticas.js`. La función `crearOrdenesSinteticas()` entrega una lista nueva cada vez que se llama, y la llamo en un `beforeEach`, que en Jest hace lo mismo que un fixture de pytest. Así, si una prueba cambia una orden, no daña los datos de las otras. Confirmo que no hay datos de personas reales: los nombres son inventados, los teléfonos son de mentira (todos empiezan por 300 000 00) y no usé datos míos ni de mi familia.

**Contexto local:** son 6 órdenes del taller Smartfix en Neiva, con celulares que se ven mucho aquí (Xiaomi, Samsung, Motorola, iPhone, Huawei y Tecno), fallas normales de un taller y barrios de Neiva (Las Granjas, Cándido Leguízamo, Quebracho, Altico, Santa Inés e Ipanema).

**Casos difíciles incluidos:**
- Tildes y ñ: «Begoña Ñáñez Ortiz», «José Ángel Muñoz», «Íñigo Ríos Cañón» y «Güiza».
- Apóstrofo: «Andrés D'Alessandro Peña» y «Luz Dary O'Connor».
- Texto vacío: la falla de la orden SF-0303 está vacía.
- Valores en cero: el costo estimado de SF-0303 y de SF-0306 es 0.
- Horas en los bordes del día: 00:00 (SF-0303) y 23:59 (SF-0305).
- Un empate completo: SF-0301 y SF-0306 son Baja y llegaron las dos a las 07:45, para comprobar que quedan en el orden en que venían.
