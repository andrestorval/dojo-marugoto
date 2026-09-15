# Informe M7 — unidad 2, 家をさがす

Fecha: 2026-09-15. Plano: guion de §9.2 y fila M7 de la tabla.

**La unidad 2 valida con 0 errores.** Quedan 15 advertencias, todas de glosa.
La suite pasa a 92 de 92.

## De dónde salió

Topic 2 del libro, páginas 34 a 43, leídas una a una. 197 palabras y 40 verbos
en el índice; 11 kanji en el recuadro de p35; 5 patrones oficiales, los cinco
cubiertos.

| Huecos | Origen |
|---|---|
| h2-01 a h2-05 | p35, ejercicio 2 — el vocabulario de la casa y el barrio |
| h2-06 a h2-10 | p35, ejercicio 3 — los contrarios (高い⇔安い, せまい⇔広い…) |
| h2-11 a h2-14 | p36, ejercicio 2 — cómo se termina una frase: 〜けど, 〜なくて |
| h2-15 a h2-19 | p38 y p39 — 〜から y 〜けど、〜から |
| h2-20 a h2-23 | p41, 文2 — 〜ても con adjetivos |
| h2-24 a h2-28 | p41, 文3 (1) — 〜ば con adjetivos, ある y なら |
| h2-29 a h2-32 | p42, (2) — 〜ば con verbos |
| h2-33 a h2-36 | p42, (4) — ば y ても en la misma frase |
| h2-37 a h2-40 | los diálogos de p37-38 y los textos de p40 y p43 |

Clase 1 = p34-39 (dónde vivo, qué casa busco, por qué me decidí). Clase 2 =
p40-43 (los dos cuadros de gramática y los textos de la web).

## Lo que trae

| | |
|---|---|
| Patrones | 21 — 14 gramaticales y 7 expresiones |
| Formas de conjugación | 10, de ellas **2 nuevas** |
| Vocabulario | 96 palabras |
| Verbos | 31 |
| Huecos | 40, cinco de doble hueco |
| Armar la frase | 18 |
| Frases del libro | 29 |

529 preguntas para la unidad 2. El total de las cuatro unidades sube a
**2.348**, todas con id distinto.

## Las dos formas nuevas

| id | forma | de dónde | regla |
|---|---|---|---|
| `ba` | forma ば, la condicional | p41, 文3 | grupo 1: última sílaba a la fila え + ば (住む → 住めば); grupo 2: quita る + れば; する → すれば, くる → くれば |
| `temo` | 〜ても | p41, 文2 | forma て + も |

Las dos las enseña el libro tanto sobre adjetivos como sobre verbos: 広ければ,
高くなければ, 安全なら; 高くても, 不便でも, 明るくなくても. El conjugador solo
hace verbos, así que **los adjetivos van en los huecos**, que es donde el libro
los practica. La trampa de ば —que な y los sustantivos no llevan ば sino なら—
está en la fórmula del patrón y en dos huecos (h2-28, h2-36).

Los casos de prueba salen de la tabla じょうけんけい de p41 tal cual: すめば,
かえれば, あれば, たべれば, すれば. Más いっても, para que la excepción de 行く
llegue también a ても.

## Dos fallos del validador

**Dos verbos con el mismo kana.** かえる es 帰る (grupo 1, tema 2) y 変える
(grupo 2, tema 7), y el validador tomaba el primero que encontrara: acusó a 帰る
de estar en el grupo equivocado. Ahora, si hay varios candidatos y el verbo
trae kanji, gana el que comparte el primer kanji.

Y una corrección a algo que escribí en el informe de M6: dije que cuando un
verbo está en dos unidades «el juego de formas lo decide la unidad que lo
lista». No es así: **recibe la unión de las formas de las dos**. Lo comprobé
con がんばる, que tiene nueve formas de la unidad 1 más cinco de la 9. Está
corregido en `INFORME-M6.md` y en `DECISIONES.md`. Por eso 勤める está en la
unidad 2 (recuadro de kanji de p35) además de en la 9, sin pérdida.

## Un fallo del programador, y no era de esta unidad

Probando en el navegador, さがす salió dos veces seguidas en la misma sesión,
con dos formas. La regla de «una forma por verbo por sesión» existía, pero solo
dentro de cada tanda de nuevos: cuando la cola queda corta, el programador pide
una segunda tanda y esa empezaba de cero. Ahora la segunda tanda respeta lo que
la primera ya metió, para verbos y para palabras. Treinta sesiones simuladas:
cero repeticiones.

## Las 15 advertencias, que son tuyas

Todas son diferencias de glosa, y en todas elegí la acepción de la unidad:

- ところ "sitio" — el índice dice "lejos, lejano/a", que es un error del índice
  (confunde ところ con 遠い).
- 不便 "incómodo, mal comunicado" frente a "inconveniente/inútil": en este tema
  不便 es siempre de transporte o de compras.
- 交通 "transporte, comunicaciones" frente a "tráfico"; 生活 "la vida diaria"
  frente a "vivir"; たいへん "duro, difícil" frente a "muy, mucho".
- 広い, 明るい, 多い, 少ない, あたり, 買い物, 毎日, もし, だんだん, どんどん:
  matices de redacción.

Y los dos puntos previos de §9.2, que llegan después como en las anteriores:
el subconjunto de vocabulario (96 de 197: las 11 del recuadro de kanji, todos
los adjetivos con que se describe una casa, y lo que usan los diálogos y los
textos; fuera los nombres propios y lo elemental) y la clasificación de las
dos formas nuevas.

## Cobertura

- vocabulario del tema en el índice: 197 · en la app: 96 · sin cubrir: 101
- kanji del tema: 11 · sin cubrir: **0**
- patrones oficiales del tema: 5 · sin ningún ejercicio: **0**
- oraciones confirmadas en el corpus: 7 de 87 (8%) — el corpus cita poco de
  este tema; la confirmación fue leer las páginas

## Para aprobar

1. Lee `dist/validacion-u2.md` y dime qué glosas cambio.
2. Una sesión de 25 de la unidad 2 en el celular con el libro al lado. Fíjate
   sobre todo en los huecos de ば y ても con adjetivos: son los que más
   variantes de escritura admiten (ひろければ / 広ければ).

Quedan cinco unidades: 3, 4, 5, 6 y 7.
