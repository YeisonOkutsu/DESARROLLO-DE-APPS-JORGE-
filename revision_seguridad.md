# Informe de revisión de código y seguridad

Proyecto: Clasificador de solicitudes de reparación para Smartfix (HU-03, ordenar órdenes pendientes)
Estudiante: Yeison Andrés Perdomo Losada
Fecha: 2026-11-14
Commit revisado: `4332b47` (rama `main`, entrega de la semana 5). Correcciones en la rama `semana6-revision`.

## 1. Herramientas y criterios

- **Linter:** ESLint 9.39.1 (el proyecto es JavaScript, así que no se usa ruff) con `@eslint/js` recomendado (errores y errores probables), `eslint-plugin-security` 3.0.1 (seguridad) y reglas de estilo (`eqeqeq`, `no-var`, `prefer-const`, `max-len` 100). Configuración en `eslint.config.js`; se ejecuta con `npm run lint`. Resultado final: 0 avisos.
- **Auditoría de dependencias:** `npm audit` (equivalente a pip-audit). Resultado: 6 avisos de severidad baja, todos de `deepmerge` dentro de Jest (solo desarrollo). Ver pendientes.
- **Pruebas:** Jest 29.7.0. Antes 7 pruebas; ahora 14, todas en verde. Ninguna prueba original se modificó.
- **Lista de revisión:** la de la semana 6 (corrección y pruebas, diseño y legibilidad, seguridad).
- **Revisión con IA:** Claude (Anthropic) con el prompt de revisión de la semana (ver sección 3).

### Puntos de seguridad revisados

| Punto | ¿Aplica? | Resultado |
|---|---|---|
| Inyección (consultas con parámetros) | No por ahora: la HU-03 no usa base de datos ni arma consultas. Sí se revisó la entrada de datos, que es la puerta de la futura API. | Sin consultas. Entrada sin validar: H-01, H-02, H-03 |
| Secretos (código, historial, .gitignore, .env.example) | Sí | Sin claves en el código ni en el historial (`git log -p --all` buscando key, secret, password, token, sk-). `.env` ya estaba en `.gitignore`; faltaba `.env.example`: H-06 |
| Contraseñas (scrypt, bcrypt o argon2 con sal) | No: el proyecto todavía no guarda usuarios ni contraseñas. | Pendiente para cuando exista el inicio de sesión (P-02) |
| Control de acceso (rol verificado y prueba de abuso) | Todavía no: es una función pura, sin usuarios ni endpoint. | Pendiente para la API (P-02). Prueba de abuso de entrada: H-04 |
| Dependencias (existen, necesarias, versión fijada, npm audit) | Sí | Jest estaba con `^29.7.0`: H-05. Todas las dependencias existen en npm y son de desarrollo. `npm audit`: P-01 |

## 2. Tabla de hallazgos

Líneas según el commit revisado `4332b47`.

| Id | Archivo y línea | Problema | Categoría (OWASP o tipo) | Severidad | Corrección | Commit |
|---|---|---|---|---|---|---|
| H-01 | src/ordenes/ordenarPendientes.js:23-24 | Si no recibe un arreglo, falla con `ordenes is not iterable`; con un texto da `Prioridad no válida en la orden undefined: undefined` | A04 Diseño inseguro (validación de entrada) | Media | `TypeError` claro si no es arreglo y prueba nueva | `0b22dfb` |
| H-02 | src/ordenes/ordenarPendientes.js:8 | Una orden `null` produce `Cannot read properties of null` | A04 Diseño inseguro (validación de entrada) | Media | `TypeError` con la posición de la orden y prueba nueva | `9318bc2` |
| H-03 | src/ordenes/ordenarPendientes.js:20 | La hora no se valida: `9:00` queda después de `10:00` sin avisar, y una hora numérica puede romper `localeCompare` | Error de corrección / A04 | Media | Validar `HH:MM` de 24 horas con una expresión regular y prueba nueva | `851527c` |
| H-04 | src/ordenes/ordenarPendientes.js:8 | La protección con `Object.hasOwn` contra prioridades heredadas (`toString`, `__proto__`) no tenía ninguna prueba | Falta de prueba de abuso | Baja | Prueba de abuso con `test.each` para 4 nombres heredados | `639fe6c` |
| H-05 | package.json:12 | Jest con versión flotante `^29.7.0` | A06 Componentes vulnerables (versión no fijada) | Baja | Versión exacta `29.7.0`; las de ESLint también exactas | `6252eba` |
| H-06 | raíz del repositorio | No existía `.env.example` | A05 Configuración (secretos) | Baja | `.env.example` con nombres de variables y sin valores | `bba2fd5` |
| H-07 | src/ordenes/ordenarPendientes.js:6 | `validarPrioridades` ya no describe lo que valida y no hay docstrings | Legibilidad (nombre) | Baja | `validarOrdenes` y `validarOrden`, JSDoc en las 4 funciones | `c083c83` |
| H-08 | (proyecto) | No había linter configurado | Herramientas | Baja | ESLint con reglas de seguridad y `npm run lint` | `588888d` |

**Severidad:** alta (permite acceder o cambiar datos sin permiso, o expone secretos), media (error probable o riesgo con condiciones), baja (estilo o mantenibilidad).

### Avisos del linter no corregidos

| Regla | Archivo y línea | Por qué se mantiene |
|---|---|---|
| Ninguna | — | `npm run lint` termina sin avisos. |

## 3. Revisión con IA

**Prompt usado:** «Actúa como revisor de código JavaScript con experiencia en seguridad. Módulo `ordenarPendientes` del proyecto Smartfix (HU-03, futura API Node.js + Express). Revisa corrección, legibilidad y seguridad: inyección, secretos, contraseñas, control de acceso y dependencias. Tabla: línea | problema | severidad (alta, media, baja) | corrección sugerida. No reescribas todo el código. Separa los problemas seguros de las sospechas que habría que verificar.» (Entrada 7 de la bitácora.)

| Hallazgo de la IA | ¿Real o falso positivo? | Cómo lo verifiqué |
|---|---|---|
| Si `ordenes` no es un arreglo, el error es confuso | Real (H-01) | `node -e` con `null`, `{}` y `'abc'`: salieron `ordenes is not iterable` y `...orden undefined: undefined` |
| Una orden `null` rompe la función | Real (H-02) | `ordenarPendientes([null])` dio `Cannot read properties of null` |
| La hora no se valida y se compara como texto | Real (H-03) | `9:00` y `10:00` con la misma prioridad salieron como `10:00, 9:00` |
| `PESO_PRIORIDAD[a.prioridad]` es una inyección de objeto (acceso con clave variable) | Falso positivo | Antes de ordenar, `Object.hasOwn` ya rechazó cualquier prioridad que no sea Alta, Media o Baja (prueba H-04), y el objeto está congelado. ESLint con `eslint-plugin-security` tampoco lo marca |
| `localeCompare` depende del idioma y podría ordenar mal las horas | Falso positivo | Ordené 5 horas `HH:MM` con los idiomas es, en, tr, ar, th y zh y en todos salió igual. De todas formas se cambió por una comparación simple, por claridad (H-07) |
| `Object.freeze` no congela en profundidad | Falso positivo | Los valores de `PESO_PRIORIDAD` son números, no objetos; no hay nada más profundo que proteger |
| El mensaje de error incluye el texto que mandó el usuario (`<script>…`) y podría causar XSS si la pantalla lo muestra como HTML | Sospecha, no verificable todavía | Comprobé que el mensaje sale tal cual con `<script>`, pero aún no existe la pantalla. Queda como pendiente P-03 |

**Lo que la IA no encontró:** la IA revisó el código pero no las reglas del negocio. Según la HU-03, la cola es para el técnico; cuando la función se publique como endpoint de la API, la recepcionista o un usuario sin sesión no deberían poder pedirla. Eso no se ve en la función, porque no recibe usuario, y queda como pendiente P-02 con su prueba de abuso.

## 4. Pendientes

| Pendiente | Por qué no se corrigió todavía | Plan |
|---|---|---|
| P-01: `npm audit` muestra 6 avisos de severidad baja por `deepmerge` (GHSA-gcqx-w48m-w2h4) dentro de Jest | La única solución de `npm audit fix --force` baja Jest a la 25 (cambio incompatible). Probé Jest 30.5.2 y salieron 19 avisos (16 moderados), así que es peor. Es una dependencia solo de desarrollo y no llega al código que se ejecuta | Volver a correr `npm audit` cuando Jest publique una versión corregida |
| P-02: control de acceso y contraseñas | Todavía no hay API, usuarios ni inicio de sesión | Al crear el endpoint de la cola en Express: exigir el rol técnico, guardar contraseñas con scrypt o bcrypt con sal y agregar una prueba de abuso (recepcionista → 403) |
| P-03: el mensaje de error repite el texto recibido | No hay pantalla todavía | Mostrar los mensajes con `textContent` (no `innerHTML`) o escaparlos en la API |

**Claves expuestas:** Ninguna. Se revisó el historial completo con `git log -p --all`.
