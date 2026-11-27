# Informe final del proyecto integrador

Proyecto: Clasificador de solicitudes de reparación para Smartfix
Estudiante: Yeison Andrés Perdomo Losada
Repositorio: https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE- (rama [`entrega-final`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/tree/entrega-final))
Fecha: 2026-11-25

Seminario Inteligencia Artificial Aplicada al Ciclo de Vida del Software. Fundación Escuela Tecnológica de Neiva Jesús Oviedo Pérez (FET).

## 1. Resumen

En un taller de reparación de celulares, las solicitudes llegan sin clasificar y quien atiende decide a mano qué tan urgente es cada una, así que un equipo mojado puede esperar igual que un cambio de vidrio. Mi proyecto propone un sistema que sugiere el tipo de falla y la prioridad, y ordena la cola de los técnicos. Usé IA (Claude, y Gemini en el laboratorio de la semana 1) en las seis fases: para definir el problema, levantar requisitos, diseñar la arquitectura, programar, probar y montar el pipeline. Lo construido es la HU-03, que ordena las órdenes pendientes por prioridad y hora de llegada. Tiene 63 pruebas automáticas, ESLint con reglas de seguridad, un pipeline en GitHub Actions y una demo local con una API en Express y una página web. La verificación mostró que la IA se equivoca de formas que no se ven leyendo: código que modificaba la lista original, pruebas que pasaban aunque el orden estuviera mal, una actualización de dependencias que empeoraba la seguridad y un archivo que se dio por subido y nunca llegó al repositorio. Las pruebas escritas antes del código y los errores sembrados a propósito fueron lo que más me ayudó a encontrarlos.

## 2. Problema y usuario

El problema lo tiene la recepción de un taller de reparación de celulares, y detrás de ella los técnicos y los clientes. Hoy la solicitud llega por mostrador o por mensaje («mi celular se cayó al agua y no carga»), y quien atiende decide el tipo de falla, la urgencia y los repuestos según su experiencia. Por eso el resultado depende de quién conteste. Según la entrevista, entran unas 30 solicitudes al día y hasta 50 los sábados, el internet del local se cae casi todas las tardes, los clientes llaman a preguntar por su equipo y la cliente fue enfática en que nunca se guarde la clave del celular.

Lo que se necesita es que cada solicitud quede registrada con un tipo de falla y una prioridad que la recepcionista pueda corregir, y que los técnicos vean la cola ordenada para atender primero lo urgente.

- Propuesta del módulo 1: [S2_Propuesta.pdf](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S2_Propuesta.pdf)
- Entrevista y requisitos del módulo 2: [S3_Requisitos.pdf](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Requisitos.pdf). La transcripción está en el Anexo A de la [bitácora de la semana 3](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Bitacora_prompts.pdf).

**Aclaración importante:** Smartfix es un emprendimiento ficticio creado para el curso, y la entrevista no se hizo con una persona real. La cliente, «Marcela», fue simulada con IA, y así quedó declarado en el documento de requisitos. Lo explico en la sección 6.

## 3. La IA en el ciclo de vida

| Módulo y fase | Qué hice con IA | Herramienta | Evidencia (enlace) | Cómo verifiqué |
|---|---|---|---|---|
| 1. Fundamentos | Comparé dos asistentes con el mismo prompt (validar un correo en Python), armé un banco de 10 prompts evaluados y redacté la propuesta. | Claude y Gemini | [Laboratorio](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S1_Laboratorio_comparativo.pdf), [mapa conceptual](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S1_Mapa_conceptual_IA_ciclo_de_vida.pdf), [banco de prompts](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S2_Banco_de_prompts.pdf), [propuesta](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S2_Propuesta.pdf) | Ejecuté el código de los dos asistentes y sus pruebas. En el banco ejecuté el código de los prompts: el del prompt 1 daba 2.67 donde debía dar 2.68 por redondear con decimales flotantes, y quedó bien al exigir `Decimal` en el prompt. |
| 2. Requisitos | Guion de entrevista, cliente simulada, extracción de necesidades con cita textual, historias de usuario con escenarios Gherkin y priorización MoSCoW. | Claude | [Requisitos](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Requisitos.pdf), [bitácora de prompts](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Bitacora_prompts.pdf) | Un programa comprobó que cada cita aparece tal cual en la transcripción. Recalculé el porcentaje de historias Must (5 de 9, 55,6 %, por debajo del 60 %) y dejé las dudas de la cliente como preguntas pendientes (P-01 a P-05). |
| 3. Diseño | Alternativas de arquitectura, matriz ponderada, diagramas C4, ADR-001, modelo de datos y endpoints de la API. | Claude | [Documento de diseño](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S4_Diseno.pdf) | Recalculé los totales de la matriz (A = 86, B = 84, C = 90). Revisé que los diagramas, el modelo y la API sigan el ADR: la llamada a la IA solo sale de la API, para que la clave no llegue al navegador, y el modelo no tiene ningún campo para la clave del celular (HU-09). |
| 4. Código | HU-03 con TDD: contrato, pruebas en rojo, implementación y refactor. Revisión de calidad y seguridad con ESLint, `npm audit` y una segunda revisión con IA. | Claude (chat y agente) | Rama [`semana5-hu03`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/tree/semana5-hu03): [pruebas en rojo](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/c5e4df8), [verde](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/62be368), [refactor](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/c8858f7). Rama [`semana6-revision`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/tree/semana6-revision): [revision_seguridad.md](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/revision_seguridad.md) | Escribí las pruebas antes del código, y una de ellas atrapó el error de `sort()` (caso 1). Comprobé cada hallazgo de la IA con `node -e`: 3 eran reales, 3 falsos positivos y 1 quedó como sospecha (caso 4). |
| 5. Pruebas | Tabla de casos con particiones de equivalencia, valores límite y tablas de decisión. La IA escribió un borrador de 33 pruebas que revisé, generó los datos sintéticos y sembró errores a propósito. | Claude (agente) | Rama [`semana7-pruebas`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/tree/semana7-pruebas): [registro_pruebas.md](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/registro_pruebas.md), [reglasHU03.test.js](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/tests/reglasHU03.test.js), [commit](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/22e3bdf) | Saqué cada resultado esperado del contrato, no del código. Corregí 4 pruebas de la IA y descarté otras 4 (caso 2). Sembré 9 errores: las pruebas de la semana 6 dejaban pasar 2 y las de la semana 7 detectan los 9. La cobertura de la lógica es del 100 %. |
| 6. Operación | Pipeline de integración continua que en cada push instala, pasa el linter y corre las pruebas. Revisión de dependencias con `npm audit`. | Claude (agente) | [ci.yml](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/.github/workflows/ci.yml), [ejecuciones del pipeline](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/actions/workflows/ci.yml) | Corrí los mismos pasos (`npm ci`, `npm run lint`, `npm test`) en una copia limpia y revisé en GitHub Actions que la ejecución saliera en verde. En dependencias rechacé la actualización que sugería la IA (caso 3). Al revisar los enlaces de este informe encontré que el `.env.example` nunca se había subido (caso 5). |

## 4. Verificación: lo que la IA hizo mal y cómo lo encontré

### Caso 1: la función ordenaba la lista original en vez de una copia

- **Fase:** código (semana 5).
- **Qué propuso la IA:** implementar `ordenarPendientes(ordenes)` devolviendo directamente `ordenes.sort(...)`.
- **Qué estaba mal:** en JavaScript, `sort()` reordena el mismo arreglo que recibe. El contrato dice que la función devuelve una lista nueva sin tocar la original. En la aplicación, la lista que la recepcionista ve en orden de llegada se reordenaría sola.
- **Cómo lo detecté:** con la prueba «no modifica la lista original», que escribí antes del código. Seis pruebas pasaron y esa falló: la lista original quedó como `['SF-0201', 'SF-0195']` en vez de `['SF-0195', 'SF-0201']`. Leyendo el código parecía correcto, porque los casos normales salían bien.
- **Qué hice:** copiar la lista antes de ordenar con `[...ordenes].sort(...)` ([commit 62be368](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/62be368), entrada 2 de la bitácora). En el mismo commit cambié `prioridad in pesos` por `Object.hasOwn(pesos, prioridad)`, porque con `in` una prioridad «toString» pasaba como válida (entrada 3).

### Caso 2: pruebas de la IA que pasaban, pero no probaban la regla

- **Fase:** pruebas (semana 7).
- **Qué propuso la IA:** un borrador de 33 pruebas en Jest para las reglas de la HU-03. Todas pasaban.
- **Qué estaba mal:** que pasaran no quería decir que estuvieran bien. Dos pruebas de `compararOrdenes` exigían los números exactos `-2` y `2`, que salen de cómo resta los pesos el código, pero la regla solo dice cuál orden va primero. Otras dos no revisaban el mensaje del error, tres estaban repetidas y una pasaba aunque el orden estuviera mal. Además, faltaban los límites de la hora (24:00, 00:60, 23:60).
- **Cómo lo detecté:** cambié el código para que devolviera `-1`, que sigue cumpliendo la regla. Fallaron 2 pruebas del borrador y ninguna de las mías, así que esas 2 probaban el código y no la regla. Después sembré 9 errores, uno a la vez: con las pruebas de la semana 6, aceptar «24:00» y «23:60» no hacía fallar nada.
- **Qué hice:** corregí 4 pruebas para que revisen solo el signo y el mensaje exacto, descarté 4 y agregué los límites de la hora. Ahora los 9 errores sembrados hacen fallar al menos una prueba ([registro_pruebas.md, secciones 2 y 3](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/registro_pruebas.md), [commit 22e3bdf](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/22e3bdf), entradas 12 y 14).

### Caso 3: una actualización de dependencias que empeoraba la seguridad

- **Fase:** operación, mantenimiento de dependencias (semana 6).
- **Qué propuso la IA:** `npm audit` mostró 6 avisos bajos de la librería `deepmerge`, que viene dentro de Jest. La sugerencia automática era `npm audit fix --force`, y la IA propuso subir a Jest 30.
- **Qué estaba mal:** `npm audit fix --force` bajaba Jest a la versión 25, que ya no es compatible con el proyecto. Con Jest 30.5.2 la situación empeoraba: pasaba de 6 avisos bajos a 19, y 16 de ellos eran moderados.
- **Cómo lo detecté:** corrí `npm audit` y `npm test` con cada versión y comparé los resultados.
- **Qué hice:** me quedé con Jest 29.7.0 y le fijé la versión exacta, sin el `^` ([commit 6252eba](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/6252eba)). Dejé los 6 avisos como pendiente P-01, explicado en el informe de seguridad, porque Jest solo se usa para las pruebas y no llega a la aplicación (entrada 9).

### Caso 4: falsos positivos en la revisión de seguridad con IA

- **Fase:** código, revisión de seguridad (semana 6).
- **Qué propuso la IA:** 7 hallazgos sobre el código de la semana 5, entre ellos una «inyección de objeto» en `PESO_PRIORIDAD[a.prioridad]` y que `localeCompare` podía ordenar mal las horas según el idioma.
- **Qué estaba mal:** 3 de los 7 eran falsos positivos. El código ya rechazaba cualquier prioridad distinta de Alta, Media o Baja antes de usarla, `localeCompare` ordenaba igual en todos los idiomas y `Object.freeze` no tenía nada más que proteger. Al revés, la IA no vio que la cola debería verla solo el técnico, porque eso no se nota mirando una función que no recibe usuarios.
- **Cómo lo detecté:** probé cada hallazgo con `node -e` sobre el código de la semana 5. Ordené cinco horas con seis idiomas distintos (español, inglés, turco, árabe, tailandés y chino) y siempre salió el mismo orden. También llamé la función con `null`, `[null]` y la hora «9:00» para confirmar los 3 problemas reales.
- **Qué hice:** corregí los reales, cada uno en su commit y con una prueba nueva ([0b22dfb](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/0b22dfb), [9318bc2](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/9318bc2), [851527c](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/851527c)). Los falsos positivos y el control de acceso pendiente quedaron documentados en la [sección 3 de revision_seguridad.md](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/revision_seguridad.md). La validación de la hora corrigió una decisión mía de la semana 5, que había rechazado esa validación (entradas 5 y 8).

### Caso 5: la IA dijo que agregó un archivo que nunca quedó en el repositorio

- **Fase:** operación, configuración y secretos (semanas 6 y 8).
- **Qué propuso la IA:** en la semana 6, el agente corrigió el hallazgo H-06 («no hay `.env.example`»). El commit [bba2fd5](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/bba2fd5) dice en su mensaje que lo agregó, y el informe de seguridad lo dio por corregido.
- **Qué estaba mal:** el archivo nunca quedó en Git. La regla `.env.*` del `.gitignore`, pensada para tapar los archivos con secretos, también tapaba el `.env.example`. El commit solo cambió `package.json` y `src/ejemplo.js`.
- **Cómo lo detecté:** al comprobar que cada enlace de este informe apuntara a un archivo que existe en la rama, el `.env.example` no estaba. `git show --stat bba2fd5` confirmó que el commit no lo traía y `git check-ignore -v .env.example` mostró la regla culpable.
- **Qué hice:** agregué la excepción `!.env.example` al `.gitignore` y el archivo con las variables que va a usar la API, sin valores. Comprobé que el `.env` sigue ignorado ([commit 7088dac](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/7088dac)). Aprendí que no basta con leer el mensaje del commit: hay que mirar qué archivos trae.

## 5. Estado final del sistema

- **Arquitectura:** una aplicación web instalable (PWA) en Ionic + Angular, con una cola sin conexión en IndexedDB, una API REST en Node.js + Express y PostgreSQL. Solo la API llama al servicio de IA, para que la clave nunca salga del servidor. Elegí esta opción en la matriz ponderada porque permite seguir registrando cuando se cae el internet en las tardes. Está en el [documento de diseño](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S4_Diseno.pdf), sección 4 (ADR-001). Lo construido hasta ahora es la lógica de dominio en [`src/ordenes/ordenarPendientes.js`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/src/ordenes/ordenarPendientes.js) y una primera parte de la API en Express, en [`src/app.js`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/src/app.js): `GET /api/ordenes/pendientes` y `POST /api/ordenes`, con las órdenes en memoria. Una página sencilla en `public/` muestra la cola. Se arranca con `npm start` ([commit c8e9ae5](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/commit/c8e9ae5)).
- **Funcionalidades terminadas:** de las 5 historias Must está terminada 1.

  | Historia Must | Estado |
  |---|---|
  | HU-03 Ver las órdenes pendientes ordenadas por prioridad y hora | Terminada: función de dominio con contrato, pruebas, revisión de seguridad y pipeline, expuesta en la ruta `GET /api/ordenes/pendientes` y en la página de la demo local. Falta guardar las órdenes en PostgreSQL y la pantalla en Ionic. |
  | HU-01 Registrar la solicitud y sugerir el tipo de falla | Pendiente (diseñada: endpoint `POST /ordenes`) |
  | HU-02 Prioridad alta para humedad o golpe fuerte | Pendiente (diseñada). Es el clasificador con IA. |
  | HU-06 Corregir la clasificación sugerida | Pendiente (diseñada: `PATCH` de la clasificación) |
  | HU-09 No registrar la clave del celular | Pendiente en código. En el diseño, el modelo de datos no tiene campo para la clave. |

- **Pruebas:** 63 pruebas automáticas en Jest: 14 en [`ordenarPendientes.test.js`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/tests/ordenarPendientes.test.js) (semanas 5 y 6) y 42 en [`reglasHU03.test.js`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/tests/reglasHU03.test.js) (semana 7) y 7 en [`api.test.js`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/tests/api.test.js) (la API de la demo, con supertest). La cobertura de la lógica de negocio (`ordenarPendientes.js`) es del 100 % en líneas y en ramas (`npx jest --coverage`). `npm run lint` termina sin avisos. Última ejecución del pipeline: [GitHub Actions, workflow CI](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/actions/workflows/ci.yml).
- **Pendientes:**
  - **El clasificador con IA (HU-01 y HU-02)** es el corazón de la propuesta y no se alcanzó a construir. Por lo mismo, tampoco se midió la meta de la propuesta: acertar la prioridad del técnico en el 80 % de 50 solicitudes. Fue una decisión: preferí terminar bien una historia sencilla (contrato, TDD, revisión de seguridad, suite de pruebas y pipeline) antes que tener varias a medias. Para la siguiente versión empezaría con un clasificador por palabras clave, que se puede probar sin la API de IA, y después lo compararía con el modelo de lenguaje.
  - El resto de la API (registro con clasificación y corrección), la base de datos, la PWA en Ionic y las historias HU-06 y HU-09.
  - De seguridad (`revision_seguridad.md`): los 6 avisos bajos de `npm audit` (P-01), el control de acceso por rol y las contraseñas con hash cuando exista el inicio de sesión (P-02), y mantener `textContent` para los mensajes de error en la PWA (P-03, ya aplicado en la página de la demo).
  - Preguntas para el cliente: P-01 a P-05 de los requisitos y las 4 ambigüedades de la regla de la HU-03 que encontré en la semana 7 (por ejemplo, si «alta» en minúsculas cuenta).

## 6. Reflexión ética y legal

| Principio | Decisión en mi proyecto | Evidencia |
|---|---|---|
| Datos personales (Ley 1581 de 2012) | Solo usé datos ficticios y sintéticos: nombres inventados y teléfonos con el prefijo 300 000 00xx. No pegué datos reales en ningún chatbot. El sistema no guarda la clave de desbloqueo del celular, porque es un dato que el taller no necesita para su finalidad. Las claves y la configuración van en `.env`, fuera del repositorio. | [ordenesSinteticas.js](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/tests/datos/ordenesSinteticas.js), HU-09 y RNF-03 en los [requisitos](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Requisitos.pdf), [.env.example](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/.env.example) |
| Sesgo | El orden de la HU-03 usa reglas fijas y públicas (prioridad y hora de llegada), iguales para todos los clientes. El riesgo de sesgo está en el clasificador: que alguien que escribe con poco detalle o con faltas de ortografía quede con una prioridad más baja. Por eso la IA solo sugiere y la recepcionista puede corregir (HU-06). Además, al construir el clasificador hay que medir los aciertos por tipo de redacción y no solo el total. | HU-02 y HU-06 en los [requisitos](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Requisitos.pdf), [propuesta](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S2_Propuesta.pdf) |
| Transparencia | Registré el uso de IA en cada fase: el prompt, lo que acepté, corregí o rechacé y cómo lo verifiqué. La entrevista quedó declarada como simulada con IA. El README tiene una sección de uso de IA. | [bitacora_ia.md](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/bitacora_ia.md), [bitácora de la semana 3](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Bitacora_prompts.pdf), [README, sección 7](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/README.md) |
| Responsabilidad | La IA propone y la persona decide. En el sistema, la recepcionista confirma o corrige la clasificación. En el proyecto, las decisiones sobre el alcance las tomé con los criterios de aceptación y no con la IA, como dejar «Sin clasificar» por fuera de la HU-03, y lo que la regla no aclara quedó como pregunta para el cliente. El agente trabajó en ramas separadas y revisé su diff antes de integrar. | Entradas 4, 10 y 11 de la [bitácora](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/bitacora_ia.md) |
| Propiedad intelectual y política de uso | El proyecto tiene licencia MIT. Las dependencias tienen licencias compatibles: Jest, ESLint y globals son MIT, y eslint-plugin-security es Apache-2.0. No copié código de terceros sin declararlo. En los prompts no puse datos reales ni claves, y declaro qué partes se hicieron con IA, como pide el seminario. | [LICENSE](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/LICENSE), [package.json](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/package.json) |

El dilema más importante fue la entrevista de la semana 3. La tarea pedía hablar al menos 15 minutos con un cliente real o con un compañero que hiciera de cliente, y yo usé la IA para simular a la cliente. Lo fácil habría sido presentar la transcripción como si fuera de una persona real, pero eso es inventar evidencia: las citas de los requisitos parecerían salir de alguien que existe y no es así. Lo resolví declarándolo en el documento de requisitos, en la bitácora y en este informe, y dejando como preguntas pendientes lo que la «cliente» no aclaró. El costo es que mis requisitos no están validados con un taller de verdad. Antes de construir el clasificador habría que repetir la entrevista con un taller real de Neiva.

## 7. Aprendizajes

### Lo que ahora sé hacer

Antes de este seminario escribía el código primero y lo probaba a mano al final. Ahora sé escribir primero el contrato de una función (qué recibe, qué devuelve y qué errores lanza) y sus pruebas, y solo después el código, con el ciclo rojo, verde y refactor. Sé diseñar casos de prueba con particiones de equivalencia, valores límite y tablas de decisión, en vez de inventarlos al azar, y sembrar errores a propósito para medir si mis pruebas sirven: con las pruebas de la semana 6 se escapaban 2 de 9 errores, y con las de la semana 7 se detectan los 9. También sé configurar ESLint con reglas de seguridad, revisar las dependencias con `npm audit` y fijar sus versiones, montar un pipeline en GitHub Actions que repite todo eso en cada push y exponer la lógica en una API de Express con su página de demo.

### Los errores que tuvimos y cómo se corrigieron

Los errores de la IA casi nunca se veían a simple vista, porque el código y las pruebas que entregaba parecían correctos:

- En la semana 2, el código del prompt 1 redondeaba 2.675 a 2.67 en vez de 2.68 por usar decimales flotantes. Se corrigió exigiendo `Decimal` en el prompt.
- En la semana 5, `ordenes.sort()` cambiaba la lista original, y con `prioridad in pesos` una prioridad «toString» pasaba como válida. Las dos cosas las atrapó una prueba y se corrigieron con `[...ordenes].sort()` y `Object.hasOwn`.
- En la semana 6, 3 de los 7 hallazgos de la revisión con IA eran falsos positivos, y la IA no vio que la cola debería verla solo el técnico. Además propuso subir a Jest 30, que pasaba de 6 avisos de seguridad a 19.
- En la semana 7, la IA escribió pruebas que exigían el número `-2` exacto y le faltaban los límites de la hora (24:00 y 23:60). Todas pasaban, pero no probaban la regla.
- En la semana 8, revisando los enlaces de este informe, encontré que el `.env.example` que el agente dijo haber subido en la semana 6 nunca llegó al repositorio, porque el `.gitignore` lo tapaba.

También tuve errores propios. En la semana 5 rechacé validar el formato de la hora porque supuse que siempre llegaría bien, y en la semana 6 una hora como «9:00» se ordenaba mal, así que tuve que cambiar esa decisión. Dejé el clasificador con IA, que es el centro del problema, para el final, y no alcancé a construirlo. Y monté el pipeline en la última semana, cuando debió estar desde la primera funcionalidad.

### Cómo aprendí a usar bien la IA

- **Darle contexto, no solo pedirle.** Un prompt como «ayúdame con la tarea» da respuestas genéricas. Funcionó mejor darle un rol, el contexto del proyecto, la tarea exacta, las restricciones (qué no tocar, qué librerías no agregar) y el formato de la respuesta. En la semana 6 también le pedí separar los problemas seguros de las sospechas.
- **Darle primero el contrato y las pruebas.** Cuando la IA programa contra pruebas que yo escribí antes, sus errores fallan en rojo. Cuando escribe el código y las pruebas al mismo tiempo, puede equivocarse en los dos lados y todo sale en verde.
- **Ejecutar siempre y no creerle a la primera.** Cada respuesta la comprobé con una prueba, con `node -e`, con `npm audit` o con `git show --stat`. Una respuesta segura de la IA no es una respuesta verificada, y el mensaje de un commit no prueba lo que el commit trae.
- **Usarla como segundo revisor, no como el único.** La IA encontró problemas que yo no vi, pero también inventó problemas y no entendió el negocio. Lo que la regla no aclara, como si «alta» en minúsculas cuenta, es una pregunta para el cliente, no para la IA.
- **Trabajar con el agente en ramas separadas** y revisar su diff antes de integrar, para que no pueda dañar lo que ya funciona.
- **Registrar y declarar.** La bitácora (18 entradas) dice qué acepté, qué corregí y qué rechacé. Nunca pegué datos reales ni claves en un prompt, y declaré el uso de la IA, incluida la entrevista simulada.

### En qué confié de más y qué haría distinto

Confié de más en la IA en las semanas 3 y 4. Le dejé hacer casi todo: la entrevista simulada, las historias de usuario y el documento de diseño. Esos documentos quedaron bien presentados, pero los verifiqué con menos fuerza que el código, porque en un documento no hay una prueba que falle y avise. Si empezara de nuevo, haría la entrevista con un taller real de Neiva, empezaría por el clasificador aunque fuera con palabras clave, y montaría el pipeline desde la semana 5. La conclusión más importante para mí es que la IA me ayudó a avanzar mucho más rápido, pero lo que me dijo cuándo podía confiar en ella fueron las pruebas.

## 8. Anexos

- Bitácora de uso de IA, semanas 5 a 8: [bitacora_ia.md](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/bitacora_ia.md)
- Documentos de cada módulo:
  - Módulo 1: [laboratorio comparativo](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S1_Laboratorio_comparativo.pdf), [mapa conceptual](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S1_Mapa_conceptual_IA_ciclo_de_vida.pdf), [banco de prompts](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S2_Banco_de_prompts.pdf) y [propuesta](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S2_Propuesta.pdf)
  - Módulo 2: [requisitos](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Requisitos.pdf) y [bitácora de prompts](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S3_Bitacora_prompts.pdf)
  - Módulo 3: [documento de diseño](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/docs/S4_Diseno.pdf)
  - Módulo 4: ramas [`semana5-hu03`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/tree/semana5-hu03) y [`semana6-revision`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/tree/semana6-revision), [README](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/README.md) y [revision_seguridad.md](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/revision_seguridad.md)
  - Módulo 5: rama [`semana7-pruebas`](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/tree/semana7-pruebas) y [registro_pruebas.md](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/registro_pruebas.md)
  - Módulo 6: [ci.yml](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/blob/entrega-final/.github/workflows/ci.yml) y [ejecuciones del pipeline](https://github.com/YeisonOkutsu/DESARROLLO-DE-APPS-JORGE-/actions/workflows/ci.yml)
