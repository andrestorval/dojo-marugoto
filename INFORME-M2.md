# Informe M2 — programador de repaso espaciado y pantalla de inicio

Fecha: 2026-09-08. Plano: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`, secciones 2.2 a 2.5, Anexo A y Anexo B, y la fila M2 de la tabla 9.1.

Objetivo del módulo: escalera de intervalos, transiciones por resultado,
marcado manual, selección de la sesión por vencimiento, pantalla de inicio con
acción principal y menú secundario, `unidadActual` y contador de vencidas y
nuevas.

## Qué se hizo

### El programador

`ESCALERA = [0, 1, 3, 7, 14, 30, 60, 120]`, y desde el paso 7 el intervalo se
duplica con tope de 365 días. `transicion(registro, resultado, dia)` es la única
función que decide cuándo vuelve un ítem, y recibe el día por parámetro, de modo
que las pruebas no dependen del reloj de la máquina. Un `casi` no promueve y no
castiga, pero reprograma con el mismo intervalo: si no, el ítem quedaría vencido
de forma permanente. Un `mal` cae a la caja 0 con `due` igual a hoy, lo que hace
que aparezca vencido en la sesión siguiente, y borra el marcado manual.

El marcado manual lleva el ítem al paso 7 con 120 días. No desaparece: sigue en
el calendario y duplica intervalo con cada acierto. Deshacerlo lo devuelve a la
caja 4 con 14 días. Se ofrece en dos lugares, como pide el plano: como acción
secundaria tras una respuesta correcta ("Ya la sé") y desde el historial, tocando
cualquiera de los ítems de "lo que más se te resiste".

`seleccionar` arma la cola con la regla de 2.4: vencidos primero, ordenados por
fecha y a igual fecha por caja más baja; si el atraso iguala o supera el largo,
la sesión se llena solo con vencidos y no entra material nuevo; si no, entra el
cupo de nuevos, después adelantados de hasta tres días, y si todavía sobra sitio,
más nuevos. El barajado final mezcla unidades y tipos.

### Orden de entrada de ítems nuevos

Es la respuesta al problema de volumen: el pool completo del Tema 8 son 668
ítems, el número que anticipaba la sección 0 del plano. El cupo se reparte entre
tipos en vez de agotar uno antes de pasar al siguiente, que es lo que producía
semanas de solo vocabulario en la auditoría del Anexo C. Medido sobre el
contenido real, la primera sesión de veinte trae cuatro tipos distintos y
conjugación desde el primer día.

Las dependencias funcionan: una palabra entra a "escribir" solo después de
haberse visto en "reconocer", una frase espera a que un hueco de su patrón
llegue a la caja 2, y un verbo nuevo entra con una sola forma por sesión.

### Pantalla de inicio, menú y primer uso

El inicio queda con una acción principal, "Practicar hoy", cuyo subtítulo dice
qué va a pasar al tocarlo ("14 vencidas · 6 nuevas", o "Nada vencido · 6 nuevas",
o "Todo al día" con el botón ofreciendo adelantar). Debajo, "Elegir qué
practicar" abre el menú completo: modos, unidades con selección múltiple, clase,
largo, nuevos por sesión y unidad en curso.

Cuando el atraso bloquea la entrada de nuevos aparece la línea explicativa: sin
ella, quien falla mucho vive semanas así y lo lee como que la app se quedó
pegada.

El historial gana una barra por unidad, con lo visto y lo firme sobre el total de
la unidad, y cuenta los ítems marcados como sabidos. "Firme" pasa de caja 3 a
caja 5, que con la escalera nueva es lo que corresponde a un intervalo de 30
días.

El primer uso pregunta dos cosas, una sola vez: en qué unidad va y cuánto quiere
practicar por día. No aparece para quien llega con historial migrado.

### Correcciones del Anexo A que tocaban a M2

- `FORMAS` pierde el campo `c`. Qué formas practica cada clase lo dice ahora
  `UNIDADES[].formas`: nueve en la clase 1 y ocho en la 2, los mismos 472 cruces
  que producía el archivo congelado.
- `pesado` desaparece. `armarPool` recorre todas las unidades listas, recibe el
  filtro y deduplica por id.
- `distractores` busca en tres anillos: misma categoría y misma unidad, misma
  categoría de cualquier unidad, y solo al final el resto del vocabulario.
- "La tenía bien" restaura el registro previo y aplica el acierto sobre él, en
  vez de marcar sobre el registro ya penalizado.

## Un problema que las pruebas destaparon

La dependencia hueco→frase, escrita tal como está en el plano, bloqueaba las
frases para siempre. Los huecos del Tema 8 todavía no llevan el campo `pat` —lo
agrega M3—, así que la búsqueda de "algún hueco del mismo patrón en la caja 2"
no encontraba ninguno y la condición nunca se cumplía. Lo mismo habría pasado en
una sesión manual de "solo vocabulario escribir": el requisito es el ítem de
reconocer, que el filtro deja fuera del pool, y la sesión habría salido vacía.

La regla corregida exige la dependencia solo cuando el requisito está en el pool
de esa sesión. Un portón que no puede abrirse no es un portón, es un muro. La
intención pedagógica del plano se conserva intacta en "Practicar hoy", donde el
pool trae todos los modos.

## Criterios de aceptación

| Criterio | Resultado |
|---|---|
| Pruebas con fecha simulada: escalera completa, `mal`, `casi`, marcado y desmarcado manual | La racha de siete aciertos recorre `[1,1] [2,3] [3,7] [4,14] [5,30] [6,60] [7,120]`; desde el paso 7 duplica hasta el tope de 365; `casi` deja caja e intervalo y reprograma; `mal` deja caja 0, `due` hoy y `man` en 0 |
| "La tenía bien" restaura el registro previo | Partiendo de caja 3 con un fallo antiguo: tras el fallo queda caja 0 y dos fallos; tras el botón, caja 4 y un solo fallo. Verificado también en el navegador |
| Atraso mayor que el largo excluye nuevos | Con 30 vencidos y largo 20: cola de 20, todos vencidos, `nuevas` 0, `atrasados` 10 |
| Cola sin atraso trae `cupoNuevos` y adelantados | Con 3 vencidos, 37 adelantados y largo 20: 3 + 6 nuevos + 11 adelantados |
| Orden de entrada: unidad, clase, reparto entre tipos, dependencias y una forma por verbo | Los cinco, con pruebas separadas. `ordenUnidades(6)` sobre nueve unidades da `[6,5,4,3,2,1,7,8,9]` |
| La línea de "no entran nuevos" aparece cuando el atraso supera el largo | Sí, comprobado en el navegador con 30 vencidos y largo 10 |
| Primer uso con almacén vacío pregunta unidad y largo una sola vez | Sí. Tras contestar y recargar, arranca directo en el inicio |
| Historial por unidad en el inicio | Barra "Unidad 8 · Contratiempos en el viaje · 30 de 668", con lo firme superpuesto |

`node --test "pruebas/*.test.mjs"`: 58 pruebas, 57 en verde, 0 fallos, 1 marcada
`todo` (la de M5). Las 25 nuevas están en `pruebas/programador.test.mjs`.

Verificado además en el navegador, sobre la salida PWA servida en local: el
primer uso, dos sesiones en días distintos simulando el paso del tiempo, el aviso
de atraso, el menú con sus seis controles, "Ya la sé" desde la retroalimentación
y desde el historial, y "La tenía bien".

## Desviaciones del plano

**El resumen de sesión conserva el porcentaje y las frases de juicio.** El Anexo
B las quita, pero el plano asigna esa reescritura a M3, junto con el conteo de
"recuperadas con pista" que solo existe cuando existe la pista progresiva. Lo que
sí se agregó al resumen es la línea de vencidas que quedan para hoy y el botón
"Seguir 10 más": son información del programador, y sin ellas el tope por atraso
es invisible.

**La tarjeta de presentación de vocabulario nuevo no está.** Es de M3 (3.5).

**`ordenEntrada` no incluye los ítems de grupo del verbo** (`g:<kana>`) ni la
dependencia que los precede, porque ese tipo de ítem nace en M3 (3.6).

## Una trampa del entorno que conviene recordar

Durante la verificación, `node herramientas/build.mjs | Select-Object -First 1`
dejó `dist/pwa/` a medio escribir: PowerShell cierra la tubería en cuanto recibe
el primer objeto y mata el proceso que la alimenta. El build no tenía nada malo.
Los comandos del proyecto no se filtran con `Select-Object -First`.

## Lo que queda pendiente

Sigue en pie lo de M0: `FRASES[0]` no tiene variante en kana, y se corrige en M5.

`sel.manuales`, el contador de sesiones abiertas desde el menú, está en la
configuración pero todavía no se incrementa. Sirve para la señal de detección de
la sección 10 del plano ("más de la mitad de las sesiones empiezan por Elegir qué
practicar"), y se conecta cuando haya uso real que medir.

## Para aprobar

Usa "Practicar hoy" tres días seguidos y confirma que lo que fallaste vuelve al
día siguiente y lo que acertaste no.
