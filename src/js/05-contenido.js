/* Dojo Marugoto - puente entre el contenido compilado y el motor
   Unico archivo de src/ que no existe en el archivo congelado. Da a las
   funciones del motor los mismos nombres globales que tenian cuando los
   datos vivian dentro del HTML, para que M0 no toque ni una linea de
   motor. M2 lo reemplaza por acceso por unidad. */

const UNIDADES   = CONTENIDO.unidades;
const FORMAS     = CONTENIDO.formas;
const CATEGORIAS = CONTENIDO.categorias;

/* M0 compila una sola unidad; TEMA es esa unidad */
const TEMA   = UNIDADES[0];
const VERBOS = TEMA.verbos;
const VOCAB  = TEMA.vocab;
const FRASES = TEMA.frases;
const HUECOS = TEMA.huecos;
const ARMAR  = TEMA.armar;
