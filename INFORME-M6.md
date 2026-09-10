# Informe M6 — unidad 1, スポーツの試合

Fecha: 2026-09-10. Plano: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`, guion de §9.2 y fila M6 de la tabla.

**La unidad 1 valida con 0 errores.** Quedan 13 advertencias, la lista de
revisión humana, y es la cifra más baja de las tres unidades escritas. La suite
pasa a 91 de 91.

## De dónde salió

Topic 1 del libro, páginas 24 a 33. Se leyeron una a una con
`herramientas/paginas.mjs`, igual que la unidad 9.

Es el tema más grande del libro y con diferencia: **207 palabras en el índice y
52 verbos**, contra las 79 y 22 del Tema 9. La razón no es que sea más denso,
sino que es el primero y el índice arrastra ahí todo lo básico (あります,
みます, かいます, わたし). Entró lo que estas diez páginas usan de verdad.

También es el que más gramática nueva trae: **siete patrones oficiales 初中級**,
frente a los tres del Tema 9 y los cuatro del Tema 8. Los siete están cubiertos.

| Huecos | Origen |
|---|---|
| h1-01 a h1-06 | p25, ejercicio 2 — el vocabulario del partido |
| h1-07 a h1-12 | p26, ejercicio 2 — 〜なら y 〜って言ってました |
| h1-13 a h1-19 | los diálogos de p27 (invitar y rechazar) y p28 (cancelar) |
| h1-20 a h1-23 | p31, ejercicio 2 — 〜なければなりません |
| h1-24 a h1-28 | p32, ejercicio 3 — la nominalización con さ |
| h1-29 a h1-32 | p32, ejercicio 4 — と／で／へ／から／まで + の |
| h1-33 a h1-38 | p29 (animar), p30 (la disculpa) y p33 (el correo de Shin) |

El corte de clases es el del libro: la mitad de hablar (p24-29: invitar,
rechazar, cancelar y animar) y la de leer (p30-33: los correos y los tres
últimos cuadros de gramática).

## Lo que trae la unidad

| | |
|---|---|
| Patrones | 23 — 16 gramaticales y 7 expresiones |
| Formas de conjugación | 13, de ellas **6 nuevas** |
| Vocabulario | 77 palabras |
| Verbos | 35 |
| Huecos | 38 |
| Armar la frase | 18 |
| Frases del libro | 34, como ejemplos de las fichas |

544 preguntas para la unidad 1 sola. Con las tres unidades, el total sube a
**1.844**, todas con id distinto.

## Las seis formas nuevas

Son más de las tres que el plano esperaba por unidad, y es porque el Tema 1
mete siete patrones oficiales de golpe:

| id | forma | de dónde | regla |
|---|---|---|---|
| `nara` | 〜なら | p26, 文1 | forma diccionario + なら |
| `tte` | 〜って言ってました | p26, 文1 | forma simple + って言ってました |
| `na` | 〜な, prohibitivo | p29, 応援のことば | forma diccionario + な |
| `meishi` | la raíz de ます como sustantivo | p32, 文3 | raíz de ます, y ahí se queda |
| `nakereba` | 〜なければなりません | p31, 文2 | forma ない sin la い + ければなりません |
| `nakya` | 〜なきゃいけません | p31, 文2 | forma ない sin la い + きゃいけません |

El **imperativo ya existía desde la unidad 8** (にげろ) y vuelve entero aquí,
que es donde tiene su sitio natural: がんばれ, もっと走れ, 行け, 勝て,
しっかりしろ. Con 〜な como su pareja negativa, las palabras de ánimo de p29
quedan completas.

`なければ` y `なきゃ` salen de la forma ない, así que heredan su trampa: en los
grupo 1 acabados en 〜う la sílaba va a わ y no a あ — さそう da
さそわなければなりません. Hay una prueba que lo vigila, y otra para くる, que
va de memoria (こなければなりません, no くなければ).

Las dos pruebas nuevas llevan la suite de 89 a 91.

## Un fallo del conjugador que la ficha destapó

El prohibitivo de grupo 2 **daba la respuesta correcta y la explicación
equivocada**. 忘れる → 忘れるな está bien, pero la regla decía «Grupo 2: quita
る y pon な», que describe 忘れな, que no existe. Venía de meter `na` en la
misma tabla que ます, ない y た, que sí siguen ese molde. Ahora `na` y `meishi`
tienen su propia línea.

Lo encontré mirando la ficha en el navegador, no en las pruebas: las pruebas
comparaban la salida del conjugador, que era correcta. Es exactamente el tipo
de cosa que el plano manda comprobar a ojo.

## El alias que llevaba mintiendo desde M0

Al añadir la unidad 1 se cayeron nueve pruebas de golpe. La causa:

```js
const TEMA   = UNIDADES[0] || UNIDAD_VACIA;
const VERBOS = TEMA.verbos;   // ...y VOCAB, FRASES, HUECOS, ARMAR
```

Eran los nombres que tenían los datos en el archivo congelado, cuando la app era
de una sola unidad. **Ninguna línea del motor los usa** —lo comprobé antes de
tocarlos—, pero estaban definidos como «la primera unidad», y las unidades se
cargan por número: mientras solo hubo la 8 y la 9, `UNIDADES[0]` era la 8. Con
la unidad 1 dentro pasó a ser la 1, y todo lo que decía «el Tema 8» empezó a
decir otra cosa sin avisar.

Se retiraron del motor. La pasarela de pruebas los arma ella, nombrando la
unidad 8 explícitamente, que es lo que esas pruebas siempre quisieron decir.

Aprovecho para dejar apuntado algo que descubrí de paso y conviene saber al
escribir las unidades que faltan: **el id de un verbo no lleva número de
unidad** (`g:はたらく`, `c:はたらく:masu`), y el pool deduplica por id. Un verbo
que dos unidades practican da una sola tarjeta, que es lo correcto, pero
significa que el juego de formas que recibe lo decide la unidad que lo lista.
がんばる y あきらめる están en la 9 y en la 1 a propósito: sin ellas, las
palabras de ánimo de p29 no se sostienen.

## Dos fallos más del validador, y otra vez bajan las tres unidades

Van cuatro módulos seguidos encontrando fallos en el validador leyendo sus
propios informes. Estos dos son de la misma familia que los de M13:

**El índice separa alternativas con ／ dentro de la misma celda.** `あの／あのう`,
`ごめんなさい／ごめん`, `やっぱり／やはり`, `にちようび／にち`. Cada lado es una
palabra por derecho propio, y el validador las trataba como una sola cadena, así
que ninguna se encontraba. Ahora se parte por ／.

**Los paréntesis marcan lo opcional, y puede haber más de uno.**
`だいじょ（う）ぶ（な）` son cuatro escrituras válidas, no dos: se generan todas
las combinaciones. Antes solo salían los extremos.

**Y la cobertura de kanji comparaba cadenas exactas.** `～対～（２対１）` no
encontraba a `〜対〜`, igual que `～便（115便）` no encontraba a `〜便` en la
unidad 8. Ahora usa las mismas variantes que el resto del validador.

Efecto: la unidad 1 baja de 18 advertencias a 13, y **la unidad 8 pasa a tener
sus 10 kanji cubiertos** — los dos que quedaban desde M5 estaban puestos, solo
que el validador no los reconocía.

## Las 13 advertencias, que son tuyas

Doce son diferencias de glosa, y en todas elegí la acepción que la unidad usa:

- プレー "juego, jugada" frente a "jugador" del índice. Aquí es lo segundo lo
  que está mal: en 長友選手のプレーのすばらしさ es la jugada, no el jugador.
- ざんねん "qué lástima" y だめ "no puede ser, no vale": son interjecciones en
  el diálogo de p27, no adjetivos de diccionario.
- ぜひ, すばらしい, かんたん, しょるい, さいご, スポーツ, ラグビー, ルール,
  やくそく: matices de redacción.

La decimotercera es una diferencia de escritura: el libro escribe 知りあい en
p28 y p30, y el índice 知り合い. Dejé la del libro.

## Lo que el guion pide y no se hizo

Igual que en M13, los dos puntos de aprobación previa de §9.2 llegan después:

1. **El subconjunto de vocabulario.** De las 207 del índice entraron 77. El
   criterio: las 8 del recuadro de kanji, las que salen en los diálogos y en
   los ejercicios, y las de los dos correos. Quedaron fuera los nombres propios
   y todo lo elemental que el índice arrastra por ser el tema 1 (わたし, きょう,
   はい, テレビ). Quita o agrega lo que quieras.
2. **La clasificación de las seis formas nuevas**, que es la tabla de arriba.

Y las 23 líneas `uso` y las 23 `formula` las redacté yo.

## Cobertura

- vocabulario del tema en el índice: 207 · en la app: 77 · sin cubrir: 147
- kanji del tema: 8 · sin cubrir: **0**
- patrones oficiales del tema: 7 · sin ningún ejercicio: **0**
- verbos que se introducen en otro tema: 1 de 35
- oraciones confirmadas en el corpus: **29 de 89 (33%)**

Ese 33% es el mejor de las tres unidades (la 8 daba 26%, la 9 un 13%), y tiene
explicación: la guía de gramática en español cita más del tema 1 que de los
últimos. Sigue sin probar nada por sí solo; la confirmación de verdad fue leer
las diez páginas.

## Para aprobar

1. Lee las 13 advertencias de `dist/validacion-u1.md` y dime qué glosas cambio.
2. Revisa la tabla de las seis formas nuevas.
3. Haz una sesión de 25 de la unidad 1 en el celular con el libro al lado.

## Lo que queda

Seis unidades: 2, 3, 4, 5, 6 y 7. El camino ya está rodado —leer las páginas,
cruzar con los índices, validar— y el validador tiene siete fallos menos que
cuando empezó M13.
