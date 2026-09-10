/* Dojo Marugoto - puente entre el contenido compilado y el motor
   Unico archivo de src/ que no existe en el archivo congelado. Da a las
   funciones del motor los mismos nombres globales que tenian cuando los
   datos vivian dentro del HTML, para que M0 no toque ni una linea de
   motor. M2 lo reemplaza por acceso por unidad. */

/* Con la build --sin-contenido, CONTENIDO llega vacio y el contenido real se
   carga una vez desde un archivo y queda en localStorage (plano 6.5). Se
   fusiona aqui, antes de que nadie lea las constantes de abajo. */
const LS_CONTENIDO = 'dojo-marugoto-contenido';
if(!CONTENIDO.unidades.length){
  try {
    const g = JSON.parse(localStorage.getItem(LS_CONTENIDO) || 'null');
    if(g && Array.isArray(g.unidades) && g.unidades.length){
      CONTENIDO.unidades.push.apply(CONTENIDO.unidades, g.unidades);
      CONTENIDO.formas = g.formas || [];
      CONTENIDO.categorias = g.categorias || [];
      if(g.migracion) CONTENIDO.migracion = g.migracion;
    }
  } catch(e){}
}

const UNIDADES   = CONTENIDO.unidades;
const FORMAS     = CONTENIDO.formas;
const CATEGORIAS = CONTENIDO.categorias;

/* Aqui vivian TEMA, VERBOS, VOCAB, FRASES, HUECOS y ARMAR, los nombres que
   tenian los datos en el archivo congelado, cuando la app era de una sola
   unidad. Se quitaron al entrar la unidad 1 (M6): ninguna linea del motor los
   usaba ya, y estaban definidos como UNIDADES[0], asi que en cuanto dejo de
   haber una sola unidad pasaron a apuntar a otra sin avisar. Todo lo que
   necesita datos de una unidad la busca por su numero en UNIDADES. */
