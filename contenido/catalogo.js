/* Dojo Marugoto - catalogo de unidades, formas y categorias
   M0 compila una sola unidad. FORMAS conserva el campo c del archivo
   congelado; M2 lo traslada a UNIDADES[].formas (Anexo A del plano). */

const CONTENIDO = { unidades: [], formas: [], categorias: [] };

/* --- FORMAS QUE SE PRACTICAN ---------------------------------- */
CONTENIDO.formas = [
  { id:"masu",    label:"forma ます",          desc:"cortés, no-pasado",       c:[1,2] },
  { id:"masen",   label:"forma ません",        desc:"cortés, negativo",        c:[1,2] },
  { id:"nai",     label:"forma ない",          desc:"plano, negativo",         c:[1,2] },
  { id:"ta",      label:"forma た",            desc:"plano, pasado",           c:[1,2] },
  { id:"te",      label:"forma て",            desc:"conectiva",               c:[1,2] },
  { id:"nakatta", label:"forma なかった",      desc:"plano, pasado negativo",  c:[1] },
  { id:"sou",     label:"〜そうです",          desc:"dicen que… (forma simple + そうです)", c:[1] },
  { id:"atode",   label:"〜た後で",            desc:"después de…",             c:[1] },
  { id:"nagara",  label:"〜ながら",            desc:"mientras… (raíz de ます)",  c:[2] },
  { id:"tari",    label:"〜たり",              desc:"…y tal (forma た + り)",   c:[2] },
  { id:"pot",     label:"forma potencial",     desc:"poder…",                  c:[1] },
  { id:"imp",     label:"forma imperativa",    desc:"¡…! (命令形)",             c:[2] }
];

/* --- CATEGORIAS -----------------------------------------------
   Nombres validos para el campo cat del vocabulario. En M5 el
   validador exige que cada una reuna al menos cuatro palabras.
--------------------------------------------------------------- */
CONTENIDO.categorias = [
  "viaje", "objetos", "hotel", "tiempo",
  "problemas", "lugar", "expresiones", "abstracto"
];
