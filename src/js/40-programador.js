/* Dojo Marugoto - programador de sesion
   M0: la seleccion por peso del archivo congelado, tal cual.
   M2 la reemplaza por vencimiento y cupo de nuevos (plano 2.4). */

function pesado(items){
  const con = items.map(it => ({ it, w: 5 - box(it.id) + Math.random()*1.5 }));
  con.sort((a,b) => b.w - a.w);
  return con.map(x => x.it);
}

function enClase(c){ return sel.clase === '0' || String(c) === sel.clase; }
