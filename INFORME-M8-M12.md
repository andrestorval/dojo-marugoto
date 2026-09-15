# Informe M8 a M12 — unidades 3, 4, 5, 6 y 7

Fecha: 2026-09-15. Cinco módulos de unidad en una tanda, con el mismo guion de
§9.2 que las anteriores. **Las nueve unidades del libro están escritas.**

| Unidad | Título | Páginas | Errores | Advertencias | Patrones | Formas nuevas | Palabras | Verbos | Huecos | Armar |
|---|---|---|---|---|---|---|---|---|---|---|
| 3 | ほっとする食べ物 | 44-53 | 0 | 12 | 21 | 2 | 83 | 11 | 28 | 16 |
| 4 | 訪問 | 54-63 | 0 | 8 | 18 | 2 | 82 | 26 | 32 | 16 |
| 5 | ことばを学ぶ楽しみ | 64-73 | 0 | 12 | 20 | 3 | 65 | 20 | 34 | 16 |
| 6 | 結婚 | 76-85 | 0 | 14 | 18 | 3 | 70 | 23 | 34 | 16 |
| 7 | なやみ相談 | 86-95 | 0 | 10 | 19 | 3 | 58 | 16 | 34 | 16 |

Todas con sus patrones oficiales cubiertos y sus kanji cubiertos. La suite pasa
a 93 de 93. El pool total de las nueve unidades es de **4.103 preguntas**,
todas con id distinto, y el catálogo tiene **37 formas de conjugación**.

Un detalle del libro que conviene saber: entre el tema 5 y el 6 hay dos páginas
que no son de ningún tema (p74-75, el test de mitad de curso). Por eso el tema
6 empieza en la 76 y no en la 74.

## Las trece formas nuevas

| Unidad | id | forma | regla |
|---|---|---|---|
| 3 | `naidesu` | 〜ないです | forma ない + です — el negativo hablado de la tabla de p52 |
| 3 | `sugi` | 〜すぎます | raíz de ます + すぎます |
| 4 | `tekureru` | 〜てくれました | forma て + くれました |
| 4 | `temorau` | 〜てもらいました | forma て + もらいました |
| 5 | `you` | いこうけい, la volitiva | grupo 1: última sílaba a la fila お + う; grupo 2: quita る + よう; する → しよう, くる → こよう |
| 5 | `sou2` | 〜そうです de aspecto | raíz de ます + そうです — distinto del そうです de «dicen que», que va con el verbo entero |
| 5 | `youni` | 〜ようになりました | forma diccionario + ようになりました |
| 6 | `teageru` | 〜てあげました | forma て + あげました |
| 6 | `nakutemo` | 〜なくてもいいです | forma ない sin la い + くてもいいです |
| 6 | `deshou` | 〜でしょう | forma simple + でしょう |
| 7 | `tehoshii` | 〜てほしいです | forma て + ほしいです |
| 7 | `naidehoshii` | 〜ないでほしいです | forma ない + でほしいです |
| 7 | `kamo` | 〜かもしれません | forma simple + かもしれません |

Para la volitiva hizo falta una tabla nueva (la fila お: いく → いこう); los
casos de prueba son los de la tabla いこうけい de p71 tal cual.

**Los verbos compuestos que terminan en いく** (つれていく, 持っていく) heredan
ahora la excepción de 行く: la forma て es つれていって, no つれていいて. Antes
el conjugador no lo sabía porque ninguna unidad los tenía.

## Lo que dice el índice y está mal

Me pediste que corrigiera el índice cuando estuviera equivocado. Estas son las
que corregí, con la glosa de la unidad delante y la del índice detrás:

- **ところ** "sitio" — el índice dice "lejos, lejano/a". Es un error: confunde
  ところ con 遠い.
- **プレー** "juego, jugada" — el índice dice "jugador". En 長友選手のプレーの
  すばらしさ es la jugada.
- **たいへん** "duro, difícil" — el índice dice "muy, mucho". Ese es 大変 como
  adverbio; en el libro es el adjetivo.
- **せいかく** "carácter" — el índice dice "vida cotidiana", que es 生活. En
  p85 es 性格: 自分とせいかくが合う人.
- **生活** "la vida diaria" — el índice dice "vivir", que es el verbo; aquí es
  el sustantivo.
- **不便** "incómodo, mal comunicado" — el índice dice "inconveniente/inútil".
  En todo el tema 2 es de transporte y compras.
- **交通** "transporte" — el índice dice "tráfico".
- **ふしぎ** "raro, curioso" — el índice dice "extraño, raro"; vale, pero en
  p70 (教科書のことばはぜんぜんおぼえられません。ふしぎ。) es «qué curioso».

Las demás advertencias son matices de redacción donde elegí la acepción de la
unidad, como en las anteriores.

## Lo que salió por el camino

**El validador ya no tuvo fallos nuevos.** Es la primera tanda en que las
advertencias que quedan son todas de contenido. Los siete fallos que se
arreglaron entre M13 y M7 cubrían lo que estas cinco unidades necesitaban.

**Los verbos compartidos.** Como el id de un verbo no lleva unidad y las
formas se suman, pude poner 勤める en la 2 y la 9, 座る en la 4 y la 8, 習う en
la 4 y la 5, y がんばる en la 1 y la 9, sin tarjeta repetida. Lo que sí evité
fueron los **homógrafos por kana**: 買う (comprar, u1) y 飼う (tener una mascota,
u2) se escriben igual en kana y tendrían el mismo id, así que 飼う no es verbo en
la unidad 2; va en el vocabulario y en los huecos. Lo mismo con 合う / 会う,
聞く (oír) / きく (notarse), ひく (coger un resfriado) / ひく (tocar el piano),
変える / 帰る, いる (estar) / いる (necesitar), かける (echar la llave) / かける
(dirigir la palabra).

## Cobertura, las cinco juntas

| Unidad | Índice | En la app | Kanji | Patrones oficiales | Corpus |
|---|---|---|---|---|---|
| 3 | 134 | 83 | 13 de 13 | 6 de 6 | — |
| 4 | 145 | 82 | 8 de 8 | 3 de 3 | — |
| 5 | 102 | 65 | 12 de 12 | 5 de 5 | — |
| 6 | 114 | 70 | 9 de 9 | 5 de 5 | — |
| 7 | 85 | 58 | 10 de 10 | 5 de 5 | — |

El corpus de la guía de gramática confirma pocas oraciones de estos temas, como
en la 9; la confirmación fue leer las páginas.

## Para aprobar

Lo mismo que en las anteriores, por cinco:

1. `dist/validacion-u3.md` a `dist/validacion-u7.md`: las glosas.
2. La tabla de las trece formas.
3. Una sesión de 25 por unidad en el celular con el libro al lado. Los huecos
   que más variantes admiten son los de la unidad 6 (あげる・くれる・もらう)
   y los de la 7 (〜のに con sustantivos: 新人なのに).

Con esto el plano queda cerrado en contenido: M0 a M13, las nueve unidades.
Lo que queda es uso, y lo que el uso diga.
