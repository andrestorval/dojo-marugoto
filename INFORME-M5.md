# Informe M5 — validador de contenido y revalidación del Tema 8

Fecha: 2026-09-10. Plano: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`, sección 7 y la fila M5 de la tabla 9.1.

Objetivo del módulo: leer los cuatro xlsx sin paquetes, extraer el corpus del
libro, escribir el validador y revalidar el Tema 8 corrigiendo lo que reporte.

**El Tema 8 valida con 0 errores.** Las 33 advertencias son la lista de revisión
humana. La suite pasa a 86 de 86, sin ninguna marcada `todo`.

## Las herramientas

`zip.mjs` recorre el directorio central y descomprime con `inflateRawSync`. Un
xlsx es un zip con XML y `zlib` viene con Node, así que leerlo cuesta ochenta
líneas y evita la primera dependencia del proyecto.

`indices.mjs` produce `fuentes-oficiales/indices.json`. Se corre una vez.

| Índice | Filas | Comprobación |
|---|---|---|
| Vocabulario | 1.291 | El plano decía 1.290. Por tema van de 79 a 207 palabras, exactamente el rango que el plano daba por verificado |
| Gramática | 392 | De ellas 43 son de nivel 初中級, que es el del libro |
| Kanji | 104 | 89 con tema asignado, que son los 89 del plano; las otras 15 son un apéndice sin tema |
| Frases | 47 | Ver más abajo |

Dos cuidados que no son obvios. Las cadenas compartidas del xlsx pueden venir
partidas en varios `<t>` y traer `<rPh>` con el furigana: eso hay que quitarlo
antes o el texto sale con la lectura pegada. Y las celdas vacías no aparecen en
el XML, así que hay que indexar por la referencia de la celda y no por posición.

## El índice de frases no es lo que el plano decía

El plano lo describía como "53 expresiones fijas con tema de aparición". Lo que
hay son 54 filas, la numeración llega a 31, la columna de tema trae valores
imposibles como 112 y 113, y la primera fila es basura.

No importa, y por eso no invertí más tiempo: **nada lo consume**. La tabla del
validador de 7.2 usa el índice de vocabulario, el de gramática, el de kanji y el
corpus. El propio plano ya había concluido en su sección 0 que este índice no
sirve para lo que se pensaba. Se extrae tal cual y queda ahí.

## El corpus del libro es mucho más pobre de lo previsto, y es estructural

Esto cambia lo que el validador puede afirmar, así que va con detalle.

`corpus.mjs` extrae el texto de `A2-B1-ES_rev.pdf` con `pdftotext`, que viene
con Git para Windows, y lo normaliza con las mismas funciones del motor. Salen
14.863 caracteres japoneses, troceados por tema.

El problema es qué archivo es ese. **No es el libro de texto: es la guía de
gramática en español**, que cita una selección de oraciones. El libro no está
entre los archivos disponibles y no va a estarlo: la Fundación Japón publica
gratis los índices, no el libro.

Medido contra las 68 oraciones de los ejercicios del Tema 8:

| Fuente | Oraciones confirmadas |
|---|---|
| PDF de la guía de gramática | 18 |
| Ejemplos del índice de gramática | 4 |
| Las dos juntas | **18 de 68 (26%)** |

El plano ponía el umbral de alarma en "más del 40% de no encontradas" (sección
10). Estamos en 74%, y no por un fallo de extracción: es el techo de lo que esas
fuentes contienen.

**Consecuencia, y es la decisión de diseño de este módulo:** encontrar una
oración prueba que está en el libro; no encontrarla no prueba nada. Por eso el
validador cuenta las confirmadas como **informe** y nunca como advertencia. Es
lo que el propio plano decía en 7.1 —"el corpus sirve para confirmar presencia,
nunca para afirmar ausencia"—, solo que su regla de 7.2 y su umbral de la
sección 10 suponían una cobertura que no existe.

## Lo que el validador encontró en el Tema 8

**16 errores, todos corregidos.**

Quince eran el mismo: `categoría desconocida`. En M0 escribí la lista
`CATEGORIAS` de memoria, sin mirar qué valores usaba el contenido. Puse cuatro
nombres que nadie usaba —"problemas", "lugar", "expresiones"— y me faltaban tres
que sí estaban en uso: "problema", "conector" y "reaccion". La lista ahora sale
del contenido real.

El decimosexto era el conocido: `FRASES[0]` sin ninguna variante en kana. Se le
agregaron las dos que faltaban. La prueba que lo vigilaba desde M0 estaba
marcada `todo`; ahora exige y pasa.

**Dos fallos míos en el propio validador**, que encontré leyendo sus resultados
en vez de darlos por buenos:

El índice usa los paréntesis para dos cosas distintas. `（飛びます）` significa
que la palabra se escribe en kana en el libro; `こしょう（します）` significa que
el する es opcional. Yo quitaba los signos pero dejaba el contenido, así que
`こしょう` nunca encontraba a `こしょう（します）`. Ahora cada entrada genera sus
variantes y basta con que una coincida.

Y la búsqueda caía a comparar solo por kana, que colisiona en homófonos: `火事`
("incendio") encontraba `家事` ("tareas domésticas") y el validador acusaba de
mala glosa a una palabra correcta. Ahora el match por kana solo vale si el kanji
también cuadra, y si no, avisa de que puede ser un homófono distinto.

**Una decisión de ruido.** Veinticinco de los 56 verbos del Tema 8 se introducen
en temas anteriores, y el validador generaba 25 advertencias por ello. No es una
anomalía: es cómo funciona el libro, que practica la gramática nueva sobre
verbos ya conocidos. Pasó a ser una línea de informe. Sin eso, las advertencias
que importan quedaban enterradas.

## Las 33 advertencias que quedan, que son tuyas

- **9 diferencias de glosa** con el índice oficial: "embarque" frente a
  "embarcar", "bolso" frente a "mochila, bolsa", "seguramente" frente a "quizá /
  tal vez". Ninguna es un error; hay que decidir cuál se queda.
- **17 palabras que no aparecen en el índice**, como `〜便`, `〜航空`, `到着時間`
  o `チェックイン`. Puede que el índice las escriba de otra forma o que vengan del
  material de clase y no del libro.
- El resto son detalles de estructura y de kanji.

## Cobertura del Tema 8

- Vocabulario del tema en el índice: 111. En la app: 64. Sin cubrir: 76.
- Kanji del tema: 10. Sin cubrir: 2, `～航空` y `～便`, que en el índice llevan un
  ejemplo pegado (`JF航空`, `115便`).
- Patrones oficiales del tema: 4. Sin ningún ejercicio: 3.

Ese último número parece malo y no lo es: el índice oficial solo lista 4
patrones para el Tema 8, mientras que el catálogo de la app tiene 21, sacados de
los ejercicios reales del libro. El validador compara nombres y no los reconoce.
Es información, no un defecto.

## Lo que este módulo deja visto para lo que viene

Al preparar el terreno para las unidades nuevas medí qué material existe para el
Tema 9, y conviene saberlo antes de empezarlo:

| | Tema 9 |
|---|---|
| Vocabulario en el índice | 79 palabras, 22 de ellas verbos |
| Kanji | 8 palabras |
| Patrones de gramática oficiales | **3** |
| Texto japonés en la guía de gramática | 977 caracteres, unas 5 oraciones |

El vocabulario, los verbos y los kanji salen enteros de los índices oficiales.
Las **oraciones de los ejercicios, no**: con 3 patrones y 5 oraciones no se
escriben 60 ejercicios sin inventarlos.

De dónde salieron los 68 del Tema 8: de `Japones\Clase 8\`, que tiene los PDF de
las páginas del libro. Hay carpeta `Clase 7` y `Clase 8`; **no hay `Clase 9`**.
Para escribir la unidad 9 con oraciones del libro hace falta ese material.

## Aceptado

**2026-09-10 — Patricio acepta las advertencias de la unidad 8 tal como
están.** No se cambia ninguna glosa: se quedan las de la unidad.

Ojo con la cifra: **ya no son 33, son 22.** Al escribir la unidad 9 (M13)
salieron tres fallos del propio validador que también afectaban a esta unidad
—la tilde de onda del índice no es la del contenido, los sustantivos verbales
no se encontraban, y un patrón cortés no es el mismo texto que uno llano— y
once de las 33 advertencias eran falsas. Con ellas se fue también el
«3 patrones oficiales sin ningún ejercicio» de la sección de cobertura: los
cuatro del Tema 8 están reconocidos. Nada de eso tocó el contenido de la
unidad 8. El detalle está en `INFORME-M13.md`.

## Para aprobar

Lee `dist/validacion-u8.md` y decide qué hacer con las 33 advertencias. Las que
aceptes tal como están, dilo y quedan aceptadas por escrito en el informe; las
que haya que corregir, corrígelas y vuelvo a validar.
