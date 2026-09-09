# Informe M3 — pista progresiva, exigencia escalonada, fichas y materia

Fecha: 2026-09-09. Plano: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`, secciones 3.1 a 3.6, Anexo B y Anexo C, y la fila M3 de la tabla 9.1.

Objetivo del módulo: flujo de dos niveles al fallar, etapas por caja para
conjugación y hueco, ítem de grupo del verbo, distractores de conjugación
generados, fichas de forma y de patrón, tarjeta de presentación de vocabulario
nuevo, `pat` y catálogo `patrones` del Tema 8, resumen neutro y repaso de
fallados al final de la sesión.

## Contenido nuevo, que necesita tu revisión

Esto es lo único de M3 que una máquina no puede comprobar, y lo redacté yo:

- **21 patrones de la unidad 8**, cada uno con su línea de uso, su fórmula de
  construcción, su ejemplo del libro y la marca de si es gramática o expresión.
- **Las 12 formas de conjugación** con su línea de uso. Sus ejemplos no se
  escriben: la ficha llama a `conjugar` sobre tres verbos de referencia, así que
  no pueden desincronizarse de lo que la app corrige.
- **El campo `pat` de los 25 huecos**, derivado de la parte derecha de `hint`.
  Los ocho que no llevan flecha son los de transitivo e intransitivo, y se
  clasificaron por el texto de la pista.

Léelo con el libro al lado. Si una línea de uso o una fórmula está mal, la app
enseña mal, y ahora además lo hace en una sección consultable.

## La sección de materia, que no estaba en el plano

La pediste durante el módulo. El Anexo C había descartado "una sección de
gramática con explicaciones" con dos razones: que el libro ya la tiene y que no
cabe en cinco minutos. Esa objeción venía de la auditoría de un compañero de
curso hipotético; el usuario principal la pidió, y el material que necesita es
el mismo que las fichas de 3.6 construyen igual. El costo marginal era una
pantalla, no contenido.

Entra por "Ver la materia": chips de unidad, patrones gramaticales con su línea
de uso, formas de conjugación, expresiones, verbos, vocabulario y palabras con
kanji. Cada patrón y cada forma abre su ficha. Los patrones llevan dos apartados
con título: "Cómo se construye" con la fórmula, y "En el libro" con las
oraciones y su traducción.

`src/js/55-material.js` es un archivo que no está en la lista del plano.
Devuelve solo datos: `fichaForma`, `fichaPatron` y `materiaDe`.

## Qué se hizo del módulo

### Exigencia escalonada por caja

El id, el registro y el programador no cambian: lo único que cambia es qué se
pide del mismo ítem. La conjugación es elección entre cuatro formas en la caja
0, escribir con pista en la 1, y escribir a secas desde la 2. El hueco elige
patrón entre cuatro en la caja 0, escribe con `hint` visible en la 1, y desde la
2 el `hint` desaparece y pasa a ser la pista del primer fallo. Un fallo devuelve
a la caja 0 y por tanto a la etapa de reconocimiento.

Los distractores de conjugación se generan con `conjugar` sobre copias del
verbo: el verbo tratado como del otro grupo, la fila て/た equivocada, la forma
vecina, y como último recurso la misma forma de otro verbo de la unidad. Para
のる en forma ます salen `のります` (correcta), `のきます`, `のます` y `のみます`.
Las 472 conjugaciones del Tema 8 producen al menos dos distractores distintos de
la correcta.

### Ítem de grupo del verbo

Uno por verbo, `g:<kana>`, elección entre grupo 1, 2 y 3. Comparte el cupo de
conjugación y va antes que las formas del mismo verbo, porque conjugar sin saber
el grupo es adivinar. La conjugación de un verbo no entra como ítem nuevo hasta
que su ítem de grupo se ha visto.

### Pista progresiva

El primer fallo ya no muestra la respuesta: muestra una pista según el tipo,
deja lo escrito en el campo y ofrece "Comprobar de nuevo" y "Ver respuesta". El
progreso se registra en ese primer fallo, porque el ítem no se sabía; el segundo
intento es aprendizaje y no toca el registro. En el marcador cuenta como fallado
aunque el segundo intento acierte, y el resumen lo lista aparte como recuperada
con pista.

Las pistas se calculan al construir la pregunta, no en el render, para que las
pruebas puedan verificarlas sin DOM. Las once del plano están implementadas.

### Fichas y tarjetas dentro de la sesión

La primera vez que la cola trae una forma de conjugación nunca vista se inserta
su ficha; lo mismo con los patrones. El vocabulario nuevo lleva su tarjeta de
presentación con lectura y significado. Ninguna cuenta como pregunta, ni registra
progreso, ni entra en el marcador: el contador dice "Pregunta 12 de 20" contando
solo preguntas, y la cabecera dice "Ficha" o "Palabra nueva" cuando toca una.

### Repaso al final y resumen neutro

Los fallados se preguntan una vez más al final, sin registrar progreso y sin
contar en el marcador. El resumen pasa a tres conteos —correctas, con pista,
falladas— sin porcentaje y sin las tres frases de juicio del archivo congelado.

## Dos correcciones al plano

**La cuenta de moras del plano está mal en su propio ejemplo.** La sección 3.2
dice que la pista de vocabulario es "primera mora de `kana` seguida de un guion
bajo por cada mora restante", y pone `くう＿＿＿` para くうこう. Son cuatro moras,
así que la primera más tres guiones es `く＿＿＿`. Implementé la regla, no el
ejemplo.

**El っ no es un kana pequeño para contar moras.** Los kana pequeños de yōon y
de vocal se pegan a la mora anterior —きゃ es una mora—, pero la pausa del っ es
una mora por derecho propio: がんばって son cinco, no cuatro. Lo tenía mal y la
prueba lo encontró.

## Un problema de la regla de las tres posiciones

El plano pide que la tarjeta de una palabra nueva quede al menos tres posiciones
antes de su pregunta. Lo natural es insertar la tarjeta donde iba la pregunta y
bajar la pregunta tres lugares, y eso es lo que escribí primero. Falla al final
de la cola: no hay tres posiciones donde bajarla, la separación se queda en una,
y la tarjeta y su pregunta quedan pegadas, que es justo lo que la regla existe
para evitar. Salió en la tanda completa de pruebas y no en la prueba aislada,
porque la cola se baraja.

La solución es al revés: la tarjeta sube tres posiciones y la pregunta se queda
donde está. Solo cuando la pregunta está en las tres primeras posiciones se
recurre a bajarla. Medido sobre 60 sesiones generadas, la regla se cumple en el
100% de las tarjetas de vocabulario.

Queda una holgura anotada en el código: una ficha de patrón puede quedar a menos
de tres posiciones de *otro* ejercicio del mismo patrón. Da igual, porque la
ficha explica el patrón y no revela la respuesta de ningún ejercicio. La tarjeta
de vocabulario sí la revela, y para esa la separación se cumple siempre.

## El material nuevo dejó de ser obligatorio

Patricio, tras probarlo: mostrarle la palabra o la ficha antes de preguntarla le
hace reconocer lo que acaba de ver en vez de recordarlo, y salir de la sesión
creyendo que sabe algo que solo recordaba. Es una objeción sólida: la exposición
inmediata anterior a la pregunta destruye justamente la recuperación que el
repaso espaciado mide.

La sección 3.5 del plano justificaba las tarjetas con el usuario secundario,
"quien no estudió la unidad antes de practicarla". Esa necesidad la cubre ahora
mejor la sección de materia, que no existía cuando se escribió el plano y que se
consulta a propósito.

Queda como ajuste en el menú, **apagado por defecto**: "Preguntármelo directo" o
"Mostrármelo antes". Un compañero de curso que reciba el archivo puede
encenderlo. Con él apagado la sesión son 20 preguntas y ninguna tarjeta.

Apagarlo no deja al usuario en frío, y esa es la razón por la que es seguro: la
exigencia escalonada de 3.6 ya hace que el primer encuentro con cualquier ítem
sea de reconocimiento. Un verbo empieza por elegir su grupo entre tres, una
conjugación por elegir la forma entre cuatro, un hueco por elegir el patrón, y
una palabra por elegir su significado entre cuatro. La primera exposición sigue
siendo suave; lo que se quita es la que regalaba la respuesta.

## Criterios de aceptación

| Criterio | Resultado |
|---|---|
| Una prueba sin DOM verifica el contenido de `pista1` para cada tipo | Las once filas de la tabla 3.2, con prueba propia por tipo. Más una prueba que recorre 200 ítems en las tres cajas y comprueba que ninguna pista contiene la respuesta entera |
| El progreso se marca en el primer fallo y no cambia en el segundo intento | Verificado en el navegador: tras el primer fallo el registro queda en caja 0, y el segundo intento correcto no lo toca |
| Los fallados reaparecen al final sin alterar el registro | Sesión de 3 armar fallados: los 3 vuelven marcados `repaso`, y responderlos bien deja el registro idéntico (`b=0 f=1 v=1` en los tres) |
| "La tenía bien" sigue disponible en el estado final | Sí, salvo en el segundo intento y en el repaso, donde no habría registro que restaurar |
| Toda palabra nueva tiene su tarjeta al menos tres posiciones antes | Sí, y ninguna palabra nueva se pregunta sin tarjeta previa. 0 incidencias en 60 sesiones |
| El resumen no muestra porcentaje ni frases de juicio | "23 correctas · 3 con pista · 1 fallada". Sin `%` y sin las tres frases del archivo congelado |
| Cada conjugación produce al menos dos distractores distintos de la correcta | Las 472 del Tema 8, sin repetidos y sin incluir la correcta |
| La etapa cambia con `b`: 0 → opción, 1 → escribir con pista, 2 → hueco sin pista | Verificado por tipo, y comprobado en el navegador con registros forzados |
| Cada forma y cada patrón del Tema 8 tiene ficha y se muestra una sola vez | Las 12 formas con ejemplo de los tres grupos, y los 21 patrones con uso, fórmula y ejemplo. Sin claves repetidas en la misma cola |

`node --test "pruebas/*.test.mjs"`: 82 pruebas, 81 en verde, 0 fallos, 1 marcada
`todo` (la de M5). Las 20 nuevas están en `pruebas/pistas.test.mjs`. La tanda se
corrió cuatro veces seguidas para descartar intermitencias del barajado.

## Lo que queda pendiente

Sigue en pie lo de M0: `FRASES[0]` no tiene variante en kana, y se corrige en M5.

Las fichas se pueden reabrir desde la pantalla de materia, pero **no** con un
toque en la etiqueta de la forma o del patrón dentro del enunciado, como sugiere
el final de 3.6. La sección de materia cubre el caso con creces y esa parte se
puede agregar en cualquier momento.

`sel.manuales` sigue sin incrementarse; es la señal de detección de la sección 10.

## Para aprobar

Falla a propósito un ítem de cada tipo y comprueba dos cosas: que la pista
sirve, y que no te revela la respuesta.
