# Informe de revisión de código y seguridad

Proyecto: Clasificador de solicitudes de reparación para Smartfix (HU-03, ordenar las órdenes pendientes)
Estudiante: Yeison Andrés Perdomo Losada
Fecha: 2026-11-14
Repositorio: https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE- (rama `semana6-revision`)
Commit revisado: `4332b47`, que es el código de la semana 5 (rama `semana5-hu03`). Las correcciones están en la rama `semana6-revision`.

## 1. Herramientas y criterios

- **Linter:** mi proyecto está en JavaScript, así que en vez de ruff usé ESLint 9.39.1. Le activé tres grupos de reglas: las recomendadas (errores y errores probables), las de seguridad de `eslint-plugin-security` 3.0.1 y algunas de estilo (por ejemplo, usar `===` y no pasar de 100 caracteres por línea). La configuración está en `eslint.config.js` y se corre con `npm run lint`. Al final quedó sin avisos.
- **Revisión de dependencias:** usé `npm audit`, que en JavaScript cumple el papel de pip-audit. Salen 6 avisos de severidad baja, todos de una librería que usa Jest por dentro. Lo explico en los pendientes.
- **Pruebas:** Jest 29.7.0. Antes tenía 7 pruebas y ahora tengo 14, todas pasan. No cambié ninguna de las pruebas que ya existían.
- **Lista de revisión:** la de la semana 6 (que el código funcione y tenga pruebas, que se entienda y que sea seguro).
- **Revisión con IA:** le pedí a Claude una segunda revisión con el prompt de la semana (está en la sección 3).

### Puntos de seguridad revisados

| Punto | ¿Aplica? | Resultado |
|---|---|---|
| Inyección (consultas con parámetros) | Por ahora no, porque la HU-03 no usa base de datos. Lo que sí revisé fue qué pasa si llegan datos mal formados, porque esta función va a recibir datos de la API. | No hay consultas. Encontré datos sin validar: H-01, H-02 y H-03 |
| Secretos (código, historial, .gitignore, .env.example) | Sí | No hay claves en el código ni en el historial (lo busqué con `git log -p --all`). El `.env` ya estaba en `.gitignore`, pero faltaba el `.env.example`: H-06 |
| Contraseñas (scrypt, bcrypt o argon2 con sal) | Todavía no, porque el proyecto aún no guarda usuarios ni contraseñas. | Queda pendiente para cuando haga el inicio de sesión (P-02) |
| Control de acceso (rol verificado y prueba de abuso) | Todavía no, porque es una función suelta, sin usuarios. | Queda pendiente para la API (P-02). Sí agregué una prueba de abuso con datos tramposos: H-04 |
| Dependencias (existen, necesarias, versión fijada, npm audit) | Sí | Jest no tenía la versión fija (`^29.7.0`): H-05. Todas las dependencias existen y solo se usan para desarrollar. Lo de `npm audit` está en P-01 |

## 2. Tabla de hallazgos

Los números de línea son los del commit revisado, `4332b47`.

| Id | Archivo y línea | Problema | Categoría (OWASP o tipo) | Severidad | Corrección | Commit |
|---|---|---|---|---|---|---|
| H-01 | src/ordenes/ordenarPendientes.js:23-24 | Si en lugar de una lista llega otra cosa, el error no se entiende (`ordenes is not iterable`). Con un texto sale «Prioridad no válida en la orden undefined: undefined» | A04 Diseño inseguro (validar la entrada) | Media | Si no llega una lista, la función avisa con un error claro. Agregué una prueba | `0b22dfb` |
| H-02 | src/ordenes/ordenarPendientes.js:8 | Si una orden viene vacía (`null`), la función se cae con un error confuso | A04 Diseño inseguro (validar la entrada) | Media | Ahora avisa en qué posición está la orden mala. Agregué una prueba | `9318bc2` |
| H-03 | src/ordenes/ordenarPendientes.js:20 | La hora no se revisaba. Si llegaba «9:00» en vez de «09:00», la orden quedaba después de una de las «10:00» y nadie se daba cuenta | Error de lógica / A04 | Media | Ahora la hora tiene que venir como `HH:MM` (de 00:00 a 23:59), si no, sale un error. Agregué una prueba | `851527c` |
| H-04 | src/ordenes/ordenarPendientes.js:8 | La protección contra prioridades tramposas como «toString» o «\_\_proto\_\_» (que hice en la semana 5) no tenía ninguna prueba | Falta prueba de abuso | Baja | Agregué una prueba que intenta con 4 de esos nombres | `639fe6c` |
| H-05 | package.json:12 | Jest tenía `^29.7.0`, o sea que podía instalarse otra versión sin que yo lo supiera | A06 Componentes vulnerables (versión sin fijar) | Baja | Dejé la versión exacta `29.7.0`, y lo mismo con las de ESLint | `6252eba` |
| H-06 | raíz del repositorio | No había `.env.example` | A05 Configuración (secretos) | Baja | Agregué `.env.example` con los nombres de las variables, sin valores. **Corrección del 25-11-2026:** en `bba2fd5` el archivo no quedó en Git porque la regla `.env.*` del `.gitignore` lo tapaba; se subió en `7088dac` | `bba2fd5`, `7088dac` |
| H-07 | src/ordenes/ordenarPendientes.js:6 | El nombre `validarPrioridades` ya no decía todo lo que revisa, y las funciones no tenían docstrings | Legibilidad (nombres) | Baja | La cambié por `validarOrdenes` y `validarOrden`, y les puse JSDoc a las 4 funciones | `c083c83` |
| H-08 | (todo el proyecto) | No había ningún linter configurado | Herramientas | Baja | Configuré ESLint con reglas de seguridad y el comando `npm run lint` | `588888d` |

**Severidad:** alta (deja ver o cambiar datos sin permiso, o deja ver secretos), media (un error que puede pasar o un riesgo que depende de algo más), baja (estilo o qué tan fácil es mantener el código).

### Avisos del linter no corregidos

| Regla | Archivo y línea | Por qué se mantiene |
|---|---|---|
| Ninguna | — | `npm run lint` termina sin avisos. |

## 3. Revisión con IA

**Prompt usado:** «Actúa como revisor de código JavaScript con experiencia en seguridad. Módulo `ordenarPendientes` del proyecto Smartfix (HU-03, futura API Node.js + Express). Revisa corrección, legibilidad y seguridad: inyección, secretos, contraseñas, control de acceso y dependencias. Tabla: línea | problema | severidad (alta, media, baja) | corrección sugerida. No reescribas todo el código. Separa los problemas seguros de las sospechas que habría que verificar.» (Entrada 7 de la bitácora.)

| Hallazgo de la IA | ¿Real o falso positivo? | Cómo lo verifiqué |
|---|---|---|
| Si `ordenes` no es una lista, el error es confuso | Real (H-01) | Llamé la función con `null`, `{}` y `'abc'` y salieron los errores raros que dijo la IA |
| Una orden `null` hace caer la función | Real (H-02) | La llamé con `[null]` y salió `Cannot read properties of null` |
| La hora no se revisa y se compara como texto | Real (H-03) | Puse dos órdenes Alta, una a las «9:00» y otra a las «10:00», y salió primero la de las 10:00 |
| Usar `PESO_PRIORIDAD[a.prioridad]` sería una «inyección de objeto» | Falso positivo | Antes de ordenar, el código ya rechaza cualquier prioridad que no sea Alta, Media o Baja (lo prueba H-04), y el objeto está congelado. Además ESLint, que tiene una regla justo para eso, no lo marcó |
| `localeCompare` depende del idioma y podría ordenar mal las horas | Falso positivo | Ordené cinco horas usando seis idiomas distintos (español, inglés, turco, árabe, tailandés y chino) y siempre salió el mismo orden. Igual lo cambié por una comparación más simple, para que se entienda mejor |
| `Object.freeze` no congela lo que hay por dentro | Falso positivo | Por dentro solo hay números (0, 1 y 2), así que no hay nada más que proteger |
| El mensaje de error repite lo que mandó el usuario, y si alguien manda `<script>` y la pantalla lo muestra como HTML, podría ejecutarse (XSS) | Sospecha, todavía no se puede comprobar | Probé y sí, el mensaje sale con el `<script>` tal cual. Pero todavía no existe la pantalla, así que lo dejé en pendientes (P-03) |

**Lo que la IA no encontró:** la IA revisó el código, pero no las reglas del negocio. Según la HU-03, la cola de órdenes es para el técnico. Cuando esta función esté detrás de la API, la recepcionista o alguien sin sesión no deberían poder verla. Eso no se nota mirando solo la función, porque no recibe ningún usuario, así que lo dejé como pendiente P-02 con su prueba de abuso.

## 4. Pendientes

| Pendiente | Por qué no se corrigió todavía | Plan |
|---|---|---|
| P-01: `npm audit` muestra 6 avisos bajos por la librería `deepmerge`, que viene dentro de Jest (GHSA-gcqx-w48m-w2h4) | La única solución automática (`npm audit fix --force`) bajaba Jest a la versión 25, que ya no es compatible. Probé subir a Jest 30.5.2 y fue peor: 19 avisos, 16 de ellos moderados. Además Jest solo se usa para correr las pruebas, no es parte de la aplicación | Volver a correr `npm audit` cuando salga una versión de Jest que lo arregle |
| P-02: control de acceso y contraseñas | Todavía no hay API, usuarios ni inicio de sesión | Cuando haga la ruta de la cola en Express: que solo entre el rol técnico, guardar las contraseñas con scrypt o bcrypt con sal y hacer una prueba de abuso (si entra la recepcionista, debe recibir 403) |
| P-03: el mensaje de error repite el texto que llegó | Todavía no existe la pantalla | Mostrar los mensajes con `textContent` y no con `innerHTML`, o limpiarlos desde la API |

**Claves expuestas:** Ninguna. Revisé todo el historial con `git log -p --all`.
