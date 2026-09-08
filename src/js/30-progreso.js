/* Dojo Marugoto - progreso y configuracion
   M1: almacen v2 con fechas, migracion desde el Tema 8, exportar, importar y
   fusion. El programador todavia no usa `due`: la seleccion de sesion sigue
   siendo la del archivo congelado hasta M2 (plano 2.1 y 9.1). */

const LS       = 'dojo-marugoto-v2';
const LS_CFG   = 'dojo-marugoto-v2-cfg';
const LS_RESP  = 'dojo-marugoto-v2-respaldo';
const LS_T8    = 'dojo-marugoto-t8';        /* almacen de la app del Tema 8 */
const ESQUEMA  = 2;

/* Dia local como numero de dias desde 1970. Entero y no fecha ISO para poder
   comparar sin parsear. Se calcula una vez por sesion, de modo que una sesion
   que cruza la medianoche se cierra con el dia en que empezo (plano 2.1). */
function diaDe(ms){
  return Math.floor((ms - new Date(ms).getTimezoneOffset() * 60000) / 86400000);
}
const HOY = diaDe(Date.now());

function leerLS(clave){
  try { return JSON.parse(localStorage.getItem(clave) || 'null'); } catch(e){ return null; }
}
function escribirLS(clave, valor){
  try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch(e){ return false; }
}

/* ═══════════ registro por item ═══════════ */

function registroNuevo(dia){
  return { b:0, v:0, f:0, due:dia, int:0, man:0, last:0 };
}

/* Completa un registro que viene de una version anterior o de un archivo
   ajeno. `last:0` significa desconocido y pierde en la fusion contra
   cualquier registro con historial real (plano 4.3). */
function registroSano(r, dia){
  const p = registroNuevo(dia);
  if(!r || typeof r !== 'object') return p;
  const n = (x, d) => (Number.isFinite(+x) ? +x : d);
  p.b = Math.max(0, Math.min(7, n(r.b, 0)));
  p.v = Math.max(0, n(r.v, 0));
  p.f = Math.max(0, n(r.f, 0));
  p.int = Math.max(0, n(r.int, ESCALERA[p.b] || 0));
  p.due = n(r.due, dia + p.int);
  p.man = Math.max(0, n(r.man, 0));
  p.last = Math.max(0, n(r.last, 0));
  return p;
}

let prog = {};
function save(){ escribirLS(LS, prog); }
function box(id){ return (prog[id] && prog[id].b) || 0; }
function jubilado(id){ return esJubilado(prog[id]); }

/* Copia antes de tocar el registro. La usa "La tenia bien": el archivo
   congelado marcaba acierto sobre el registro ya penalizado, con lo que `f`
   quedaba incrementado y `b` subia desde 0 en vez de desde el valor previo
   (Anexo A del plano). */
function copiaDe(id){
  const r = prog[id];
  return r ? Object.assign({}, r) : null;
}
function restaurar(id, copia){
  if(copia) prog[id] = copia; else delete prog[id];
}

/* resultado in ok | casi | mal */
function marcar(id, resultado){
  prog[id] = transicion(prog[id] || registroNuevo(HOY), resultado, HOY);
  save();
}

function marcarAprendido(id){
  prog[id] = transicionManual(prog[id] || registroNuevo(HOY), HOY);
  save();
}
function desmarcarAprendido(id){
  if(!prog[id]) return;
  prog[id] = transicionDesmarcar(prog[id], HOY);
  save();
}

/* ═══════════ configuracion ═══════════ */

/* `largo` 20 son seis o siete minutos a un ritmo de 15 a 25 segundos por
   respuesta (plano 2.4). `unidades` vacio significa todas las listas.
   `primerUso` se apaga en cuanto el usuario contesta las dos preguntas del
   arranque, y no vuelve a preguntar (Anexo B). */
const CFG_BASE = {
  modos:['vocabJP','vocabES','conj','hueco','armar','frase'],
  clase:'0', largo:20, cupoNuevos:6, unidadActual:0, unidades:[],
  primerUso:true, manuales:0, matUnidad:0
};
let sel = Object.assign({}, CFG_BASE);
function saveCfg(){ escribirLS(LS_CFG, sel); }
function cargarCfg(c){
  if(c && typeof c === 'object') sel = Object.assign({}, CFG_BASE, c);
}

/* Unidad en curso por defecto: la mas alta que tenga contenido terminado. */
function unidadPorDefecto(){
  const listas = UNIDADES.filter(u => u.estado === 'lista').map(u => u.n);
  return listas.length ? Math.max.apply(null, listas) : 0;
}
function unidadActual(){
  return sel.unidadActual || unidadPorDefecto();
}

/* ═══════════ migracion desde el Tema 8 ═══════════ */

/* Traduce el almacen de la app antigua al registro v2. Los ids de vocabulario
   y conjugacion no cambian; los de frase, hueco y armar llevaban el indice
   posicional y se traducen con la tabla generada por claves.mjs sobre el orden
   congelado (plano 5.2 y 5.3). */
function migrarT8(progT8, cfgT8, dia){
  const ESCALERA_T8 = [0, 1, 3, 7, 14];
  const TABLA = (CONTENIDO && CONTENIDO.migracion) || null;
  const nuevo = {}; const perdidos = [];

  for(const id in (progT8 || {})){
    const r = progT8[id] || {};
    const p = id.indexOf(':');
    const t = id.slice(0, p);
    let idNuevo = id;

    if(t === 'h' || t === 'a' || t === 'f'){
      const i = +id.slice(p + 1);
      const k = TABLA && TABLA[t] && TABLA[t][i];
      if(!k){ perdidos.push(id); continue; }
      idNuevo = t + ':' + TABLA.unidad + ':' + k;
    } else if(t !== 'v' && t !== 'c'){
      perdidos.push(id); continue;
    }

    const paso = Math.max(0, Math.min(4, +r.b || 0));
    nuevo[idNuevo] = {
      b: paso, v: +r.v || 0, f: +r.f || 0,
      int: ESCALERA_T8[paso], due: dia + ESCALERA_T8[paso],
      man: 0, last: 0
    };
  }

  const c = cfgT8 || {};
  return {
    prog: nuevo,
    cfg: Object.assign({}, CFG_BASE, {
      modos: Array.isArray(c.modos) && c.modos.length ? c.modos : CFG_BASE.modos,
      clase: c.clase || '0',
      largo: Number.isFinite(+c.largo) ? +c.largo : CFG_BASE.largo,
      /* quien ya tenia historial no pasa por las preguntas del primer uso */
      primerUso: false
    }),
    perdidos
  };
}

/* ═══════════ exportar ═══════════ */

function nombreExportacion(dia){
  const d = new Date((dia + 0.5) * 86400000);
  const p = n => String(n).padStart(2, '0');
  return 'dojo-marugoto-progreso-' +
    d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate()) + '.json';
}

function exportar(){
  return {
    nombre: nombreExportacion(HOY),
    texto: JSON.stringify({
      app:'dojo-marugoto', esquema:ESQUEMA,
      exportado:new Date().toISOString(), hoy:HOY,
      prog, cfg:sel
    }, null, 1)
  };
}

/* ═══════════ importar ═══════════ */

/* Reconoce el esquema 2 (exportacion de esta app) y el esquema 1, que es el
   volcado plano del almacen del Tema 8 que produce el puente (plano 5.1). */
function leerExportacion(texto){
  let d;
  try { d = JSON.parse(texto); } catch(e){ return { error:'El archivo no es JSON válido.' }; }
  if(!d || typeof d !== 'object') return { error:'El archivo no tiene el formato esperado.' };

  if(d.esquema === 1 || (d.app === 'dojo-marugoto-t8')){
    const m = migrarT8(d.prog || {}, d.cfg, HOY);
    return { prog:m.prog, cfg:m.cfg, perdidos:m.perdidos, esquema:1, hoy:d.hoy };
  }
  if(d.app !== 'dojo-marugoto') return { error:'Ese archivo no es un progreso de Dōjō Marugoto.' };
  if(d.esquema !== ESQUEMA) return { error:'El archivo es de una versión distinta (esquema ' + d.esquema + ').' };
  if(!d.prog || typeof d.prog !== 'object') return { error:'El archivo no trae progreso.' };

  const limpio = {};
  for(const id in d.prog) limpio[id] = registroSano(d.prog[id], HOY);
  return { prog:limpio, cfg:d.cfg, perdidos:[], esquema:2, hoy:d.hoy };
}

/* Un reloj mal puesto o un huso distinto se avisa, no se bloquea. */
function desfase(hoyAjeno){
  if(!Number.isFinite(+hoyAjeno)) return 0;
  return Math.abs(+hoyAjeno - HOY);
}

/* Elige un registro completo, nunca suma campos: sumar `v` y `f` de dos
   dispositivos que registraron la misma sesion duplicaria el historial. */
function fusionar(local, importado){
  const out = {};
  const ids = new Set(Object.keys(local).concat(Object.keys(importado)));
  for(const id of ids){
    const a = local[id], b = importado[id];
    if(!b){ out[id] = a; continue; }
    if(!a){ out[id] = b; continue; }
    if(b.last !== a.last)      out[id] = b.last > a.last ? b : a;
    else if(b.v !== a.v)       out[id] = b.v > a.v ? b : a;
    else if(b.b !== a.b)       out[id] = b.b > a.b ? b : a;
    else                       out[id] = a;
  }
  return out;
}

function respaldar(){ escribirLS(LS_RESP, { prog, cfg:sel }); }
function hayRespaldo(){ return !!leerLS(LS_RESP); }

function aplicarImportacion(datos, reemplazar){
  respaldar();
  prog = reemplazar ? datos.prog : fusionar(prog, datos.prog);
  if(reemplazar && datos.cfg) cargarCfg(datos.cfg);
  save(); saveCfg();
}

function deshacerImportacion(){
  const r = leerLS(LS_RESP);
  if(!r) return false;
  prog = r.prog || {};
  cargarCfg(r.cfg);
  save(); saveCfg();
  try { localStorage.removeItem(LS_RESP); } catch(e){}
  return true;
}

/* ═══════════ arranque del almacen ═══════════ */

/* Vía A: si el almacen v2 no existe pero si el del Tema 8, la app corre en el
   mismo origen que la version antigua y puede traer el historial sola. Cuando
   no es asi (archivo abierto desde otra carpeta, PWA en un dominio) no hay
   nada que leer y la vía es el puente: puente-t8.html exporta y esta app
   importa (plano 5.1). La clave antigua queda intacta como respaldo. */
let avisoMigracion = null;

function iniciarProgreso(){
  const v2 = leerLS(LS);
  cargarCfg(leerLS(LS_CFG));

  if(v2){ prog = v2; return; }

  const t8 = leerLS(LS_T8);
  if(t8 && Object.keys(t8).length){
    const m = migrarT8(t8, leerLS(LS_T8 + '-cfg'), HOY);
    prog = m.prog;
    cargarCfg(m.cfg);
    save(); saveCfg();
    avisoMigracion = {
      items: Object.keys(m.prog).length,
      perdidos: m.perdidos
    };
    return;
  }
  prog = {};
}
