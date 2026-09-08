/* Dojo Marugoto - programador de sesion
   M1: la escalera de intervalos ya existe y `marcar` calcula `due`, pero la
   seleccion de sesion sigue siendo la por peso del archivo congelado.
   M2 reemplaza `pesado` por la seleccion por vencimiento y cupo de nuevos,
   amplia la escalera hasta el paso 7 y agrega el marcado manual (plano 2.2). */

/* paso 0 -> hoy, 1 -> 1 dia, 2 -> 3, 3 -> 7, 4 -> 14, 5 -> 30, 6 -> 60, 7 -> 120.
   Desde el paso 7 el intervalo se duplica en cada acierto con tope de 365.
   Escalera fija y no factor de facilidad por item: el factor solo aporta con
   historiales largos y con sesiones de veinte respuestas la diferencia
   practica es nula (plano 2.2). */
const ESCALERA = [0, 1, 3, 7, 14, 30, 60, 120];

function pesado(items){
  const con = items.map(it => ({ it, w: 5 - box(it.id) + Math.random()*1.5 }));
  con.sort((a,b) => b.w - a.w);
  return con.map(x => x.it);
}

function enClase(c){ return sel.clase === '0' || String(c) === sel.clase; }
