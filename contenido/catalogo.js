/* Dojo Marugoto - catalogo de unidades, formas y categorias
   FORMAS es global y ya no lleva el campo c: una forma no pertenece a una
   clase, sino a la clase de una unidad. Que unidad practica que formas lo
   dice UNIDADES[].formas (Anexo A del plano). */

const CONTENIDO = { unidades: [], formas: [], categorias: [] };

/* --- FORMAS QUE SE PRACTICAN ----------------------------------
   uso : una linea en espanol sobre cuando se usa la forma
   ej  : un verbo de referencia por grupo. La ficha de la forma arma sus
         ejemplos llamando a `conjugar` sobre ellos, sin texto que mantener.
         Si el verbo no esta en el contenido compilado, la ficha toma el
         primero de ese grupo que encuentre.

   Las lineas `uso` las redacte yo y las revisa Patricio con el libro al lado.
   Son una linea de cuando se usa, no una explicacion gramatical: para eso
   esta el libro.
--------------------------------------------------------------- */

/* verbos de referencia: regulares de su grupo y presentes en el Tema 8 */
const EJ = { 1: "のる", 2: "わすれる", 3: "とうちゃくする" };

CONTENIDO.formas = [
  { id:"masu",    label:"forma ます",          desc:"cortés, no-pasado", ej:EJ, lectura:"masu",
    uso:"Para hablar con cortesía en presente o futuro. Es la forma con la que se aprende cada verbo." },
  { id:"masen",   label:"forma ません",        desc:"cortés, negativo", ej:EJ, lectura:"masen",
    uso:"El negativo cortés: decir que algo no pasa o que no se hace." },
  { id:"nai",     label:"forma ない",          desc:"plano, negativo", ej:EJ, lectura:"nai",
    uso:"El negativo plano, entre cercanos. También es la base de otras construcciones." },
  { id:"ta",      label:"forma た",            desc:"plano, pasado", ej:EJ, lectura:"ta",
    uso:"El pasado plano. Sostiene 〜た後で, 〜たり y 〜たことがあります." },
  { id:"te",      label:"forma て",            desc:"conectiva", ej:EJ, lectura:"te",
    uso:"Une acciones en secuencia y sostiene medio idioma: 〜てください, 〜ている, 〜てもらう." },
  { id:"nakatta", label:"forma なかった",      desc:"plano, pasado negativo", ej:EJ, lectura:"nakatta",
    uso:"El pasado negativo plano: algo que no llegó a pasar." },
  { id:"sou",     label:"〜そうです",          desc:"dicen que… (forma simple + そうです)", ej:EJ, lectura:"sō desu",
    uso:"Para transmitir lo que dijo otra persona o lo que se anunció. Se pega a la forma simple." },
  { id:"atode",   label:"〜た後で",            desc:"después de…", ej:EJ, lectura:"〜たあとで · ta ato de",
    uso:"Para ordenar dos acciones: primero una y después la otra. El verbo va en forma た." },
  { id:"nagara",  label:"〜ながら",            desc:"mientras… (raíz de ます)", ej:EJ, lectura:"nagara",
    uso:"Dos acciones a la vez, de la misma persona. La acción principal va al final." },
  { id:"tari",    label:"〜たり",              desc:"…y tal (forma た + り)", ej:EJ, lectura:"tari",
    uso:"Para enumerar actividades sin agotar la lista: esto, aquello, y cosas así." },
  { id:"pot",     label:"forma potencial",     desc:"poder…", ej:EJ, lectura:"かのうけい · kanōkei",
    uso:"Para decir que se puede hacer algo, o que algo es posible." },
  { id:"imp",     label:"forma imperativa",    desc:"¡…! (命令形)", ej:EJ, lectura:"めいれいけい · meireikei",
    uso:"La orden seca, sin cortesía. En la vida real: emergencias, letreros y gritos." },
  { id:"tara",    label:"forma たら",          desc:"cuando… / si… (forma た + ら)", ej:EJ, lectura:"tara",
    uso:"Pone una condición o un momento futuro: cuando eso ocurra, entonces lo otro. Sale de la forma た." },
  { id:"tai",     label:"forma たい",          desc:"querer hacer… (raíz de ます + たい)", ej:EJ, lectura:"tai",
    uso:"El deseo propio: lo que uno quiere hacer. Se conjuga como un adjetivo い, no como un verbo." },
  { id:"yasui",   label:"〜やすい",            desc:"fácil de… (raíz de ます + やすい)", ej:EJ, lectura:"yasui",
    uso:"Dice que algo se hace con facilidad: 働きやすい, un sitio donde es fácil trabajar." },
  { id:"koto",    label:"〜ことができます",    desc:"poder… (forma diccionario + ことができます)", ej:EJ, lectura:"koto ga dekimasu",
    uso:"La otra manera de decir «poder», más formal que la potencial y sin cambiar el verbo." },
  { id:"nara",    label:"〜なら",              desc:"si es que… (forma diccionario + なら)", ej:EJ, lectura:"nara",
    uso:"Pone una condición retomando algo que el otro acaba de decir: si es ese el caso, entonces sí." },
  { id:"tte",     label:"〜って言ってました",   desc:"dijo que… (forma simple + って言ってました)", ej:EJ, lectura:"tte itte mashita",
    uso:"Repetir lo que otro dijo, en conversación. Es la versión hablada y llana de 〜と言っていました." },
  { id:"na",      label:"〜な (prohibitivo)",  desc:"¡no…! (forma diccionario + な)", ej:EJ, lectura:"きんしけい · kinshikei",
    uso:"La prohibición seca, la pareja del imperativo. En la grada: 負けるな, あきらめるな." },
  { id:"meishi",  label:"raíz de ます como sustantivo", desc:"el verbo hecho nombre", ej:EJ, lectura:"めいしか · meishika",
    uso:"La raíz de ます, sola, funciona como sustantivo: さそいます da さそい, «la invitación»." },
  { id:"nakereba", label:"〜なければなりません", desc:"hay que… (forma ない sin い + ければなりません)", ej:EJ, lectura:"nakereba narimasen",
    uso:"La obligación: no queda otra que hacerlo. Es la forma de escribir y de hablar con cuidado." },
  { id:"nakya",   label:"〜なきゃいけません",   desc:"hay que… (hablado)", ej:EJ, lectura:"nakya ikemasen",
    uso:"La misma obligación en la boca, no en el papel. なきゃ es なければ comido al hablar." },
  { id:"ba",      label:"forma ば (condicional)", desc:"si… (じょうけんけい)", ej:EJ, lectura:"じょうけんけい · jōkenkei",
    uso:"La condición: si pasa esto, entonces aquello. Grupo 1 cambia la última sílaba a la fila え y añade ば; grupo 2 quita る y pone れば." },
  { id:"temo",    label:"〜ても",                desc:"aunque… (forma て + も)", ej:EJ, lectura:"temo",
    uso:"Concede algo y sigue adelante: aunque sea así, da igual. Con adjetivos い es 〜くても; con な y sustantivos, 〜でも." },
  { id:"naidesu", label:"〜ないです",            desc:"no… (negativo cortés hablado)", ej:EJ, lectura:"nai desu",
    uso:"El negativo cortés de la conversación: forma ない + です. Dice lo mismo que 〜ません, con menos formalidad." },
  { id:"sugi",    label:"〜すぎます",            desc:"demasiado… (raíz de ます + すぎます)", ej:EJ, lectura:"sugimasu",
    uso:"Un exceso, siempre con matiz de queja: comí de más, bebí de más. Con adjetivos: 大きすぎます." },
  { id:"tekureru", label:"〜てくれました",        desc:"alguien lo hizo por mí (forma て + くれました)", ej:EJ, lectura:"te kuremashita",
    uso:"El favor visto desde quien lo recibe: me invitó, me lo escribió, me llevó. La persona que lo hizo lleva が." },
  { id:"temorau", label:"〜てもらいました",       desc:"conseguí que alguien lo hiciera (forma て + もらいました)", ej:EJ, lectura:"te moraimashita",
    uso:"El mismo favor contado desde quien lo pidió: le pedí que me lo explicara. La persona lleva に." },
  { id:"you",     label:"forma volitiva (いこうけい)", desc:"vamos a…, voy a… (いこう, たべよう, しよう)", ej:EJ, lectura:"いこうけい · ikōkei",
    uso:"La intención en llano: grupo 1 lleva la última sílaba a la fila お y añade う; grupo 2 quita る y pone よう. Es la base de 〜ようと思っています." },
  { id:"sou2",    label:"〜そうです（様態）",      desc:"parece que… (raíz de ます + そうです)", ej:EJ, lectura:"〜そうです（ようたい）· sō desu",
    uso:"Lo que se ve venir: parece que sacaré buena nota. Va con la raíz, no con el verbo entero; ese otro そうです es «dicen que»." },
  { id:"youni",   label:"〜ようになりました",      desc:"he llegado a… (forma diccionario + ようになりました)", ej:EJ, lectura:"yō ni narimashita",
    uso:"Un cambio conseguido con el tiempo: antes no, ahora sí. Con la potencial es «ya puedo»." },
  { id:"teageru", label:"〜てあげました",         desc:"lo hice por alguien (forma て + あげました)", ej:EJ, lectura:"te agemashita",
    uso:"El favor que uno hace a otro. La tercera pieza del trío あげる, くれる, もらう." },
  { id:"nakutemo", label:"〜なくてもいいです",     desc:"no hace falta… (forma ない sin la い + くてもいいです)", ej:EJ, lectura:"nakutemo ii desu",
    uso:"Lo que no es obligatorio: no hace falta hacerlo. Lo contrario de 〜なければなりません." },
  { id:"deshou",  label:"〜でしょう",              desc:"seguro que… (forma simple + でしょう)", ej:EJ, lectura:"deshō",
    uso:"Una suposición con bastante seguridad, casi siempre con きっと o たぶん delante. Sin cambiar el verbo." },
  { id:"tehoshii", label:"〜てほしいです",         desc:"quiero que alguien… (forma て + ほしいです)", ej:EJ, lectura:"te hoshii desu",
    uso:"El deseo sobre lo que hace otro: quiero que vuelva pronto, que respete las normas. La persona lleva に." },
  { id:"naidehoshii", label:"〜ないでほしいです",   desc:"quiero que alguien no… (forma ない + でほしいです)", ej:EJ, lectura:"naide hoshii desu",
    uso:"La misma petición en negativo: que no discuta, que no hable tanto por teléfono." },
  { id:"kamo",    label:"〜かもしれません",        desc:"puede que… (forma simple + かもしれません)", ej:EJ, lectura:"kamo shiremasen",
    uso:"Una posibilidad sin afirmar, más dubitativa que でしょう. Sin cambiar el verbo." }
];

/* --- CATEGORIAS -----------------------------------------------
   Nombres validos para el campo `cat` del vocabulario. El validador rechaza
   cualquier `cat` que no este aqui, y avisa si una reune menos de cuatro
   palabras en todo el libro: con menos, `distractores` cae en el resto del
   vocabulario y el ejercicio se resuelve por descarte.

   Esta lista sale del contenido real, no de una idea previa. En M0 la escribi
   de memoria y traia cuatro nombres que nadie usaba ("problemas", "lugar",
   "expresiones") mientras faltaban tres que si estaban en uso; el validador de
   M5 lo destapo con quince errores.

   Al agregar una unidad, ampliar aqui antes de usar un nombre nuevo.
--------------------------------------------------------------- */
CONTENIDO.categorias = [
  "viaje", "hotel", "objetos", "tiempo",
  "problema", "conector", "reaccion", "abstracto",
  /* Tema 9, 仕事をさがす */
  "trabajo", "empresa", "persona",
  /* Tema 1, スポーツの試合 */
  "deporte", "sentimiento", "correo",
  /* Tema 2, 家をさがす */
  "casa", "lugar", "cualidad",
  /* Tema 3, ほっとする食べ物 */
  "comida",
  /* Tema 5, ことばを学ぶ楽しみ */
  "estudio",
  /* Tema 6, 結婚 */
  "pareja"
];
