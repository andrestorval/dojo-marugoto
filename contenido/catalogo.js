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
    uso:"La orden seca, sin cortesía. En la vida real: emergencias, letreros y gritos." }
];

/* --- CATEGORIAS -----------------------------------------------
   Nombres validos para el campo cat del vocabulario. En M5 el
   validador exige que cada una reuna al menos cuatro palabras.
--------------------------------------------------------------- */
CONTENIDO.categorias = [
  "viaje", "objetos", "hotel", "tiempo",
  "problemas", "lugar", "expresiones", "abstracto"
];
