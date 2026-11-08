# Bitácora de uso de IA

Proyecto: Clasificador de solicitudes de reparación para Smartfix
Estudiante: Yeison Andrés Perdomo Losada
Funcionalidad: HU-03 Ver las órdenes pendientes ordenadas por prioridad y hora de llegada
Asistente usado: Claude (Anthropic), modo chat y agente

## Entradas

### Entrada 1

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:**

  > Actúa como un desarrollador que trabaja con pruebas primero (TDD). Mi proyecto final es el «Clasificador de solicitudes de reparación para Smartfix». Según mi documento de diseño de la semana 4, el backend es una API en Node.js + Express. Te adjunto el enunciado de la tarea de la semana 5 y el formato de contrato que usamos en clase (nombre y firma, qué recibe, qué devuelve, supuestos y casos límite, y ejemplos de entrada → salida).
  >
  > Necesito: 1) que me recomiendes una historia de usuario de prioridad Must de mi documento de requisitos que sea pequeña, de una sola función, con casos límite claros; 2) el contrato de esa función con ese formato y al menos 3 ejemplos; 3) al menos 5 pruebas automatizadas escritas antes del código: 2 casos normales, 2 de límite y 1 de error que salga del escenario de error del criterio de aceptación.
  >
  > Restricciones: usa el marco de pruebas que corresponda a Node.js, no agregues librerías que no hagan falta, no escribas todavía la implementación y explica por qué elegiste esa historia.

  El asistente sugirió la HU-03 (ver las órdenes pendientes ordenadas por prioridad y hora de llegada) y usar Jest para las pruebas.
- **Decisión:** Aceptada
- **Por qué:** La HU-03 es una sola función sin base de datos ni IA, con escenarios ya escritos en el documento de requisitos. Jest es el marco de pruebas natural para Node.js y la tarea permite usar el equivalente de pytest en otro lenguaje.
- **Verificación:** Instalé Jest 29 y comprobé que `npm test` ejecuta las 7 pruebas con un solo comando. En el primer commit fallaban las 7, como se esperaba.
- **Commit relacionado:** `c5e4df8` Pruebas de HU-03 ordenar órdenes pendientes (en rojo)

### Entrada 2

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** «Implementa `ordenarPendientes(ordenes)` según el contrato del README y haz pasar las pruebas de `tests/ordenarPendientes.test.js`». El asistente propuso devolver `ordenes.sort(...)` directamente.
- **Decisión:** Aceptada con cambios
- **Por qué:** `sort()` de JavaScript ordena la lista en el mismo lugar, así que cambiaba la lista original, y el contrato dice que la función devuelve una lista nueva sin modificar la que recibe. Lo cambié por `[...ordenes].sort(...)`, que primero copia la lista.
- **Verificación:** Con la primera versión falló la prueba «no modifica la lista original» (6 de 7 en verde). Después del cambio pasaron las 7.
- **Commit relacionado:** `62be368` Implementación de HU-03 con todas las pruebas en verde

### Entrada 3

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** El asistente validaba la prioridad con `if (!(o.prioridad in pesos))`.
- **Decisión:** Aceptada con cambios
- **Por qué:** El operador `in` también mira las propiedades heredadas del objeto. Con `in`, una orden con prioridad `"toString"` pasaba como válida, lo que va en contra del caso de error del contrato. Lo cambié por `Object.hasOwn(pesos, o.prioridad)`, que solo acepta `Alta`, `Media` y `Baja`.
- **Verificación:** Ejecuté `node -e "console.log('toString' in {Alta:0})"`, que imprimió `true`. Con `Object.hasOwn` la prueba de error sigue en verde y las 7 pasan.
- **Commit relacionado:** `62be368` Implementación de HU-03 con todas las pruebas en verde

### Entrada 4

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** Se propuso incluir también la prioridad «Sin clasificar» (la que deja la HU-02 cuando el servicio de IA no responde) dentro del orden de la lista.
- **Decisión:** Rechazada
- **Por qué:** El criterio de aceptación de la HU-03 solo habla de Alta, Media y Baja. Meter «Sin clasificar» obliga a decidir dónde va en la lista, y eso es una pregunta para el cliente, no algo que deba inventar la IA. Lo dejo para cuando se implemente la HU-02.
- **Verificación:** Revisé la HU-03 y la HU-02 en el documento de requisitos de la semana 3. Con el contrato actual, una prioridad distinta de las tres lanza error, y la prueba de error lo confirma.
- **Commit relacionado:** `62be368` Implementación de HU-03 con todas las pruebas en verde

### Entrada 5

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** Se propuso validar el formato de `horaLlegada` con una expresión regular (`/^\d{2}:\d{2}$/`) y lanzar error si no cumple.
- **Decisión:** Rechazada
- **Por qué:** En el contrato dejé como supuesto que las horas llegan con dos dígitos, porque las genera el sistema al guardar la orden y no las escribe la persona. Agregar esa validación cambiaría el comportamiento del contrato sin una prueba que lo pida.
- **Verificación:** Revisé la sección «Supuestos y casos límite» del README. Las pruebas usan horas `HH:MM` y la comparación como texto ordena bien («09:15» antes de «11:00»).
- **Commit relacionado:** `62be368` Implementación de HU-03 con todas las pruebas en verde

### Entrada 6

- **Fecha:** 2026-11-07
- **Prompt o sugerencia:** «Refactoriza `ordenarPendientes` sin cambiar su comportamiento y sin tocar las pruebas». El asistente sacó los pesos a la constante `PESO_PRIORIDAD` (congelada con `Object.freeze`) y separó la función en `validarPrioridades` y `compararOrdenes`.
- **Decisión:** Aceptada
- **Por qué:** Quita los números sueltos 0, 1 y 2 de dentro de la función (valor mágico) y deja la función principal en tres líneas que se leen como la historia: validar, copiar y ordenar.
- **Verificación:** Las 7 pruebas siguieron pasando y `git diff --stat tests/` no mostró cambios en el archivo de pruebas.
- **Commit relacionado:** `c8858f7` Refactor HU-03: constante PESO_PRIORIDAD fuera de la función y validación y comparación separadas

## Resumen

| Decisión | Cantidad |
|---|---|
| Aceptadas | 2 |
| Aceptadas con cambios | 2 |
| Rechazadas | 2 |

## Errores que atraparon las pruebas

La primera versión del asistente devolvía `ordenes.sort(...)`. Seis pruebas pasaron, pero falló «no modifica la lista original»: después de llamar la función, la lista original quedó como `['SF-0201', 'SF-0195']` en lugar de `['SF-0195', 'SF-0201']`. Pasa porque `sort()` reordena el mismo arreglo en lugar de crear uno nuevo. En la app eso sería un problema, porque la lista que la recepcionista ve en el orden de llegada cambiaría de orden sin que ella lo pida. Lo corregí copiando la lista con `[...ordenes]` antes de ordenar.

## Reflexión final

El asistente me ayudó más a pasar del contrato al código rápido y a proponer el refactor, que dejó la función más fácil de explicar. Lo más útil fue escribir las pruebas primero: la de «no modificar la lista original» atrapó el error de `sort()`, que a simple vista parecía correcto porque los casos normales pasaban. También aprendí que hay que leer cada línea, porque el `in` parecía bien y dejaba pasar una prioridad falsa. Las decisiones de qué entra en la función, como dejar «Sin clasificar» por fuera, salieron del criterio de aceptación y no de la IA. En la próxima funcionalidad escribiría desde el inicio una prueba con una prioridad «rara» y definiría con el cliente qué hacer con las órdenes sin clasificar antes de pedir código.
