# Informe M13 — unidad 9, 仕事をさがす

Fecha: 2026-09-10. Plano: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`, guion de §9.2 y fila M13 de la tabla.

**La unidad 9 valida con 0 errores.** Quedan 23 advertencias, que son la lista
de revisión humana. La suite pasa a 89 de 89.

De paso, y sin tocar el contenido, la unidad 8 bajó de 33 advertencias a 22:
once de las suyas eran fallos del validador, no del Tema 8. Lo explico abajo.

## Por qué la 9 y no la 1

El plano fija el orden 1, 2, 3, 4, 5, 6, 7, 9 y su §8.6 dice que alterarlo es
decisión tuya y que basta con cambiar el número del próximo módulo, porque los
módulos de unidad son idénticos entre sí. Pediste que la 8 y la 9 quedaran como
versión final, y de ahí sale este módulo. El resto del orden no cambia: el
siguiente sigue siendo la unidad 1.

## De dónde salió el contenido

Esta es la primera unidad que no viene de un archivo congelado, y también la
primera que se escribe con el libro delante. `Marugoto A2B1.pdf` cambia el
panorama que dejaba M5: allí la conclusión era que con 3 patrones oficiales y
unas 5 oraciones en la guía de gramática **no se podía escribir la unidad 9 sin
inventarla**. Con el escaneo, las páginas 106 a 115 dan los ejercicios reales.

| Fuente | Qué aportó |
|---|---|
| Índice oficial de vocabulario | 79 palabras del Tema 9 con su glosa, 22 de ellas verbos |
| Índice oficial de kanji | los 8 del recuadro de p107 |
| Índice oficial de gramática | los 3 patrones 初中級 del tema, con su ejemplo |
| Libro escaneado, p106-115 | los ejercicios, los diálogos y los dos correos |

Los ejercicios son los del libro, no una invención:

| Huecos | Origen |
|---|---|
| h9-01 a h9-05 | p107, ejercicio 3 — los sustantivos que se vuelven verbo con します |
| h9-06 a h9-08 | p110, ejercicio 2 — 〜たら、〜たいと思っています, doble hueco |
| h9-09 a h9-16 | los diálogos de p109 (recepción) y p110 (la empresa de パク) |
| h9-17 a h9-22 | p113, ejercicio 2 — 〜ことができます |
| h9-23 a h9-27 | p114, ejercicio 3 — 〜より〜方が〜 |
| h9-28 a h9-34 | los correos de p112 y el de p115 |

El corte de clases es el del libro: la mitad de hablar (recepción y contar dónde
trabajas, p106-111) y la de leer (los tres patrones y los correos, p112-115).

## Lo que trae la unidad

| | |
|---|---|
| Patrones | 22 — 15 gramaticales y 7 expresiones de keigo |
| Formas de conjugación | 11, de ellas **4 nuevas** |
| Vocabulario | 72 palabras |
| Verbos | 42 |
| Huecos | 34 |
| Armar la frase | 18 |
| Frases del libro | 33, como ejemplos de las fichas, ya no como ejercicio |

Sale un total de 616 preguntas para la unidad 9 sola, y 1.310 con la 8 dentro.

## Las cuatro formas nuevas

El plano esperaba de una a tres formas conjugables por unidad; salieron cuatro.
Van al conjugador, a `SURU`, a `KURU`, a `EXC` y al catálogo de formas:

| id | forma | de dónde | regla |
|---|---|---|---|
| `tara` | 〜たら | p110, 文1 | forma た + ら |
| `tai` | 〜たいです | p110, 文1 | raíz de ます + たいです |
| `yasui` | 〜やすいです | p110, 働きやすいですよ | raíz de ます + やすいです |
| `koto` | 〜ことができます | p113, 文2 | forma diccionario + ことができます |

La potencial ya existía desde la unidad 8 y vuelve porque 文3 la necesita
(話せる, 働ける, 選べる).

`たら` sale de la forma て, así que hereda sus irregularidades: いく da いったら
y no いきたら. Hay una prueba que lo vigila.

**El vector congelado no puede cubrir estas formas**, porque no existen en el
archivo del que sale, y el plano prohíbe regenerarlo contra `src/`. Las cuatro
van fijadas a mano en `conjugador.test.mjs`, con un verbo regular por grupo, uno
de grupo 1 con て sonora (えらぶ → えらんだら) y los dos irregulares. Son las dos
pruebas nuevas que llevan la suite de 87 a 89.

## Tres fallos del validador que este módulo destapó

Los encontré leyendo el informe de la unidad 9 en vez de darlo por bueno, y los
tres afectaban también a la unidad 8.

**La tilde de onda son dos caracteres distintos.** El índice oficial escribe
`～` (U+FF5E) y el contenido `〜` (U+301C). Sin igualarlos, ni `〜ながら` se
encontraba a sí mismo en el índice de gramática, y `〜便`, `〜航空`, `〜部` y
`〜課` salían como "no aparece en el índice" estando ahí. Por eso el informe de
M5 decía que 3 de los 4 patrones oficiales del Tema 8 no tenían ningún
ejercicio: los tenía todos.

**Los sustantivos verbales no se encontraban.** El índice los escribe
`ほうこく（します）` y deja la columna de forma de diccionario en `（～する）`,
que no nombra ninguna palabra. La app usa `ほうこくする`. Eran 12 advertencias
en la unidad 9 y 7 en la 8, todas falsas.

**Un patrón cortés no es el mismo texto que uno llano.** Cuando el índice dice
`～ことができる` y el libro enseña `〜ことができます`, ninguna comparación por
texto los va a unir. Ahora el patrón puede declarar a mano a qué entrada oficial
corresponde, con el campo `oficial`. Lo usan cuatro patrones: dos de la unidad 9
y dos de la 8.

Resultado: unidad 8 de 33 a 22 advertencias y de "3 patrones oficiales sin
ejercicio" a 0; unidad 9 con los 8 kanji del tema cubiertos y los 3 patrones
oficiales con ejercicio.

**La cifra de 33 advertencias del informe de M5 quedó obsoleta.** Las que
quedan en la unidad 8 son 22 y ninguna de las once que desaparecieron era tuya.

## Dos fallos de la interfaz, arreglados

**El hueco pintaba `（（　　））`.** El contrato del contenido es que el `pre`
termine en `（` y el `post` empiece por `）` —el propio validador lo exige— y la
interfaz añadía otro par. Solo se veía en la etapa de reconocer el patrón, que
es la de la caja 0, así que llevaba ahí desde M3. Ahora pinta solo el blanco.

**El pie decía "Marugoto A2/B1 Parte 2 · Tema " y ahí se cortaba.** El `· Tema`
estaba escrito en el HTML y solo el número venía de JS, y la pantalla de primer
uso no lo escribía nunca. Ahora el segmento entero es del mismo hueco: o sale
completo o no sale.

**Y un residuo de haber quitado el modo "frase completa".** La lista de materia
seguía contando las frases como ejercicios y prometía una práctica que ya no
existe. Ahora cuenta huecos, y un patrón que no tenga ninguno dice cuántos
ejemplos trae en vez de "0 ejercicios".

## Las 23 advertencias, que son tuyas

Ninguna es un error. Son las dos preguntas del guion de §9.2 que no te pude
hacer antes de escribir, así que las dejo aquí:

**Veintiuna son diferencias de glosa** con el índice. En todas elegí la
acepción que la unidad usa y el índice da la general:

- Los seis kanji del recuadro de p107 los glosé como sustantivo y el índice como
  verbo: 輸入 "importación" frente a "importar", 報告 "informe, parte" frente a
  "comunicar, informar". Los puse como sustantivo porque así aparecen en el
  propio ejercicio: 食品の輸入をたんとうしています. El verbo está aparte.
- 広報 "comunicación, prensa" frente a "información pública, boletín oficial":
  en la lista de p109 es un departamento de una empresa, no un boletín.
- とくい "lo que a uno se le da bien" frente a "ser bueno/fuerte en algo".
- ふんいき "ambiente" frente a "atmósfera"; ていねい "cortés, cuidado" frente a
  "educado, formal"; きちんと "como es debido" frente a "ordenadamente".
- ただいま "ahora mismo" frente a "actualmente": en p109 es lo que dice quien
  atiende, y "actualmente" no encaja ahí.

Dime cuáles prefieres del índice y las cambio; las que dejes, quedan aceptadas
por escrito aquí.

**Dos son palabras que no están en el índice**: 働き方 y 就職活動. Las dos salen
literales del libro —「どんな働き方がいいですか」 en p114 y 「就職活動はたいへん
だと思います」 en p112— así que las dejé.

## Lo que el guion pide y no se hizo

El §9.2 tiene dos puntos de aprobación tuya **antes** de escribir, y este módulo
corrió de un tirón, así que llegan después:

1. **El subconjunto de vocabulario** (paso 1). De las 79 palabras del índice
   entraron 72, más 13 de temas anteriores que estas páginas usan sin parar
   (人間関係, 職場, 給料, ざんぎょう, 情報, 通訳...). Quedaron fuera nombres
   propios y palabras de función sueltas (あそこ, どの, ある). Quita o agrega lo
   que quieras.
2. **La clasificación de formas y patrones** (paso 2). Es la tabla de las cuatro
   formas nuevas de más arriba. Si alguna te parece que no da para ejercicio de
   conjugación, sale del conjugador y se queda solo como patrón.

También son tuyas las 22 líneas `uso` y las 22 `formula`, igual que en la
unidad 8: las redacté yo y hay que leerlas con el libro al lado.

## Cobertura

- vocabulario del tema en el índice: 79 · en la app: 72 · sin cubrir: 35
- kanji del tema: 8 · sin cubrir: **0**
- patrones oficiales del tema: 3 · sin ningún ejercicio: **0**
- verbos que se introducen en otro tema: 21 de 42 — lo esperable
- oraciones confirmadas en el corpus: 11 de 85 (13%)

Ese 13% no dice nada malo de la unidad. El corpus es la guía de gramática en
español, no el libro, y solo cita una selección; la unidad 8 daba 26% con las
mismas fuentes. Ahora que el libro escaneado está disponible, **la confirmación
de verdad fue leer las páginas**, que es de donde salieron los ejercicios.

## Para aprobar

1. Lee las 23 advertencias de `dist/validacion-u9.md` y dime qué glosas cambio.
2. Revisa la tabla de las cuatro formas nuevas.
3. Haz una sesión de 25 de la unidad 9 en el celular y mira si las pistas y las
   listas de respuestas aceptadas aguantan. Es donde suele fallar.
