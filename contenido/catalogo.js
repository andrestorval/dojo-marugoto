/* Dojo Marugoto - catalogo de unidades, formas y categorias
   FORMAS es global y ya no lleva el campo c: una forma no pertenece a una
   clase, sino a la clase de una unidad. Que unidad practica que formas lo
   dice UNIDADES[].formas (Anexo A del plano). */

const CONTENIDO = { unidades: [], formas: [], categorias: [] };

/* --- FORMAS QUE SE PRACTICAN ---------------------------------- */
CONTENIDO.formas = [
  { id:"masu",    label:"forma ます",          desc:"cortés, no-pasado" },
  { id:"masen",   label:"forma ません",        desc:"cortés, negativo" },
  { id:"nai",     label:"forma ない",          desc:"plano, negativo" },
  { id:"ta",      label:"forma た",            desc:"plano, pasado" },
  { id:"te",      label:"forma て",            desc:"conectiva" },
  { id:"nakatta", label:"forma なかった",      desc:"plano, pasado negativo" },
  { id:"sou",     label:"〜そうです",          desc:"dicen que… (forma simple + そうです)" },
  { id:"atode",   label:"〜た後で",            desc:"después de…" },
  { id:"nagara",  label:"〜ながら",            desc:"mientras… (raíz de ます)" },
  { id:"tari",    label:"〜たり",              desc:"…y tal (forma た + り)" },
  { id:"pot",     label:"forma potencial",     desc:"poder…" },
  { id:"imp",     label:"forma imperativa",    desc:"¡…! (命令形)" }
];

/* --- CATEGORIAS -----------------------------------------------
   Nombres validos para el campo cat del vocabulario. En M5 el
   validador exige que cada una reuna al menos cuatro palabras.
--------------------------------------------------------------- */
CONTENIDO.categorias = [
  "viaje", "objetos", "hotel", "tiempo",
  "problemas", "lugar", "expresiones", "abstracto"
];
