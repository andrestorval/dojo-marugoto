/* Dojo Marugoto - progreso y configuracion
   M0: el almacen sigue siendo dojo-marugoto-t8 con el registro {b,v,f}.
   M1 lo reemplaza por el almacen v2 con fechas. */

/* ═══════════ estado ═══════════ */
const LS = 'dojo-marugoto-t8';
let prog = {};
try { prog = JSON.parse(localStorage.getItem(LS) || '{}'); } catch(e){ prog = {}; }
function save(){ try{ localStorage.setItem(LS, JSON.stringify(prog)); }catch(e){} }
function box(id){ return (prog[id] && prog[id].b) || 0; }
function marcar(id, bien){
  const p = prog[id] || { b:0, v:0, f:0 };
  p.v++; if(bien){ p.b = Math.min(4, p.b+1); } else { p.b = 0; p.f++; }
  prog[id] = p; save();
}

/* ═══════════ configuracion ═══════════ */
let sel = { modos:['conj','hueco'], clase:'0', largo:15 };
try { const s = JSON.parse(localStorage.getItem(LS+'-cfg')||'null'); if(s) sel = s; } catch(e){}
function saveCfg(){ try{ localStorage.setItem(LS+'-cfg', JSON.stringify(sel)); }catch(e){} }
