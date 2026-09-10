/* ══ 00-tablas.js ══ */
/* Dojo Marugoto - tablas del conjugador y del normalizador
   Todas las tablas constantes juntas y antes del codigo que las usa.
   Contenido literal del archivo congelado. */

/* ---------- conjugador ---------------------------------- */

const U2I = { う:'い', く:'き', ぐ:'ぎ', す:'し', つ:'ち', ぬ:'に', ぶ:'び', む:'み', る:'り' };
const U2A = { う:'わ', く:'か', ぐ:'が', す:'さ', つ:'た', ぬ:'な', ぶ:'ば', む:'ま', る:'ら' };
const U2E = { う:'え', く:'け', ぐ:'げ', す:'せ', つ:'て', ぬ:'ね', ぶ:'べ', む:'め', る:'れ' };
const TE1 = { う:'って', つ:'って', る:'って', む:'んで', ぶ:'んで', ぬ:'んで', く:'いて', ぐ:'いで', す:'して' };

const SURU = { masu:'します', masen:'しません', nai:'しない', nakatta:'しなかった',
               ta:'した', te:'して', nagara:'しながら', tari:'したり',
               pot:'できる', imp:'しろ', sou:'するそうです', atode:'した後で',
               tara:'したら', tai:'したいです', yasui:'しやすいです',
               koto:'することができます' };
const KURU = { masu:'きます', masen:'きません', nai:'こない', nakatta:'こなかった',
               ta:'きた', te:'きて', nagara:'きながら', tari:'きたり',
               pot:'こられる', imp:'こい', sou:'くるそうです', atode:'きた後で',
               tara:'きたら', tai:'きたいです', yasui:'きやすいです',
               koto:'くることができます' };

/* excepciones que no salen de la regla */
const EXC = {
  'いく': { te:'いって', ta:'いった', tari:'いったり', atode:'いった後で', tara:'いったら' },
  'ある': { nai:'ない', nakatta:'なかった', imp:'あれ' }
};

/* ---------- romaji -> kana ------------------------------- */

const RK = {
  kya:'きゃ',kyu:'きゅ',kyo:'きょ', sha:'しゃ',shu:'しゅ',sho:'しょ', sya:'しゃ',syu:'しゅ',syo:'しょ',
  cha:'ちゃ',chu:'ちゅ',cho:'ちょ', tya:'ちゃ',tyu:'ちゅ',tyo:'ちょ',
  nya:'にゃ',nyu:'にゅ',nyo:'にょ', hya:'ひゃ',hyu:'ひゅ',hyo:'ひょ',
  mya:'みゃ',myu:'みゅ',myo:'みょ', rya:'りゃ',ryu:'りゅ',ryo:'りょ',
  gya:'ぎゃ',gyu:'ぎゅ',gyo:'ぎょ', ja:'じゃ',ju:'じゅ',jo:'じょ', jya:'じゃ',jyu:'じゅ',jyo:'じょ',
  zya:'じゃ',zyu:'じゅ',zyo:'じょ', bya:'びゃ',byu:'びゅ',byo:'びょ', pya:'ぴゃ',pyu:'ぴゅ',pyo:'ぴょ',
  she:'しぇ', che:'ちぇ', je:'じぇ', tsa:'つぁ',tsi:'つぃ',tse:'つぇ',tso:'つぉ',
  fa:'ふぁ',fi:'ふぃ',fe:'ふぇ',fo:'ふぉ', fyu:'ふゅ',
  va:'ゔぁ',vi:'ゔぃ',vu:'ゔ',ve:'ゔぇ',vo:'ゔぉ',
  wi:'うぃ',we:'うぇ', di:'でぃ',du:'どぅ', ti:'てぃ', dyu:'でゅ',
  ka:'か',ki:'き',ku:'く',ke:'け',ko:'こ',
  sa:'さ',shi:'し',si:'し',su:'す',se:'せ',so:'そ',
  ta:'た',chi:'ち',tsu:'つ',tu:'つ',te:'て',to:'と',
  na:'な',ni:'に',nu:'ぬ',ne:'ね',no:'の',
  ha:'は',hi:'ひ',fu:'ふ',hu:'ふ',he:'へ',ho:'ほ',
  ma:'ま',mi:'み',mu:'む',me:'め',mo:'も',
  ya:'や',yu:'ゆ',yo:'よ',
  ra:'ら',ri:'り',ru:'る',re:'れ',ro:'ろ',
  wa:'わ',wo:'を',
  ga:'が',gi:'ぎ',gu:'ぐ',ge:'げ',go:'ご',
  za:'ざ',ji:'じ',zi:'じ',zu:'ず',ze:'ぜ',zo:'ぞ',
  da:'だ',de:'で',do:'ど',
  ba:'ば',bi:'び',bu:'ぶ',be:'べ',bo:'ぼ',
  pa:'ぱ',pi:'ぴ',pu:'ぷ',pe:'ぺ',po:'ぽ',
  a:'あ',i:'い',u:'う',e:'え',o:'お'
};

/* ---------- normalizacion -------------------------------- */

const VOCAL_DE = { 'ア':'あ','イ':'い','ウ':'う','エ':'え','オ':'お' };

/* fila vocálica de cada kana */
const FILA = {
    'あ':'あ','か':'あ','さ':'あ','た':'あ','な':'あ','は':'あ','ま':'あ','や':'あ','ら':'あ','わ':'あ','が':'あ','ざ':'あ','だ':'あ','ば':'あ','ぱ':'あ','ゃ':'あ',
    'い':'い','き':'い','し':'い','ち':'い','に':'い','ひ':'い','み':'い','り':'い','ぎ':'い','じ':'い','ぢ':'い','び':'い','ぴ':'い',
    'う':'う','く':'う','す':'う','つ':'う','ぬ':'う','ふ':'う','む':'う','ゆ':'う','る':'う','ぐ':'う','ず':'う','づ':'う','ぶ':'う','ぷ':'う','ゅ':'う','ゔ':'う',
    'え':'え','け':'え','せ':'え','て':'え','ね':'え','へ':'え','め':'え','れ':'え','げ':'え','ぜ':'え','で':'え','べ':'え','ぺ':'え',
    'お':'お','こ':'お','そ':'お','と':'お','の':'お','ほ':'お','も':'お','よ':'お','ろ':'お','ご':'お','ぞ':'お','ど':'お','ぼ':'お','ぽ':'お','ょ':'お'
};

/* la vocal con que se alarga cada fila: こう, けい */
const CHOON = { 'あ':'あ', 'い':'い', 'う':'う', 'え':'い', 'お':'う' };

const BASURA = /[\s　、。．，,\.!！?？「」『』（）()・…~〜ー\-]/g;

/* ══ 05-contenido.js ══ */
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

/* Sin contenido cargado, TEMA es un hueco con la forma correcta: la app tiene
   que poder pintar el inicio y ofrecer "Cargar contenido" sin reventar. */
const UNIDAD_VACIA = { n:0, titulo:'', es:'', paginas:null, estado:'vacia',
  formas:{}, verbos:[], vocab:[], frases:[], huecos:[], armar:[], patrones:[] };
const TEMA   = UNIDADES[0] || UNIDAD_VACIA;
const VERBOS = TEMA.verbos;
const VOCAB  = TEMA.vocab;
const FRASES = TEMA.frases;
const HUECOS = TEMA.huecos;
const ARMAR  = TEMA.armar;

/* ══ 10-conjugador.js ══ */
/* Dojo Marugoto - conjugador
   conjugar, conKanji, aceptadasDeConjugacion, reglaDe.
   Contenido literal del archivo congelado. */

function conjugar(v, forma) {
  const k = v.kana;

  if (v.g === 3) {
    if (k.endsWith('する')) return k.slice(0, -2) + SURU[forma];
    if (k.endsWith('くる')) return k.slice(0, -2) + KURU[forma];
    return k;
  }

  let out;

  if (v.g === 2) {
    const st = k.slice(0, -1);              // quita る
    switch (forma) {
      case 'masu':    out = st + 'ます'; break;
      case 'masen':   out = st + 'ません'; break;
      case 'nai':     out = st + 'ない'; break;
      case 'nakatta': out = st + 'なかった'; break;
      case 'ta':      out = st + 'た'; break;
      case 'te':      out = st + 'て'; break;
      case 'nagara':  out = st + 'ながら'; break;
      case 'tari':    out = st + 'たり'; break;
      case 'pot':     out = st + 'られる'; break;
      case 'imp':     out = st + 'ろ'; break;
      case 'sou':     out = k + 'そうです'; break;
      case 'atode':   out = st + 'た後で'; break;
      case 'tara':    out = st + 'たら'; break;
      case 'tai':     out = st + 'たいです'; break;
      case 'yasui':   out = st + 'やすいです'; break;
      case 'koto':    out = k + 'ことができます'; break;
    }
  } else {                                   // grupo 1
    const last = k.slice(-1);
    const st = k.slice(0, -1);
    const te = st + TE1[last];
    const ta = te.replace(/て$/, 'た').replace(/で$/, 'だ');
    switch (forma) {
      case 'masu':    out = st + U2I[last] + 'ます'; break;
      case 'masen':   out = st + U2I[last] + 'ません'; break;
      case 'nai':     out = st + U2A[last] + 'ない'; break;
      case 'nakatta': out = st + U2A[last] + 'なかった'; break;
      case 'ta':      out = ta; break;
      case 'te':      out = te; break;
      case 'nagara':  out = st + U2I[last] + 'ながら'; break;
      case 'tari':    out = ta + 'り'; break;
      case 'pot':     out = st + U2E[last] + 'る'; break;
      case 'imp':     out = st + U2E[last]; break;
      case 'sou':     out = k + 'そうです'; break;
      case 'atode':   out = ta + '後で'; break;
      case 'tara':    out = ta + 'ら'; break;
      case 'tai':     out = st + U2I[last] + 'たいです'; break;
      case 'yasui':   out = st + U2I[last] + 'やすいです'; break;
      case 'koto':    out = k + 'ことができます'; break;
    }
  }

  const e = EXC[k];
  if (e && e[forma] !== undefined) out = e[forma];
  return out;
}

/* proyecta la forma en kana sobre la escritura con kanji */
function conKanji(v, kanaConj) {
  if (!v.kanji || v.kanji === v.kana) return null;
  let i = 0;
  while (i < v.kanji.length && i < v.kana.length &&
         v.kanji[v.kanji.length - 1 - i] === v.kana[v.kana.length - 1 - i]) i++;
  const cabezaKanji = v.kanji.slice(0, v.kanji.length - i);
  const cabezaKana  = v.kana.slice(0, v.kana.length - i);
  if (!kanaConj.startsWith(cabezaKana)) return null;
  return cabezaKanji + kanaConj.slice(cabezaKana.length);
}

/* respuestas aceptadas para una conjugación: kana + kanji */
function aceptadasDeConjugacion(v, forma) {
  const kana = conjugar(v, forma);
  const kanji = conKanji(v, kana);
  const set = [kana];
  if (kanji && kanji !== kana) set.unshift(kanji);
  /* 後で también se escribe あとで */
  set.slice().forEach(x => {
    if (x.includes('後で')) set.push(x.replace('後で', 'あとで'));
  });
  return set;
}

/* explica el movimiento de sílaba, que es lo que de verdad cuesta */
function reglaDe(v, forma){
  if(v.g === 3) return 'Grupo 3: する y くる van de memoria.';
  if(v.g === 2){
    const mapa = { masu:'ます', masen:'ません', nai:'ない', nakatta:'なかった', ta:'た', te:'て',
                   nagara:'ながら', tari:'たり', pot:'られる', imp:'ろ', atode:'た後で',
                   tara:'たら', tai:'たいです', yasui:'やすいです' };
    if(forma === 'sou') return 'Grupo 2: forma diccionario + そうです.';
    if(forma === 'koto') return 'Grupo 2: forma diccionario + ことができます.';
    return 'Grupo 2: quita る y pon ' + (mapa[forma] || '') + '.';
  }
  const u = v.kana.slice(-1);
  if(forma === 'sou') return 'Grupo 1: forma diccionario + そうです.';
  if(forma === 'koto') return 'Grupo 1: forma diccionario + ことができます.';
  if(forma === 'nai' || forma === 'nakatta')
    return 'Grupo 1: ' + u + ' → ' + U2A[u] + (u === 'う' ? ' (う nunca pasa a あ)' : '') + ' + ' + (forma === 'nai' ? 'ない' : 'なかった') + '.';
  if(forma === 'masu' || forma === 'masen' || forma === 'nagara' || forma === 'tai' || forma === 'yasui')
    return 'Grupo 1: ' + u + ' → ' + U2I[u] + ' + ' +
      ({ nagara:'ながら', masu:'ます', masen:'ません', tai:'たいです', yasui:'やすいです' })[forma] + '.';
  if(forma === 'pot') return 'Grupo 1: ' + u + ' → ' + U2E[u] + ' + る.';
  if(forma === 'imp') return 'Grupo 1: ' + u + ' → ' + U2E[u] + '.';
  if(forma === 'te' || forma === 'ta' || forma === 'tari' || forma === 'atode' || forma === 'tara'){
    const te = TE1[u], ta = te.replace(/て$/,'た').replace(/で$/,'だ');
    return 'Grupo 1: ' + u + ' → ' + (forma === 'te' ? te : ta) + (forma === 'tara' ? ' + ら' : '') + '.';
  }
  return '';
}

/* ══ 20-normalizador.js ══ */
/* Dojo Marugoto - normalizador
   romaji a kana, katakana a hiragana, choon, vocales largas
   y comparacion. Contenido literal del archivo congelado. */

function romajiAKana(txt) {
  let s = txt.toLowerCase()
    .replace(/ā/g,'aa').replace(/ī/g,'ii').replace(/ū/g,'uu')
    .replace(/ē/g,'ee').replace(/ō/g,'ou')
    .replace(/â/g,'aa').replace(/î/g,'ii').replace(/û/g,'uu')
    .replace(/ê/g,'ee').replace(/ô/g,'ou');
  let out = '', i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (!/[a-z'\-]/.test(ch)) { out += ch; i++; continue; }
    /* ん */
    if (ch === 'n') {
      if (s[i+1] === "'" || s[i+1] === '-') { out += 'ん'; i += 2; continue; }
      if (s[i+1] === 'n') { out += 'ん'; i += 1; continue; }
      if (!s[i+1] || !/[aiueoy]/.test(s[i+1])) { out += 'ん'; i++; continue; }
    }
    /* っ  (consonante doble, salvo n) */
    if (ch === s[i+1] && /[bcdfghjkmpqrstvwxyz]/.test(ch)) { out += 'っ'; i++; continue; }
    let hecho = false;
    for (let len = 3; len >= 1; len--) {
      const trozo = s.substr(i, len);
      if (RK[trozo]) { out += RK[trozo]; i += len; hecho = true; break; }
    }
    if (!hecho) { out += ch; i++; }
  }
  return out;
}

function kataAHira(s) {
  return s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/* ー se convierte en la vocal de la sílaba anterior */
function expandirChoon(s) {
  let out = '';
  for (const c of s) {
    if ((c === 'ー' || c === '－' || c === '—') && out.length) {
      out += FILA[out[out.length - 1]] || '';
    } else out += c;
  }
  return out;
}

/* quita las vocales de alargamiento: すうつけえす → すつけす, そうです → そです */
function quitarLargas(s) {
  let out = '';
  for (const c of s) {
    const prev = out[out.length - 1];
    const fila = prev ? FILA[prev] : null;
    if (fila && /[あいうえお]/.test(c) && (c === fila || c === CHOON[fila])) continue;
    out += c;
  }
  return out;
}

/* nivel estricto: acepta kana, kanji o rōmaji, pero exige la lectura exacta */
function normEstricta(s) {
  if (!s) return '';
  let t = s.trim();
  if (/[a-zA-Zāīūēō]/.test(t) && !/[぀-ヿ一-龯]/.test(t)) t = romajiAKana(t);
  t = kataAHira(t);
  t = expandirChoon(t);
  return t.replace(BASURA, '');
}

/* nivel tolerante: además colapsa vocales largas (すうつけえす = すつけす) */
function normSuelta(s) {
  return quitarLargas(normEstricta(s));
}

/**
 * Compara la respuesta del usuario contra la lista de aceptadas.
 * Devuelve { estado: 'ok' | 'casi' | 'mal', modelo }
 *  - ok   : coincide exactamente (en kana, kanji o rōmaji)
 *  - casi : coincide salvo vocales largas / kana pequeño
 */
function revisar(usuario, aceptadas) {
  const u = normEstricta(usuario);
  if (!u) return { estado: 'mal', modelo: aceptadas[0] };
  for (const a of aceptadas) {
    if (normEstricta(a) === u) return { estado: 'ok', modelo: a };
  }
  const us = normSuelta(usuario);
  for (const a of aceptadas) {
    if (normSuelta(a) === us) return { estado: 'casi', modelo: a };
  }
  return { estado: 'mal', modelo: aceptadas[0] };
}

/* ══ 30-progreso.js ══ */
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
  modos:['vocabJP','vocabES','conj','hueco','armar'],
  clase:'0', largo:20, cupoNuevos:6, unidadActual:0, unidades:[],
  primerUso:true, manuales:0, matUnidad:0,
  /* Mostrar la palabra o la ficha antes de preguntarla ayuda a quien no
     estudio la unidad, pero al usuario que si la estudio le regala la
     respuesta: reconoce lo que acaba de ver en vez de recordarlo, y sale de
     la sesion creyendo que sabe algo que solo recordaba. Apagado por defecto;
     el material sigue disponible en "Ver la materia", cuando se busca a
     proposito (plano 3.5, corregido por Patricio). */
  presentaciones:false
};
let sel = Object.assign({}, CFG_BASE);
function saveCfg(){ escribirLS(LS_CFG, sel); }
const MODOS_VALIDOS = ['vocabES', 'vocabJP', 'conj', 'hueco', 'armar'];

function cargarCfg(c){
  if(c && typeof c === 'object') sel = Object.assign({}, CFG_BASE, c);
  /* Una configuracion guardada antes puede traer modos que ya no existen,
     como el retirado "frase": se limpian para que el menu y los conteos
     cuadren con lo que de verdad se practica. */
  sel.modos = (sel.modos || []).filter(m => MODOS_VALIDOS.includes(m));
  if(!sel.modos.length) sel.modos = MODOS_VALIDOS.slice();
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

/* ══ 40-programador.js ══ */
/* Dojo Marugoto - programador de repaso espaciado
   Escalera de intervalos, transiciones por resultado, marcado manual y
   seleccion de la sesion (plano 2.2 a 2.5). */

/* paso 0 -> hoy, 1 -> 1 dia, 2 -> 3, 3 -> 7, 4 -> 14, 5 -> 30, 6 -> 60, 7 -> 120.
   Desde el paso 7 el intervalo se duplica en cada acierto con tope de 365.
   Escalera fija y no factor de facilidad por item: el factor solo aporta con
   historiales largos y con sesiones de veinte respuestas la diferencia
   practica es nula (plano 2.2). */
const ESCALERA = [0, 1, 3, 7, 14, 30, 60, 120];
const TOPE_INTERVALO = 365;
const PASO_MAX = 7;

/* Marcado manual: el item no desaparece, se va al intervalo mas largo de la
   escalera y sigue en el calendario. Un fallo lo devuelve al programador
   normal (plano 2.3 y 8.4). */
const MAN_PASO = 7, MAN_INT = 120;
const DESMAN_PASO = 4, DESMAN_INT = 14;

/* Muta el registro segun el resultado. Es la unica funcion que decide cuando
   vuelve un item. */
function transicion(r, resultado, dia){
  r.v++; r.last = dia;
  if(resultado === 'ok'){
    if(r.b < PASO_MAX){ r.b++; r.int = ESCALERA[r.b]; }
    else { r.int = Math.min(r.int * 2, TOPE_INTERVALO); }
    r.due = dia + r.int;
  } else if(resultado === 'casi'){
    /* no promueve y no castiga, pero reprograma: si no, el item queda
       vencido de forma permanente */
    r.int = Math.max(1, r.int);
    r.due = dia + r.int;
  } else {
    /* Un fallo tras 60 dias merece reconstruirse desde el principio, y
       suavizarlo exigiria un campo de lapsos para no premiar el olvido.
       due = hoy hace que vuelva al final de la misma sesion y que aparezca
       vencido en la siguiente. */
    r.f++; r.b = 0; r.int = 0; r.due = dia; r.man = 0;
  }
  return r;
}

function transicionManual(r, dia){
  r.man = dia; r.b = MAN_PASO; r.int = MAN_INT; r.due = dia + MAN_INT;
  return r;
}
function transicionDesmarcar(r, dia){
  r.man = 0; r.b = DESMAN_PASO; r.int = DESMAN_INT; r.due = dia + DESMAN_INT;
  return r;
}

const esJubilado = (r) => !!(r && r.man);

/* ═══════════ orden de entrada de items nuevos ═══════════ */

/* Reparto por defecto de un cupo de 6. Un orden estricto por tipo produce
   semanas de solo vocabulario antes de la primera conjugacion (Anexo C), asi
   que el cupo se reparte y lo que un tipo no usa pasa al siguiente. */
const REPARTO = [
  { tipos:['vocabJP', 'vocabES'], parte: 2 },
  { tipos:['grupo', 'conj'],      parte: 2 },
  { tipos:['hueco'],              parte: 1 },
  { tipos:['armar'],              parte: 1 }
];

/* Unidades ordenadas desde la que se cursa hacia abajo y despues hacia
   arriba: lo util para la clase en curso es la unidad en curso y, despues, lo
   recien visto (plano 2.5). */
function ordenUnidades(unidadActual){
  const ns = UNIDADES.map(u => u.n);
  const abajo = ns.filter(n => n <= unidadActual).sort((a,b) => b - a);
  const arriba = ns.filter(n => n > unidadActual).sort((a,b) => a - b);
  return abajo.concat(arriba);
}

/* Un item nuevo solo entra si lo que lo precede ya se vio: sin esto la app
   pide producir antes de reconocer.

   La condicion se exige solo cuando el requisito esta en el pool de esta
   sesion. Un porton que no puede abrirse no es un porton, es un muro: si el
   usuario pidio en el menu solo "vocabulario escribir", o si los huecos de la
   unidad todavia no llevan `pat` (lo agrega M3), la regla no debe dejar la
   sesion vacia. */
function dependenciaCumplida(q, idsPool){
  const enPool = (id) => !idsPool || idsPool.has(id);

  if(q.modo === 'vocabES'){
    /* una palabra entra a escribir cuando ya se vio en reconocer */
    const req = 'v:' + q.jp + ':jp';
    return !enPool(req) || !!prog[req];
  }
  if(q.modo === 'conj'){
    /* conjugar sin saber el grupo es adivinar: primero el item de grupo */
    const req = 'g:' + q.kana;
    return !enPool(req) || !!prog[req];
  }
  return true;
}

/* Ordena los candidatos nuevos y reparte el cupo entre tipos. Dentro de una
   unidad, primero clase 1; dentro de una clase, el orden de autoria. No hay
   azar aqui: el azar entra en el barajado final de la cola. */
function ordenEntrada(nuevos, cupo, unidadActual, idsPool){
  const orden = ordenUnidades(unidadActual);
  const pos = (q) => {
    const iu = orden.indexOf(q.unidad);
    return (iu < 0 ? 99 : iu) * 1000 + (q.clase === 2 ? 500 : 0) + Math.min(q.orden || 0, 499);
  };

  const candidatos = nuevos.filter(q => dependenciaCumplida(q, idsPool)).sort((a,b) => pos(a) - pos(b));
  const elegidos = [];
  const verbosUsados = new Set();
  const palabrasUsadas = new Set();

  const tomar = (tipos, cuantos) => {
    let n = 0;
    for(const q of candidatos){
      if(n >= cuantos) break;
      if(elegidos.includes(q)) continue;
      if(!tipos.includes(q.modo)) continue;
      /* una sola forma por verbo por sesion: un verbo nuevo no entra con sus
         nueve formas de golpe */
      if(q.modo === 'conj' || q.modo === 'grupo'){
        if(verbosUsados.has(q.kana)) continue;
        verbosUsados.add(q.kana);
      }
      /* y una sola cara por palabra: reconocer y escribir no entran juntas */
      if(q.modo === 'vocabES' || q.modo === 'vocabJP'){
        if(palabrasUsadas.has(q.jp)) continue;
        palabrasUsadas.add(q.jp);
      }
      elegidos.push(q); n++;
    }
    return n;
  };

  /* primera vuelta con el reparto; lo que sobra se reparte en una segunda */
  let libre = cupo;
  for(const r of REPARTO){
    const pedir = Math.min(r.parte, libre);
    if(pedir > 0) libre -= tomar(r.tipos, pedir);
  }
  if(libre > 0) tomar(REPARTO.flatMap(r => r.tipos), libre);
  return elegidos;
}

/* ═══════════ seleccion de la sesion ═══════════ */

function baraja(a){ const r = a.slice(); for(let i=r.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }

/* Devuelve { cola, vencidas, nuevas, atrasados, bloqueaNuevos }.
   El tope por atraso evita que una semana sin practicar produzca una sesion
   de doscientas preguntas: la sesion sigue midiendo `largo`, el inicio informa
   cuantas quedan y el atraso se absorbe en varios dias (plano 2.4). */
function seleccionar(pool, largo, cupoNuevos, unidadActual, dia){
  const conRegistro = pool.filter(q => prog[q.id]);
  const vencidos = conRegistro
    .filter(q => prog[q.id].due <= dia)
    .sort((a,b) => (prog[a.id].due - prog[b.id].due) || (prog[a.id].b - prog[b.id].b));
  const adelantados = conRegistro
    .filter(q => prog[q.id].due > dia && prog[q.id].due <= dia + 3)
    .sort((a,b) => prog[a.id].due - prog[b.id].due);
  const nuevos = pool.filter(q => !prog[q.id]);
  const idsPool = new Set(pool.map(q => q.id));

  const tope = largo > 0 ? largo : pool.length;
  let cola = [], bloqueaNuevos = false, nuevasEnCola = 0;

  if(vencidos.length >= tope){
    cola = vencidos.slice(0, tope);
    bloqueaNuevos = true;
  } else {
    cola = vencidos.slice();
    const cupo = Math.min(cupoNuevos, tope - cola.length);
    const entran = cupo > 0 ? ordenEntrada(nuevos, cupo, unidadActual, idsPool) : [];
    cola = cola.concat(entran);
    nuevasEnCola = entran.length;
    if(cola.length < tope) cola = cola.concat(adelantados.slice(0, tope - cola.length));
    if(cola.length < tope){
      const mas = ordenEntrada(nuevos.filter(q => !entran.includes(q)), tope - cola.length, unidadActual, idsPool);
      cola = cola.concat(mas);
      nuevasEnCola += mas.length;
    }
  }

  return {
    cola: baraja(cola),
    vencidas: vencidos.length,
    nuevas: nuevasEnCola,
    atrasados: Math.max(0, vencidos.length - cola.length),
    bloqueaNuevos
  };
}

/* Cuenta lo que habria en una sesion de hoy, sin armarla. Lo usa el inicio
   para el subtitulo del boton principal. */
function panorama(pool, largo, cupoNuevos, unidadActual, dia){
  const vencidas = pool.filter(q => prog[q.id] && prog[q.id].due <= dia).length;
  const tope = largo > 0 ? largo : pool.length;
  const bloquea = vencidas >= tope;
  const nuevas = bloquea
    ? 0
    : ordenEntrada(pool.filter(q => !prog[q.id]), Math.min(cupoNuevos, tope - vencidas),
                   unidadActual, new Set(pool.map(q => q.id))).length;
  return { vencidas, nuevas, bloquea, total: pool.length };
}

/* ══ 50-preguntas.js ══ */
/* Dojo Marugoto - construccion de preguntas
   `armarPool` recorre las unidades pedidas y devuelve una pregunta por item;
   quien decide cuales entran a la sesion es el programador (40). */

/* --- distractores del mismo campo semántico -------------------
   Sin esto, las opciones se descartan por sentido común y el
   ejercicio no mide nada. Tres anillos y una regla:
   1. Primero palabras de la misma categoría y la misma unidad.
   2. Después la misma categoría de cualquier unidad.
   3. Solo al final, el resto del vocabulario.
   Y se descarta cualquier opción que en español se pise con la
   correcta o con otra opción ya elegida (agua / agua caliente,
   vuelo / vuelo número, habitación / habitación número).
--------------------------------------------------------------- */
/* Rango de diacríticos combinantes, U+0300 a U+036F. Se construye por código
   y no como literal dentro de la expresión: escritos literales son caracteres
   invisibles en el archivo, imposibles de revisar y fáciles de romper en un
   copiar y pegar. */
const DIACRITICOS = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36F) + ']', 'g');

function sinTildes(t){
  return String(t).toLowerCase().normalize('NFD').replace(DIACRITICOS, '');
}
function clavesDe(t){
  return sinTildes(t).split(/[^a-z0-9]+/).filter(w => w.length >= 4);
}
function chocan(a, b){
  const A = sinTildes(a), B = sinTildes(b);
  if(A === B || A.includes(B) || B.includes(A)) return true;
  const pa = clavesDe(a), pb = clavesDe(b);
  return pa.some(w => pb.indexOf(w) !== -1);
}

/* todo el vocabulario del libro, con su unidad, para los distractores */
function vocabTodo(){
  const out = [];
  for(const u of UNIDADES) for(const v of u.vocab) out.push({ v, n:u.n });
  return out;
}

function distractores(v, unidad){
  const libres = vocabTodo().filter(x => x.v.jp !== v.jp && !chocan(x.v.es, v.es));
  const anillo1 = baraja(libres.filter(x => x.n === unidad && x.v.cat === v.cat));
  const anillo2 = baraja(libres.filter(x => x.n !== unidad && x.v.cat === v.cat));
  const anillo3 = baraja(libres.filter(x => x.v.cat !== v.cat));
  const out = [];
  for(const c of anillo1.concat(anillo2, anillo3)){
    if(out.length >= 3) break;
    if(out.some(o => chocan(o.v.es, c.v.es))) continue;
    out.push(c);
  }
  return out.map(x => x.v.es);
}

/* ═══════════ construcción de preguntas ═══════════ */

/* El filtro es { unidades:Set|Array, clase:'0'|'1'|'2', modos:[] }. `unidades`
   vacío significa todas las que estén listas. Cada pregunta lleva el `modo`,
   la `unidad`, la `clase` y su `orden` de autoría, que es lo que el orden de
   entrada de ítems nuevos necesita (plano 2.5). */
function armarPool(filtro){
  const modos = filtro.modos || [];
  const clase = filtro.clase || '0';
  const pedidas = filtro.unidades && filtro.unidades.length
    ? new Set(Array.from(filtro.unidades).map(Number))
    : null;
  const enClaseDe = (c) => clase === '0' || String(c) === clase;

  const pool = [];
  const vistos = new Set();
  const meter = (q) => { if(vistos.has(q.id)) return; vistos.add(q.id); pool.push(q); };

  for(const u of UNIDADES){
    if(u.estado !== 'lista') continue;
    if(pedidas && !pedidas.has(u.n)) continue;

    if(modos.includes('vocabES'))
      u.vocab.forEach((v, i) => { if(!enClaseDe(v.c)) return; meter({
        modo:'vocabES', tipo:'escribir', id:'v:'+v.jp+':es', tag:'Vocabulario',
        unidad:u.n, clase:v.c, orden:i, jp:v.jp,
        promptEs:v.es, ok:[v.jp, v.kana], modelo:v.jp, lectura:v.kana
      }); });

    if(modos.includes('vocabJP'))
      u.vocab.forEach((v, i) => { if(!enClaseDe(v.c)) return; meter({
        modo:'vocabJP', tipo:'opcion', id:'v:'+v.jp+':jp', tag:'Vocabulario',
        unidad:u.n, clase:v.c, orden:i, jp:v.jp,
        promptJp:v.jp, lectura:v.kana, correcta:v.es, modelo:v.es,
        opciones: baraja([v.es].concat(distractores(v, u.n)))
      }); });

    if(modos.includes('conj')){
      u.verbos.forEach((v, i) => {
        /* qué formas practica esta unidad en la clase del verbo */
        const ids = (u.formas && u.formas[v.c]) || [];

        /* Item de grupo: uno por verbo, siempre de eleccion entre 1, 2 y 3.
           Va antes que sus formas en el orden de entrada, porque conjugar sin
           saber el grupo es adivinar (plano 3.6). */
        if(ids.length && enClaseDe(v.c)) meter({
          modo:'grupo', tipo:'opcion', id:'g:' + v.kana, tag:'Grupo del verbo',
          unidad:u.n, clase:v.c, orden:i * 20, kana:v.kana,
          promptJp:v.kanji, lectura:(v.kanji !== v.kana ? v.kana : ''),
          sub:v.es, nota:v.nota || '',
          correcta:'Grupo ' + v.g, modelo:'Grupo ' + v.g,
          opciones:['Grupo 1', 'Grupo 2', 'Grupo 3'],
          grupo:v.g,
          pistaGrupo: 'Termina en ' + v.kana.slice(-1) +
            '. Los que acaban en 〜いる o 〜える suelen ser grupo 2, pero hay trampas.' +
            (v.nota ? ' ' + v.nota : '')
        });

        ids.forEach((fid, j) => {
          const f = FORMAS.find(x => x.id === fid);
          if(!f || !enClaseDe(v.c)) return;
          meter({
            modo:'conj', tipo:'escribir', id:'c:'+v.kana+':'+f.id, tag:'Conjugación',
            unidad:u.n, clase:v.c, orden:i * 20 + 1 + j, kana:v.kana, forma:f.id,
            promptJp:v.kanji, lectura:(v.kanji!==v.kana? v.kana : ''),
            pide:f.label, sub:v.es + ' · Grupo ' + v.g, nota:v.nota || '',
            ok: aceptadasDeConjugacion(v, f.id), modelo: conKanji(v, conjugar(v,f.id)) || conjugar(v,f.id),
            lecturaResp: conjugar(v, f.id), grupo:v.g, formaDesc:f.desc, regla: reglaDe(v, f.id)
          });
        });
      });
    }

    if(modos.includes('hueco'))
      u.huecos.forEach((h, i) => { if(!enClaseDe(h.c)) return; meter({
        modo:'hueco', tipo: h.ok2 ? 'hueco2' : 'hueco', id:'h:'+u.n+':'+h.k,
        tag:'Frase con hueco', unidad:u.n, clase:h.c, orden:i, pat:h.pat,
        pre:h.pre, post:h.post, post2:h.post2, hint:h.hint, ok:h.ok, ok2:h.ok2, sub:h.es,
        modelo:h.ok[0] + (h.ok2 ? ' … ' + h.ok2[0] : '')
      }); });

    if(modos.includes('armar'))
      u.armar.forEach((a, i) => { if(!enClaseDe(a.c)) return; meter({
        modo:'armar', tipo:'armar', id:'a:'+u.n+':'+a.k, tag:'Armar la frase',
        unidad:u.n, clase:a.c, orden:i,
        promptEs:a.es, chips:a.chips, modelo:a.chips.join('')
      }); });

    /* El modo "frase completa desde español" se retiró; las frases siguen en el
       contenido como ejemplos de los patrones (ver la nota en 60-ui.js). */
  }
  return pool;
}

/* Arma la sesión. `manual` es la del menú "Elegir qué practicar", que filtra
   el pool pero pasa por el mismo programador: también respeta vencimientos y
   también registra progreso (plano 2.4). */
/* Los seis modos, sin depender de la tabla de la interfaz */
const TODOS_LOS_MODOS = ['vocabES','vocabJP','conj','hueco','armar'];

function construir(manual){
  const filtro = manual
    ? { modos: sel.modos, clase: sel.clase, unidades: sel.unidades }
    : { modos: TODOS_LOS_MODOS, clase: '0', unidades: [] };

  const pool = armarPool(filtro);
  const r = seleccionar(pool, sel.largo, sel.cupoNuevos, unidadActual(), HOY);
  cola = conPresentaciones(r.cola.map(q => {
    const c = Object.assign({}, q);
    aplicarEtapa(c);
    c.pista1 = pistaDe(c);
    c.ejemplo2 = segundoEjemplo(c);
    return c;
  }));
  return r;
}

/* Lo que habría hoy en "Practicar hoy", para el subtítulo del botón. */
function panoramaHoy(){
  const pool = armarPool({ modos: TODOS_LOS_MODOS, clase:'0', unidades:[] });
  return panorama(pool, sel.largo, sel.cupoNuevos, unidadActual(), HOY);
}

/* ═══════════ moras ═══════════ */

/* Los kana pequeños de yōon y de vocal se pegan a la mora anterior: きゃ es
   una mora, no dos. El っ NO: la pausa es una mora por derecho propio, y
   がんばって son cinco. La pista se toma siempre sobre el kana, nunca sobre el
   kanji, porque tiene que poder escribirse (plano 3.2). */
const KANA_PEQ = /[ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ]/;

function moras(kana){
  const out = [];
  for(const c of String(kana || '')){
    if(out.length && KANA_PEQ.test(c)) out[out.length - 1] += c;
    else out.push(c);
  }
  return out;
}

/* Primeras `n` moras y un guion bajo por cada una que falta */
function esqueleto(kana, n){
  const m = moras(kana);
  return m.slice(0, n).join('') + '＿'.repeat(Math.max(0, m.length - n));
}

/* ═══════════ distractores de conjugacion ═══════════ */

/* Se generan con `conjugar` sobre copias del verbo, sin tocar el conjugador:
   el verbo tratado como del otro grupo, la fila て/た equivocada, y la forma
   vecina. Lo que coincide con la correcta se descarta, y si no llegan a tres
   se completa con la misma forma de otro verbo de la unidad (plano 3.6). */
function distractoresConjugacion(v, formaId, verbosUnidad){
  const correcta = conjugar(v, formaId);
  const cands = [];
  const meter = (x) => { if(x && x !== correcta && !cands.includes(x)) cands.push(x); };

  /* 1. el verbo tratado como del otro grupo */
  if(v.g === 1 || v.g === 2){
    meter(conjugar(Object.assign({}, v, { g: v.g === 1 ? 2 : 1 }), formaId));
  }

  /* 2. la fila て/た equivocada: se cambia la ultima silaba del diccionario
        por otra que TE1 mande a una terminacion distinta */
  if(v.g === 1 && v.kana.length > 1){
    const ult = v.kana[v.kana.length - 1];
    const mia = TE1[ult];
    for(const otra of ['る', 'む', 'く', 'す', 'う']){
      if(TE1[otra] === mia) continue;
      meter(conjugar(Object.assign({}, v, { kana: v.kana.slice(0, -1) + otra }), formaId));
      if(cands.length >= 3) break;
    }
  }

  /* 3. la forma vecina del mismo verbo */
  for(const f of FORMAS){
    if(f.id === formaId) continue;
    meter(conjugar(v, f.id));
    if(cands.length >= 3) break;
  }

  /* 4. la misma forma de otro verbo de la unidad */
  for(const otro of (verbosUnidad || [])){
    if(cands.length >= 3) break;
    if(otro.kana === v.kana) continue;
    meter(conjugar(otro, formaId));
  }

  return cands.slice(0, 3);
}

/* ═══════════ opciones de patron ═══════════ */

/* El `pat` del item y tres del catalogo de la misma unidad; si no alcanzan,
   de unidades anteriores (plano 3.6). */
function distractoresPatron(n, pat){
  const propios = [];
  const ajenos = [];
  for(const u of UNIDADES){
    if(u.estado !== 'lista' || !u.patrones) continue;
    for(const p of u.patrones){
      if(p.pat === pat) continue;
      (u.n === n ? propios : ajenos).push(p.pat);
    }
  }
  return baraja(propios).concat(baraja(ajenos)).slice(0, 3);
}

const usoDelPatron = (n, pat) => {
  for(const u of UNIDADES){
    const p = (u.patrones || []).find(x => x.pat === pat);
    if(p) return p.uso || '';
  }
  return '';
};

/* ═══════════ etapa segun la caja ═══════════ */

/* El id, el registro y el programador no cambian: lo unico que cambia es que
   se pide del mismo item. Un fallo devuelve a la caja 0 y por tanto a la
   etapa de reconocimiento, que es la conducta buscada (plano 3.6). */
function aplicarEtapa(q){
  const b = box(q.id);
  q.etapa = b === 0 ? 0 : b === 1 ? 1 : 2;

  if(q.modo === 'conj' && q.tipo === 'escribir' && q.etapa === 0){
    const u = UNIDADES.find(x => x.n === q.unidad);
    const v = u && u.verbos.find(x => x.kana === q.kana);
    if(v){
      const dis = distractoresConjugacion(v, q.forma, u.verbos);
      if(dis.length >= 2){
        q.tipo = 'opcion';
        q.correcta = q.lecturaResp;
        q.opciones = baraja([q.lecturaResp].concat(dis));
        q.eleccion = 'forma';
      }
    }
  }

  if(q.modo === 'hueco'){
    if(q.etapa === 0 && q.pat){
      const dis = distractoresPatron(q.unidad, q.pat);
      if(dis.length >= 2){
        q.tipo = 'opcion';
        q.correcta = q.pat;
        q.opciones = baraja([q.pat].concat(dis));
        q.eleccion = 'patron';
        q.promptEs = q.sub;
        q.pide = null;
        q.hintOculto = true;
      }
    } else if(q.etapa >= 2){
      /* escribir sin pista: el `hint` pasa a ser la pista del primer fallo */
      q.hintOculto = true;
    }
  }
  return q;
}

/* ═══════════ pista del primer fallo ═══════════ */

/* Se calcula al construir la pregunta y no en el render, para que las pruebas
   puedan verificarla sin DOM (plano 3.2). */
function pistaDe(q){
  if(q.tipo === 'opcion'){
    if(q.eleccion === 'patron'){
      /* las lineas `uso` de las cuatro, sin decir cual */
      return { clase:'usos', texto:'¿Cuál de estos usos encaja aquí?',
               usos: q.opciones.map(p => ({ pat:p, uso: usoDelPatron(q.unidad, p) })) };
    }
    /* conjugacion en eleccion, vocabulario reconocer y grupo: se retira una
       opcion incorrecta */
    const fuera = q.opciones.filter(o => o !== q.correcta)[0];
    return { clase:'quita', texto:'Esta no es.', quitar:fuera };
  }

  if(q.modo === 'conj')
    return { clase:'regla', texto: q.regla || ('Grupo ' + q.grupo + '.') };

  if(q.modo === 'grupo')
    return { clase:'texto', texto: q.pistaGrupo };

  if(q.modo === 'vocabES')
    return { clase:'esqueleto', texto: esqueleto(q.lectura, 1) };

  if(q.modo === 'hueco'){
    if(q.hintOculto && q.hint) return { clase:'texto', texto: q.hint };
    return { clase:'esqueleto',
             texto: esqueleto(q.ok[0], 1) + (q.ok2 ? '  …  ' + esqueleto(q.ok2[0], 1) : '') };
  }

  if(q.modo === 'armar')
    return { clase:'pieza', texto:'Empieza por esta pieza.', pieza:q.chips[0] };

  return null;
}

/* Segundo verbo del mismo grupo y unidad, en la misma forma: la correccion
   ensena la regla y no solo la respuesta (plano 3.2). */
function segundoEjemplo(q){
  if(q.modo !== 'conj') return null;
  const u = UNIDADES.find(x => x.n === q.unidad);
  if(!u) return null;
  const yo = u.verbos.findIndex(x => x.kana === q.kana);
  if(yo < 0) return null;
  const orden = u.verbos.slice(yo + 1).concat(u.verbos.slice(0, yo));
  const otro = orden.find(x => x.g === q.grupo && (u.formas[x.c] || []).includes(q.forma));
  if(!otro) return null;
  const s = conjugar(otro, q.forma);
  return { verbo: otro.kanji || otro.kana, salida: conKanji(otro, s) || s };
}

/* ═══════════ presentaciones y fichas dentro de la cola ═══════════ */

/* Una palabra nueva no se pregunta a ciegas, y una forma o un patron que el
   usuario nunca vio no aparecen sin explicacion. Ninguna de estas tarjetas
   cuenta como pregunta, ni registra progreso, ni entra en el marcador
   (plano 3.5 y 3.6). */

const yaVistaForma = (fid) => Object.keys(prog).some(id => id.startsWith('c:') && id.endsWith(':' + fid));

function yaVistoPatron(n, pat){
  const u = UNIDADES.find(x => x.n === n);
  if(!u) return true;
  const ids = u.huecos.filter(h => h.pat === pat).map(h => 'h:' + n + ':' + h.k)
    .concat(u.frases.filter(f => f.pat === pat).map(f => 'f:' + n + ':' + f.k));
  return ids.some(id => prog[id]);
}

function tarjetaPara(q, hechas){
  /* vocabulario nuevo: la tarjeta de presentacion */
  if((q.modo === 'vocabES' || q.modo === 'vocabJP') && !prog[q.id]){
    const clave = 'nuevo:' + q.jp;
    if(hechas.has(clave)) return null;
    hechas.add(clave);
    const u = UNIDADES.find(x => x.n === q.unidad);
    const v = u && u.vocab.find(x => x.jp === q.jp);
    if(!v) return null;
    return { tipo:'nuevo', clave, jp:v.jp, lectura:v.kana, es:v.es, unidad:q.unidad };
  }

  /* forma de conjugacion nunca vista */
  if(q.modo === 'conj' && q.forma && !yaVistaForma(q.forma)){
    const clave = 'forma:' + q.forma;
    if(hechas.has(clave)) return null;
    hechas.add(clave);
    const f = fichaForma(q.forma);
    return f ? { tipo:'ficha', clave, ficha:f } : null;
  }

  /* patron nunca visto */
  if(q.modo === 'hueco' && q.pat && !yaVistoPatron(q.unidad, q.pat)){
    const clave = 'patron:' + q.unidad + ':' + q.pat;
    if(hechas.has(clave)) return null;
    hechas.add(clave);
    const f = fichaPatron(q.unidad, q.pat);
    return f ? { tipo:'ficha', clave, ficha:f } : null;
  }

  return null;
}

/* La tarjeta va al menos tres posiciones antes de su pregunta, para que no se
   responda de memoria inmediata (plano 3.5).

   Se consigue subiendo la tarjeta, no bajando la pregunta. Bajar la pregunta
   parece lo natural, pero al final de la cola no hay tres posiciones donde
   bajarla y la separacion se queda en una: la tarjeta y su pregunta pegadas es
   justo lo que la regla existe para evitar. Cuando la pregunta esta en las tres
   primeras posiciones no hay hueco arriba, y ahi si se baja la pregunta.

   La separacion se garantiza contra la pregunta que disparo la tarjeta. Una
   ficha de patron puede quedar a menos de tres de OTRO ejercicio del mismo
   patron, y da igual: la ficha explica el patron, no revela la respuesta de
   ningun ejercicio. La tarjeta de vocabulario si la revela, y para esa la
   separacion se cumple siempre. */
function conPresentaciones(cola){
  if(!sel.presentaciones) return cola.slice();
  const out = cola.slice();
  const hechas = new Set();
  for(let i = 0; i < out.length; i++){
    const q = out[i];
    if(!esPregunta(q)) continue;
    const card = tarjetaPara(q, hechas);
    if(!card) continue;

    if(i >= 3){
      out.splice(i - 3, 0, card);
      i++;                              /* la pregunta se corrio una posicion */
    } else {
      out.splice(i, 1, card);
      out.splice(Math.min(i + 3, out.length), 0, q);
    }
  }
  return out;
}

/* Las tarjetas no son preguntas: el contador y el marcador solo cuentan estas */
const esPregunta = (q) => !!q && q.tipo !== 'nuevo' && q.tipo !== 'ficha';

/* ══ 55-material.js ══ */
/* Dojo Marugoto - material de estudio
   Fichas de forma y de patron, y el indice de materia de cada unidad.

   Este archivo no esta en la lista del plano. Nace de un pedido de Patricio
   durante M3: saber que patrones tiene la unidad, que significan y cuando se
   usan, sin tener que encontrarselos dentro de una sesion. El Anexo C habia
   descartado una seccion de gramatica, pero esa objecion venia de la auditoria
   de un usuario secundario; el usuario principal la pidio, y el material que
   necesita es el mismo que las fichas de 3.6 construyen igual.

   Solo devuelve datos. El render vive en 60-ui.js. */

/* Verbo con el que ilustrar una forma en un grupo. Se prefiere el de `ej`,
   pero si esa unidad no esta compilada se toma el primero de ese grupo, para
   que la ficha nunca salga vacia. */
function verboEjemplo(g, ej){
  const listas = UNIDADES.filter(u => u.estado === 'lista');
  const nom = ej && ej[g];
  if(nom){
    for(const u of listas){
      const v = u.verbos.find(x => x.kana === nom);
      if(v) return v;
    }
  }
  for(const u of listas){
    const v = u.verbos.find(x => x.g === g);
    if(v) return v;
  }
  return null;
}

/* Ficha de una forma de conjugacion: que es, cuando se usa, y la regla por
   grupo con un ejemplo generado por el propio conjugador (plano 3.6). */
function fichaForma(id){
  const f = FORMAS.find(x => x.id === id);
  if(!f) return null;

  const grupos = [1, 2, 3].map(g => {
    const v = verboEjemplo(g, f.ej);
    if(!v) return null;
    const kana = conjugar(v, id);
    return {
      g, verbo: v.kanji || v.kana, lecturaVerbo: v.kana, es: v.es,
      salida: conKanji(v, kana) || kana, lectura: kana,
      regla: reglaDe(v, id)
    };
  }).filter(Boolean);

  /* Las excepciones que afectan a esta forma, sacadas de la tabla EXC */
  const exc = [];
  for(const u of UNIDADES){
    if(u.estado !== 'lista') continue;
    for(const v of u.verbos){
      const e = EXC[v.kana];
      if(e && e[id] !== undefined && !exc.some(x => x.kana === v.kana)){
        exc.push({ kana: v.kana, es: v.es, salida: e[id], nota: v.nota || '' });
      }
    }
  }

  return { tipo:'forma', clave:'forma:' + id, titulo:f.label, desc:f.desc,
           lectura:f.lectura || '', uso:f.uso || '', grupos, exc };
}

/* Ficha de un patron de frase: que es, cuando se usa, el ejemplo del catalogo
   y hasta tres oraciones de la unidad que lo emplean. */
function fichaPatron(n, pat){
  const u = UNIDADES.find(x => x.n === n);
  const p = u && u.patrones && u.patrones.find(x => x.pat === pat);
  if(!p) return null;

  /* Hasta tres oraciones de la unidad, empezando por la del catalogo. Si esa
     oracion viene de una frase, se le pone su traduccion: un ejemplo en
     japones sin traducir no ensena nada a quien esta aprendiendo. */
  const deFrases = u.frases.filter(f => f.pat === pat).map(f => ({ jp: f.ok[0], es: f.es }));
  const cabeza = p.ejemplo
    ? [deFrases.find(f => f.jp === p.ejemplo) || { jp: p.ejemplo, es: '' }]
    : [];
  const frases = cabeza.concat(deFrases.filter(f => f.jp !== p.ejemplo)).slice(0, 3);
  const huecos = u.huecos.filter(h => h.pat === pat).length;

  return { tipo:'patron', clave:'patron:' + n + ':' + pat, titulo:pat,
           desc: p.tipo === 'expresion' ? 'expresión' : 'patrón gramatical',
           lectura:p.lectura || '', significado:p.es || '',
           uso:p.uso || '', formula:p.formula || '',
           ejemplo:p.ejemplo || '', frases, huecos, unidad:n };
}

/* Indice de la materia de una unidad. Es lo que se ve al tocar la unidad:
   patrones y expresiones con su linea de uso, formas de conjugacion,
   vocabulario y kanji. */
const KANJI = /[一-龯]/;

function materiaDe(n){
  const u = UNIDADES.find(x => x.n === n);
  if(!u) return null;

  const idsForma = [].concat(u.formas && u.formas[1] || [], u.formas && u.formas[2] || []);
  const formas = [];
  for(const id of idsForma){
    if(formas.some(x => x.id === id)) continue;
    const f = FORMAS.find(x => x.id === id);
    if(!f) continue;
    formas.push({
      id, label:f.label, desc:f.desc, uso:f.uso || '', lectura:f.lectura || '',
      clases: [1, 2].filter(c => (u.formas[c] || []).includes(id)),
      verbos: u.verbos.filter(v => (u.formas[v.c] || []).includes(id)).length
    });
  }

  const pats = (u.patrones || []).map(p => Object.assign({}, p, {
    frases: u.frases.filter(f => f.pat === p.pat).length,
    huecos: u.huecos.filter(h => h.pat === p.pat).length
  }));

  return {
    n, titulo:u.titulo, es:u.es, paginas:u.paginas || null,
    gramatica: pats.filter(p => p.tipo !== 'expresion'),
    expresiones: pats.filter(p => p.tipo === 'expresion'),
    formas,
    verbos: u.verbos.slice(),
    vocab: u.vocab.slice(),
    kanji: u.vocab.filter(v => KANJI.test(v.jp)),
    ejercicios: { frases: u.frases.length, huecos: u.huecos.length, armar: u.armar.length }
  };
}

/* Cuánto de una lista de ítems ya se vio, para las marcas del índice. */
function vistosDe(ids){
  let vistos = 0, firmes = 0;
  for(const id of ids){
    const r = prog[id];
    if(!r) continue;
    vistos++;
    if(r.b >= 5) firmes++;
  }
  return { vistos, firmes, total: ids.length };
}

/* ══ 60-ui.js ══ */
/* Dojo Marugoto - interfaz
   modos, estado de sesion, render de pantallas y correccion.
   Contenido literal del archivo congelado. */

const MODOS = [
  { id:'vocabES', nom:'Vocabulario · escribir en japonés', desc:'Te doy la palabra en español y la escribes en japonés.' },
  { id:'vocabJP', nom:'Vocabulario · reconocer', desc:'Te doy la palabra en japonés y eliges qué significa.' },
  { id:'conj',    nom:'Conjugación', desc:'Te doy el verbo y la forma que quiero, y la escribes.' },
  { id:'hueco',   nom:'Frases con hueco', desc:'Completas la parte que falta dentro de una frase del libro.' },
  { id:'armar',   nom:'Armar la frase', desc:'Te doy las piezas desordenadas y las pones en orden.' }
];

/* Hubo un séptimo modo, "frase completa desde español": se daba la frase en
   español y había que escribirla entera en japonés. Se quitó a petición de
   Patricio y con razón. Escribir una oración entera en el teclado del celular
   es una tarea de tecleo, no de idioma, y lo que mide —orden de las palabras,
   partículas, forma del verbo— lo mide "armar la frase" sin esa fricción.

   Las frases NO se borraron del contenido: siguen siendo los ejemplos de la
   ficha de cada patrón y de la sección de materia. Lo que se quitó es el
   ejercicio, no el material. */

/* ═══════════ estado de la sesion ═══════════ */
let cola = [], idx = 0, aciertos = 0, fallos = [], recuperadas = [], repasoPuesto = false, respondida = false;

/* ═══════════ utilidades ═══════════ */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ═══════════ render ═══════════ */
/* El pie nombra la unidad en la que se está. Lo pintan las dos pantallas que
   pueden estar delante —la de inicio y la de primer uso—, porque el segmento
   entero es de este span: sin unidad no se escribe nada. */
function pintarPie(){
  const u = UNIDADES.find(x => x.n === unidadActual());
  $('#footTema').textContent = u ? ' · Tema ' + u.n + ' ' + u.titulo + ' — ' + u.es : '';
}

function pintarInicio(){
  const u = UNIDADES.find(x => x.n === unidadActual());
  $('#temaLabel').textContent = u ? 'Unidad ' + u.n + ' · ' + u.titulo : '';
  pintarPie();

  /* El subtítulo del botón explica sin texto qué va a pasar al tocarlo. */
  /* sin contenido no hay nada que practicar: el botón principal se convierte
     en el cargador (plano 6.5) */
  $('#btnCargar').classList.toggle('hide', hayContenido());
  $('#btnMateria').classList.toggle('hide', !hayContenido());
  $('#btnMenu').classList.toggle('hide', !hayContenido());

  const pan = panoramaHoy();
  const b = $('#btnStart'), linea = $('#hoyLinea'), aviso = $('#hoyAviso');
  b.disabled = false;
  if(pan.vencidas === 0 && pan.nuevas === 0){
    linea.textContent = pan.total
      ? 'Todo al día. Puedes adelantar trabajo.'
      : 'Todavía no hay contenido. Cárgalo desde el archivo que te pasaron.';
    b.textContent = pan.total ? 'Adelantar' : 'Practicar hoy';
    b.disabled = !pan.total;
  } else {
    b.textContent = 'Practicar hoy';
    linea.textContent = (pan.vencidas ? pan.vencidas + ' vencidas' : 'Nada vencido') +
      ' · ' + pan.nuevas + ' nuevas';
  }

  /* Quien falla mucho vive semanas con el cupo de nuevos bloqueado, y sin esta
     línea lo lee como que la app se quedó pegada (plano 2.4). */
  aviso.classList.toggle('hide', !pan.bloquea);
  if(pan.bloquea) aviso.textContent =
    'Hoy no entran ítems nuevos: primero lo atrasado. Vuelven en cuanto bajes del tope de la sesión.';

  pintarHistorial(); pintarAccionesProgreso();
}

/* ═══════════ menú "Elegir qué practicar" ═══════════ */

function chips(cont, opciones, activo, alElegir){
  $(cont).innerHTML = opciones.map(([v,t]) =>
    `<button class="chipbtn ${activo(v)?'on':''}" data-v="${esc(String(v))}">${esc(t)}</button>`).join('');
  $(cont).querySelectorAll('button').forEach(x => x.onclick = () => { alElegir(x.dataset.v); saveCfg(); });
}

const unidadesListas = () => UNIDADES.filter(u => u.estado === 'lista').map(u => u.n).sort((a,b) => a - b);

function pintarMenu(){
  $('#modeList').innerHTML = MODOS.map(m => `
    <label class="opt ${sel.modos.includes(m.id)?'on':''}" data-m="${m.id}">
      <input type="checkbox" ${sel.modos.includes(m.id)?'checked':''}>
      <span><b>${esc(m.nom)}</b><small>${esc(m.desc)}</small></span>
    </label>`).join('');
  $('#modeList').querySelectorAll('.opt').forEach(el => {
    el.querySelector('input').onchange = e => {
      const id = el.dataset.m;
      if(e.target.checked){ if(!sel.modos.includes(id)) sel.modos.push(id); }
      else sel.modos = sel.modos.filter(x => x !== id);
      el.classList.toggle('on', e.target.checked); saveCfg(); actualizarStart();
    };
  });

  /* Selección múltiple: "todas" es vaciar la lista, no un valor más. */
  const listas = unidadesListas();
  chips('#unidadRow', [['0','Todas']].concat(listas.map(n => [String(n), 'Unidad ' + n])),
    v => v === '0' ? !sel.unidades.length : sel.unidades.includes(+v),
    v => {
      if(v === '0') sel.unidades = [];
      else {
        const n = +v;
        sel.unidades = sel.unidades.includes(n) ? sel.unidades.filter(x => x !== n) : sel.unidades.concat(n);
      }
      pintarMenu();
    });

  chips('#claseRow', [['0','Las dos'],['1','Clase 1'],['2','Clase 2']],
    v => sel.clase === v, v => { sel.clase = v; pintarMenu(); });

  chips('#largoRow', [['10','10'],['15','15'],['20','20'],['25','25'],['40','40'],['0','Todas']],
    v => sel.largo === +v, v => { sel.largo = +v; pintarMenu(); });

  chips('#nuevosRow', [['0','0'],['3','3'],['6','6'],['10','10']],
    v => sel.cupoNuevos === +v, v => { sel.cupoNuevos = +v; pintarMenu(); });

  chips('#cursoRow', listas.map(n => [String(n), 'Unidad ' + n]),
    v => unidadActual() === +v, v => { sel.unidadActual = +v; pintarMenu(); });

  chips('#presRow', [['0','Preguntármelo directo'],['1','Mostrármelo antes']],
    v => (v === '1') === !!sel.presentaciones,
    v => { sel.presentaciones = v === '1'; pintarMenu(); });

  actualizarStart();
}

/* ═══════════ primer uso ═══════════ */

/* Dos preguntas, una sola vez. Sin esto, el usuario que recibe la app por mano
   no sabe en qué unidad está ni cuánto es un rato de práctica (Anexo B). */
function pintarPrimerUso(){
  const listas = unidadesListas();
  if(!sel.unidadActual) sel.unidadActual = unidadPorDefecto();
  chips('#p1Unidad', listas.map(n => [String(n), 'Unidad ' + n]),
    v => sel.unidadActual === +v, v => { sel.unidadActual = +v; pintarPrimerUso(); });
  chips('#p1Largo', [['10','10 preguntas'],['20','20 preguntas'],['40','40 preguntas']],
    v => sel.largo === +v, v => { sel.largo = +v; pintarPrimerUso(); });
  pintarPie();
}

function actualizarStart(){ $('#btnStartManual').disabled = sel.modos.length === 0; }

function pintarHistorial(){
  const ids = Object.keys(prog);
  if(!ids.length){
    $('#histBody').innerHTML = '<p class="sub">Todavía no hay nada. Lo que falles vuelve a salir más seguido.</p>';
    $('#histUnidades').innerHTML = '';
    return;
  }
  const vistas   = ids.reduce((a,k) => a + prog[k].v, 0);
  const firmes   = ids.filter(k => prog[k].b >= 5).length;
  const jubilados = ids.filter(k => prog[k].man).length;
  const flojas = ids.filter(k => prog[k].b === 0 && prog[k].f > 0)
                    .sort((a,b) => prog[b].f - prog[a].f).slice(0,8);

  $('#histBody').innerHTML = `
    <p class="sub" style="margin-bottom:12px">
      <b style="color:var(--ink)">${vistas}</b> respuestas ·
      <b style="color:var(--ok)">${firmes}</b> ítems ya firmes` +
      (jubilados ? ` · <b style="color:var(--gold)">${jubilados}</b> marcados como sabidos` : '') +
    `</p>` +
    (flojas.length ? `<p class="sub" style="margin-bottom:6px">Lo que más se te resiste. Toca uno para marcarlo como sabido:</p>
      <div class="chipsrow">${flojas.map(k =>
        `<button class="piece" data-id="${esc(k)}">${esc(etiqueta(k))}</button>`).join('')}</div>` : '');

  $('#histBody').querySelectorAll('.piece[data-id]').forEach(b =>
    b.onclick = () => accionMarcarSabido(b.dataset.id));

  /* Una barra por unidad: cuánto se ha visto y cuánto está firme sobre el
     total de la unidad. Con nueve unidades es lo único que dice dónde vas. */
  const filas = UNIDADES.filter(u => u.estado === 'lista').map(u => {
    const total = armarPool({ modos: TODOS_LOS_MODOS, clase:'0', unidades:[u.n] }).length;
    if(!total) return '';
    const pool = armarPool({ modos: TODOS_LOS_MODOS, clase:'0', unidades:[u.n] });
    const vistos = pool.filter(q => prog[q.id]).length;
    const fir    = pool.filter(q => prog[q.id] && prog[q.id].b >= 5).length;
    return `<div class="ubar">
      <div class="ubar-t"><span>Unidad ${u.n} · ${esc(u.es)}</span><span>${vistos} de ${total}</span></div>
      <div class="rail"><i style="width:${Math.round(vistos/total*100)}%"></i>
        <u style="width:${Math.round(fir/total*100)}%"></u></div>
    </div>`;
  }).join('');
  $('#histUnidades').innerHTML = filas
    ? '<h2 class="sec" style="margin:18px 0 10px">Por unidad</h2>' + filas
    : '';
}

async function accionMarcarSabido(id){
  const esta = jubilado(id);
  const r = await dialogo({
    titulo: esc(etiqueta(id)),
    texto: esta
      ? 'Está marcado como sabido: vuelve cada 120 días. ¿Lo devuelvo al repaso normal?'
      : 'Deja de preguntártelo por un tiempo largo. No desaparece: vuelve cada 120 días, y si lo fallas regresa al repaso normal.',
    botones: esta
      ? [{ t:'Devolver al repaso', v:'ok', p:true }, { t:'Cancelar', v:null, cancela:true }]
      : [{ t:'Ya la sé', v:'ok', p:true }, { t:'Cancelar', v:null, cancela:true }]
  });
  if(r.boton !== 'ok') return;
  if(esta) desmarcarAprendido(id); else marcarAprendido(id);
  pintarInicio();
}

/* Los ids de frase, hueco y armar son `<t>:<unidad>:<clave>`. Se muestra el
   `es` del ejercicio, que es lo unico que Patricio reconoce de un vistazo en
   el historial; el numero de la clave no le dice nada (plano Anexo A). */
function itemDe(t, n, k){
  const u = UNIDADES.find(x => x.n === +n);
  if(!u) return null;
  const arr = t === 'h' ? u.huecos : t === 'a' ? u.armar : t === 'f' ? u.frases : null;
  return arr ? arr.find(x => x.k === k) : null;
}

function recortar(s, n){
  s = String(s || '');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function etiqueta(id){
  const [t, a, b] = id.split(':');
  if(t === 'c'){ const f = FORMAS.find(x => x.id === b); return a + ' → ' + (f ? f.label : b); }
  if(t === 'v'){ return a; }
  if(t === 'h' || t === 'a' || t === 'f'){
    const it = itemDe(t, a, b);
    const nom = t === 'h' ? 'hueco' : t === 'a' ? 'armar' : 'frase';
    return it ? recortar(it.es, 42) : nom + ' ' + b;
  }
  return id;
}

function enunciado(q){
  if(q.tipo === 'hueco' || q.tipo === 'hueco2')
    return q.pre + '___' + q.post + (q.post2 ? '___' + q.post2 : '') + '  ·  ' + q.hint;
  if(q.tipo === 'opcion') return q.promptJp + ' (' + q.lectura + ')';
  if(q.pide) return q.promptJp + ' → ' + q.pide;
  return q.promptEs || q.promptJp || etiqueta(q.id);
}

const PANTALLAS = ['scPrimero','scHome','scMenu','scMateria','scPlay','scEnd'];
function ir(pantalla){
  PANTALLAS.forEach(s => $('#'+s).classList.toggle('hide', s !== pantalla));
  window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
}

/* ═══════════ pregunta ═══════════ */
function pintarPregunta(){
  const q = cola[idx];
  respondida = false;
  q.reintento = false;

  /* Las tarjetas y las fichas no son preguntas: no entran en el contador ni
     en el marcador (plano 3.5). */
  const preguntas = cola.filter(esPregunta).length;
  const voy = cola.slice(0, idx + 1).filter(esPregunta).length;
  $('#rail').style.width = (idx / cola.length * 100) + '%';
  $('#mCount').textContent = esPregunta(q)
    ? 'Pregunta ' + voy + ' de ' + preguntas
    : (q.tipo === 'ficha' ? 'Ficha' : 'Palabra nueva');
  $('#mScore').textContent = aciertos + ' correctas';
  $('#qTag').textContent = q.tag || (q.tipo === 'ficha' ? 'Antes de seguir' : 'Palabra nueva');
  const t2 = $('#qTag2');
  if(q.tag2){ t2.textContent = q.tag2; t2.classList.remove('hide'); } else t2.classList.add('hide');
  $('#fb').className = 'fb';
  $('#fb').innerHTML = '';

  const B = $('#qBody');

  /* ── tarjeta de palabra nueva ── */
  if(q.tipo === 'nuevo'){
    B.innerHTML =
      `<div class="prompt">${esc(q.jp)}</div>
       <p class="sub">${esc(q.lectura)}</p>
       <div class="prompt es" style="font-size:1.15rem; margin-top:10px">${esc(q.es)}</div>
       <p class="ask">Palabra nueva. La vas a ver preguntada en un momento.</p>`;
    $('#qActs').innerHTML = `<button class="primary" id="btnNext">Entendido</button>`;
    $('#btnNext').onclick = siguiente;
    $('#btnNext').focus();
    $('#fb').classList.remove('show');
    return;
  }

  /* ── ficha de forma o de patron ── */
  if(q.tipo === 'ficha'){
    B.innerHTML =
      `<div class="prompt" style="font-size:1.7rem">${esc(q.ficha.titulo)}</div>
       <p class="sub">${esc(q.ficha.desc || '')}</p>
       <p class="ask">Es la primera vez que sale. Míralo y seguimos.</p>`;
    $('#qActs').innerHTML =
      `<button class="primary" id="btnNext">Entendido</button>` +
      `<button class="ghost thin" id="btnVerFicha">Ver la ficha</button>`;
    $('#btnNext').onclick = siguiente;
    $('#btnVerFicha').onclick = () => verFicha(q.ficha);
    verFicha(q.ficha);
    $('#fb').classList.remove('show');
    return;
  }

  if(q.tipo === 'escribir'){
    B.innerHTML =
      (q.promptEs ? `<div class="prompt es">${esc(q.promptEs)}</div>` : '') +
      (q.promptJp ? `<div class="prompt">${esc(q.promptJp)}</div>` : '') +
      (q.lectura ? `<p class="sub">${esc(q.lectura)}</p>` : '') +
      (q.sub ? `<p class="sub">${esc(q.sub)}</p>` : '') +
      (q.pide ? `<p class="ask">Escribe la <b>${esc(q.pide)}</b>${q.formaDesc?' <span class="sub">('+esc(q.formaDesc)+')</span>':''}</p>`
              : `<p class="ask">Escríbelo en japonés</p>`) +
      `<input type="text" id="inp" lang="ja" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">`;
    acciones(true);
    setTimeout(() => $('#inp') && $('#inp').focus(), 30);
  }

  else if(q.tipo === 'hueco' || q.tipo === 'hueco2'){
    B.innerHTML =
      `<p class="ask">Completa la frase</p>
       <div class="gapline">${esc(q.pre)}<input type="text" id="inp" lang="ja" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${esc(q.post)}` +
      (q.tipo === 'hueco2' ? `<input type="text" id="inp2" lang="ja" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${esc(q.post2)}` : '') +
      `</div>
       ${q.hintOculto ? '' : `<p class="sub" style="margin-top:12px"><b style="color:var(--ai)">${esc(q.hint)}</b></p>`}
       <p class="sub">${esc(q.sub)}</p>`;
    acciones(true);
    setTimeout(() => $('#inp') && $('#inp').focus(), 30);
  }

  else if(q.tipo === 'opcion'){
    /* El hueco pinta solo el blanco, no los parentesis: el contrato del contenido
       (y lo que el validador exige) es que el `pre` termine en （ y el `post`
       empiece por ）. Anadiendo otro par aqui salia （（　　））. */
    const enunciado =
      q.eleccion === 'patron'
        ? `<div class="prompt es">${esc(q.sub)}</div>
           <div class="gapline" style="margin-top:10px">${esc(q.pre)}<b style="color:var(--ai)">　　</b>${esc(q.post)}${q.post2 ? '<b style="color:var(--ai)">　　</b>' + esc(q.post2) : ''}</div>
           <p class="ask">¿Qué patrón pide este hueco?</p>`
      : q.eleccion === 'forma'
        ? `<div class="prompt">${esc(q.promptJp)}</div>
           ${q.lectura ? `<p class="sub">${esc(q.lectura)}</p>` : ''}
           <p class="sub">${esc(q.sub)}</p>
           <p class="ask">¿Cuál es la <b>${esc(q.pide)}</b>?</p>`
      : q.modo === 'grupo'
        ? `<div class="prompt">${esc(q.promptJp)}</div>
           ${q.lectura ? `<p class="sub">${esc(q.lectura)}</p>` : ''}
           <p class="sub">${esc(q.sub)}</p>
           <p class="ask">¿De qué grupo es este verbo?</p>`
        : `<div class="prompt">${esc(q.promptJp)}</div>
           <p class="sub">${esc(q.lectura)}</p>
           <p class="ask">¿Qué significa?</p>`;

    B.innerHTML = enunciado +
      `<div class="mc" id="mc">${q.opciones.map((o,i) => `<button data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    $('#mc').querySelectorAll('button').forEach(b => b.onclick = () => {
      if(respondida) return;
      if(b.disabled) return;
      const elegido = q.opciones[+b.dataset.i];
      const bien = elegido === q.correcta;
      /* en el primer fallo con pista no se revela nada todavia */
      if(!bien && !q.reintento && q.pista1){
        resolver(false, 'mal', q.correcta, q);
        return;
      }
      $('#mc').querySelectorAll('button').forEach(x => {
        if(q.opciones[+x.dataset.i] === q.correcta) x.classList.add('pick-ok');
        else if(x === b) x.classList.add('pick-no');
        x.disabled = true;
      });
      resolver(bien, bien ? 'ok' : 'mal', q.correcta, q);
    });
    acciones(false);
  }

  else if(q.tipo === 'armar'){
    B.innerHTML =
      `<div class="prompt es">${esc(q.promptEs)}</div>
       <p class="ask">Toca las piezas en el orden correcto</p>
       <div class="slot" id="slot"></div>
       <div class="pool" id="pool">${baraja(q.chips.map((c,i)=>({c,i}))).map(o =>
          `<button class="piece" data-c="${esc(o.c)}">${esc(o.c)}</button>`).join('')}</div>`;
    const slot = $('#slot'), pool = $('#pool');
    pool.querySelectorAll('.piece').forEach(b => b.onclick = () => {
      if(respondida) return;
      const cp = document.createElement('button');
      cp.className = 'piece'; cp.textContent = b.textContent;
      cp.onclick = () => { if(respondida) return; cp.remove(); b.style.display=''; };
      slot.appendChild(cp); b.style.display = 'none';
    });
    acciones(true);
  }

  $('#fb').classList.remove('show');
}

function acciones(conComprobar){
  const A = $('#qActs');
  A.innerHTML = conComprobar
    ? `<button class="primary" id="btnCheck">Comprobar</button><button class="ghost thin" id="btnSkip">No sé</button>`
    : `<button class="ghost thin" id="btnSkip">No sé</button>`;
  if($('#btnCheck')) $('#btnCheck').onclick = comprobar;
  if($('#btnSkip')) $('#btnSkip').onclick = () => {
    const q = cola[idx];
    if(respondida) return;
    resolver(false, 'mal', q.modelo, q, true);
  };
}

function comprobar(){
  const q = cola[idx];
  if(respondida){ siguiente(); return; }

  if(q.tipo === 'armar'){
    const dado = Array.from($('#slot').querySelectorAll('.piece')).map(x => x.textContent).join('');
    const r = revisar(dado, [q.chips.join('')]);
    resolver(r.estado === 'ok', r.estado, q.modelo, q);
    return;
  }

  const v1 = ($('#inp') && $('#inp').value) || '';
  if(!v1.trim()) return;

  if(q.tipo === 'hueco2'){
    const v2 = ($('#inp2') && $('#inp2').value) || '';
    const r1 = revisar(v1, q.ok), r2 = revisar(v2, q.ok2);
    const orden = e => e === 'ok' ? 2 : e === 'casi' ? 1 : 0;
    const peor = Math.min(orden(r1.estado), orden(r2.estado));
    const est = peor === 2 ? 'ok' : peor === 1 ? 'casi' : 'mal';
    resolver(est !== 'mal', est, q.ok[0] + ' … ' + q.ok2[0], q);
    return;
  }

  const r = revisar(v1, q.ok);
  resolver(r.estado === 'ok' || r.estado === 'casi', r.estado, r.modelo, q);
}

/* Pinta la pista del primer fallo. No revela la respuesta: deja lo escrito en
   el campo y ofrece "Comprobar de nuevo" y "Ver respuesta" (plano 3.1). */
function pintarPista(q){
  const p = q.pista1;
  const fb = $('#fb');
  fb.className = 'fb show casi';
  let cuerpo = '';

  if(p.clase === 'usos'){
    cuerpo = '<div class="why">' + p.usos.map(x =>
      '<b>' + esc(x.pat) + '</b> · ' + esc(x.uso)).join('<br>') + '</div>';
  } else if(p.clase === 'quita'){
    /* se retira una opcion incorrecta del tablero */
    $('#mc') && $('#mc').querySelectorAll('button').forEach(x => {
      if(q.opciones[+x.dataset.i] === p.quitar){ x.disabled = true; x.style.opacity = '.3'; }
    });
    cuerpo = '<div class="why">Esa no era. Quedan menos opciones.</div>';
  } else if(p.clase === 'pieza'){
    /* se fija la primera pieza en su lugar y se bloquea */
    const pool = $('#pool'), slot = $('#slot');
    if(pool && slot){
      slot.innerHTML = '';
      pool.querySelectorAll('.piece').forEach(b => { b.style.display = ''; });
      const b = [...pool.querySelectorAll('.piece')].find(x => x.textContent === p.pieza);
      if(b){
        const cp = document.createElement('button');
        cp.className = 'piece'; cp.textContent = p.pieza; cp.disabled = true;
        slot.appendChild(cp); b.style.display = 'none';
      }
    }
    cuerpo = '<div class="why">' + esc(p.texto) + '</div>';
  } else if(p.clase === 'esqueleto'){
    cuerpo = '<div class="model">' + esc(p.texto) + '</div>';
  } else {
    cuerpo = '<div class="why">' + esc(p.texto) + '</div>';
  }

  fb.innerHTML = '<div class="head">Casi. Prueba otra vez</div>' + cuerpo;

  const A = $('#qActs');
  const puedeReintentar = q.tipo !== 'opcion';
  A.innerHTML =
    (puedeReintentar ? '<button class="primary" id="btnCheck">Comprobar de nuevo</button>' : '') +
    '<button class="ghost thin" id="btnVer">Ver respuesta</button>';
  if($('#btnCheck')) $('#btnCheck').onclick = comprobar;
  $('#btnVer').onclick = () => {
    if(q.tipo === 'opcion' && $('#mc')){
      $('#mc').querySelectorAll('button').forEach(x => {
        if(q.opciones[+x.dataset.i] === q.correcta) x.classList.add('pick-ok');
        x.disabled = true;
      });
    }
    resolver(false, 'mal', q.modelo, q, true);
  };
  const foco = $('#inp') || $('#btnVer');
  if(foco) foco.focus();
}

/* El progreso se registra en el primer fallo, porque el item no se sabia; el
   segundo intento es aprendizaje y no cambia el registro. En el marcador
   cuenta como fallado aunque el segundo intento acierte, y el resumen lo
   lista aparte como recuperada con pista (plano 3.1). */
function resolver(bien, estado, modelo, q, rendido){
  /* ── primer fallo con pista disponible ── */
  if(estado === 'mal' && !rendido && !q.reintento && q.pista1){
    q.reintento = true;
    if(!q.repaso){
      marcar(q.id, 'mal');
      fallos.push({ q, modelo: q.modelo, conPista: true });
    }
    pintarPista(q);
    return;
  }

  respondida = true;
  const segundoIntento = !!q.reintento;

  /* El repaso del final es una segunda exposicion, no una evaluacion: no
     registra progreso ni cuenta en el marcador (plano 3.4). */
  if(bien && !q.repaso) aciertos++;

  if(!segundoIntento && !q.repaso){
    /* la copia se toma antes de tocar el registro: "La tenía bien" la restaura
       en vez de marcar acierto sobre el registro ya penalizado (Anexo A) */
    q.previo = copiaDe(q.id);
    marcar(q.id, estado);
    if(!bien) fallos.push({ q, modelo });
  } else if(segundoIntento && bien){
    /* recuperada con pista: sale de fallos y entra en su propia lista */
    const i = fallos.findIndex(f => f.q === q);
    if(i >= 0){ recuperadas.push(fallos[i]); fallos.splice(i, 1); }
  }

  const fb = $('#fb');
  fb.className = 'fb show ' + (estado === 'ok' ? 'ok' : estado === 'casi' ? 'casi' : 'no');
  let head = estado === 'ok' ? (segundoIntento ? 'Correcto, con la pista' : 'Correcto')
           : estado === 'casi' ? 'Casi'
           : (rendido ? 'La respuesta era' : 'No');
  let why = '';
  if(estado === 'casi') why = '<div class="why">Lo tenías, pero falla una vocal larga o un kana pequeño. Fíjate en la forma exacta.</div>';
  if(q.lecturaResp && q.lecturaResp !== modelo) why += '<div class="why">Lectura: <b>' + esc(q.lecturaResp) + '</b></div>';
  if(estado !== 'ok' && q.regla) why += '<div class="why">' + esc(q.regla) + '</div>';
  if(estado !== 'ok' && q.nota) why += '<div class="why"><b>Ojo:</b> ' + esc(q.nota) + '</div>';
  /* la correccion ensena la regla, no solo la respuesta */
  if(estado !== 'ok' && q.ejemplo2)
    why += '<div class="why">Misma regla: <b>' + esc(q.ejemplo2.verbo) + ' → ' + esc(q.ejemplo2.salida) + '</b></div>';
  if(estado !== 'ok' && q.modo === 'hueco' && q.hint)
    why += '<div class="why">' + esc(q.hint) + '</div>';
  if(estado !== 'ok' && q.eleccion === 'patron')
    why += '<div class="why">' + esc(usoDelPatron(q.unidad, q.correcta)) + '</div>';

  const cuerpo = (q.modo === 'hueco' && estado !== 'ok')
    ? q.pre + q.ok[0] + q.post + (q.ok2 ? q.ok2[0] + (q.post2 || '') : '')
    : modelo;
  fb.innerHTML = `<div class="head">${head}</div><div class="model">${esc(cuerpo)}</div>${why}`;

  const A = $('#qActs');
  const ultima = idx + 1 >= cola.length;
  A.innerHTML = `<button class="primary" id="btnNext">${ultima ? 'Ver resumen' : 'Siguiente'}</button>` +
    (estado !== 'ok' && !rendido && !segundoIntento && !q.repaso ? `<button class="ghost thin" id="btnOk">La tenía bien</button>` : '') +
    (estado === 'ok' && !segundoIntento && !q.repaso && !jubilado(q.id) ? `<button class="ghost thin" id="btnSabida">Ya la sé</button>` : '');
  $('#btnNext').onclick = siguiente;
  if($('#btnOk')) $('#btnOk').onclick = () => {
    aciertos++;
    restaurar(q.id, q.previo);
    marcar(q.id, 'ok');
    fallos = fallos.filter(f => f.q !== q);
    $('#btnOk').remove();
    $('#mScore').textContent = aciertos + ' correctas';
    fb.className = 'fb show ok';
    fb.querySelector('.head').textContent = 'Marcada como correcta';
  };
  if($('#btnSabida')) $('#btnSabida').onclick = () => {
    marcarAprendido(q.id);
    $('#btnSabida').remove();
    fb.insertAdjacentHTML('beforeend',
      '<div class="why">Marcada como sabida. Vuelve dentro de 120 días.</div>');
  };
  $('#btnNext').focus();
}

/* Los fallados se vuelven a preguntar una vez al final, sin registrar
   progreso y sin contar en el marcador. Es la segunda exposicion que convierte
   el fallo en aprendizaje ese mismo dia (plano 3.4). */
function agregarRepaso(){
  if(repasoPuesto) return false;
  repasoPuesto = true;
  const pendientes = fallos.concat(recuperadas)
    .map(f => f.q)
    .filter((q, i, a) => a.indexOf(q) === i && esPregunta(q));
  if(!pendientes.length) return false;
  for(const q of pendientes){
    const copia = Object.assign({}, q, { repaso:true, reintento:false, previo:null });
    cola.push(copia);
  }
  return true;
}

function siguiente(){
  idx++;
  if(idx >= cola.length){
    if(agregarRepaso()) return pintarPregunta();
    return terminar();
  }
  pintarPregunta();
}

function terminar(){
  $('#rail').style.width = '100%';

  /* Tres conteos y nada mas. En repaso espaciado la sesion no es una prueba, y
     una tasa de fallo alta es el estado normal de quien recien empieza una
     unidad: el porcentaje y las frases de juicio del archivo congelado sobran
     (Anexo B). */
  const nPreg = cola.filter(esPregunta).length;
  $('#endScore').innerHTML =
    `<span>${aciertos}</span> <small>${aciertos === 1 ? 'correcta' : 'correctas'}</small>` +
    (recuperadas.length ? ` · <span>${recuperadas.length}</span> <small>con pista</small>` : '') +
    (fallos.length ? ` · <span>${fallos.length}</span> <small>${fallos.length === 1 ? 'fallada' : 'falladas'}</small>` : '');
  $('#endLine').textContent = nPreg + (nPreg === 1 ? ' pregunta' : ' preguntas') + ' en esta sesión.';

  const miss = $('#endMiss');
  const lista = fallos.concat(recuperadas.map(r => Object.assign({}, r, { pista:true })));
  if(lista.length){
    $('#endMissCard').classList.remove('hide');
    miss.innerHTML = '<tr><th>Pregunta</th><th>Respuesta</th></tr>' + lista.map(f =>
      `<tr><td>${esc(enunciado(f.q))}${f.pista ? '<br><small class="sub">recuperada con pista</small>' : ''}</td>` +
      `<td class="jp">${esc(f.modelo)}</td></tr>`).join('');
  } else $('#endMissCard').classList.add('hide');

  /* Cuántas quedan para hoy: sin esto, el tope por atraso es invisible. */
  const pan = panoramaHoy();
  $('#endPend').textContent = pan.vencidas
    ? 'Te quedan ' + pan.vencidas + ' vencidas para hoy.'
    : 'No queda nada vencido para hoy.';
  $('#btnMas').classList.toggle('hide', !pan.vencidas && !pan.nuevas);

  ir('scEnd');
  pintarHistorial();
}

/* "Seguir 10 más": arma otra cola con la misma regla. Es lo que cubre la
   sesión de quince minutos sin agregar una opción de sesión por tiempo. */
function seguirMas(){
  const guardado = sel.largo;
  sel.largo = 10;
  const r = construir(false);
  sel.largo = guardado;
  if(!r.cola.length){
    dialogo({ titulo:'No queda nada por ahora', texto:'Vuelve mañana, o usa "Elegir qué practicar" para repasar lo que quieras.' });
    return;
  }
  idx = 0; aciertos = 0; fallos = []; recuperadas = []; repasoPuesto = false;
  ir('scPlay'); pintarPregunta();
}

/* ═══════════ dialogos propios ═══════════ */

/* Reemplaza a alert y confirm, que en una PWA instalada muestran el nombre del
   origen y rompen la ilusion de app. Cuatro usos y no se generaliza mas:
   el aviso de combinacion vacia, el borrado de progreso, la importacion y el
   aviso de migracion (plano 3.3). */
function dialogo({ titulo, texto, campo, botones }){
  return new Promise(resolve => {
    const d = $('#dlg');
    const bs = (botones || [{ t:'Entendido', v:'ok', p:true }]);
    d.innerHTML = `<div class="dlgcaja" role="dialog" aria-modal="true">
      ${titulo ? `<h2 class="sec">${esc(titulo)}</h2>` : ''}
      ${texto ? `<p class="sub" style="color:var(--ink-2)">${esc(texto)}</p>` : ''}
      ${campo !== undefined ? `<textarea id="dlgCampo" spellcheck="false">${esc(campo)}</textarea>` : ''}
      <div class="acts">${bs.map((b,i) =>
        `<button class="${b.p ? 'primary' : 'ghost'}" data-i="${i}">${esc(b.t)}</button>`).join('')}</div>
    </div>`;
    d.classList.remove('hide');
    const cerrar = v => {
      const campoVal = $('#dlgCampo') ? $('#dlgCampo').value : undefined;
      d.classList.add('hide'); d.innerHTML = '';
      document.removeEventListener('keydown', escapar, true);
      resolve({ boton: v, campo: campoVal });
    };
    const escapar = e => {
      if(e.key !== 'Escape') return;
      e.preventDefault(); e.stopPropagation();
      cerrar(bs.find(b => b.cancela) ? bs.find(b => b.cancela).v : null);
    };
    d.querySelectorAll('button').forEach(b => b.onclick = () => cerrar(bs[+b.dataset.i].v));
    document.addEventListener('keydown', escapar, true);
    const primero = d.querySelector('#dlgCampo') || d.querySelector('button.primary') || d.querySelector('button');
    if(primero) primero.focus();
    if($('#dlgCampo')) $('#dlgCampo').select();
  });
}

/* ═══════════ exportar e importar ═══════════ */

async function accionExportar(){
  const { nombre, texto } = exportar();
  const n = Object.keys(prog).length;
  const verTexto = () => dialogo({
    titulo: 'Tu progreso en texto',
    texto: 'Cópialo y guárdalo donde quieras. Sirve igual que el archivo.',
    campo: texto,
    botones: [{ t:'Listo', v:'ok', p:true }]
  });

  /* 1. Compartir el archivo. En Android instalado es la via mas fiable para
        mandarlo a Drive, WhatsApp o correo (plano 4.2). */
  try {
    if(typeof File === 'function' && navigator.canShare){
      const archivo = new File([texto], nombre, { type:'application/json' });
      if(navigator.canShare({ files:[archivo] })){
        await navigator.share({ files:[archivo], title:nombre });
        return;
      }
    }
  } catch(e){ if(e && e.name === 'AbortError') return; }

  /* 2. Descarga directa. */
  let bajo = false;
  try {
    const url = URL.createObjectURL(new Blob([texto], { type:'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    bajo = true;
  } catch(e){}

  if(bajo){
    const r = await dialogo({
      titulo: 'Progreso exportado',
      texto: nombre + ' · ' + n + ' ítems. Si no lo encuentras en Descargas, copia el texto.',
      botones: [{ t:'Listo', v:'ok', p:true }, { t:'Ver el texto', v:'texto' }]
    });
    if(r.boton === 'texto') await verTexto();
    return;
  }

  /* 3. Cuadro de texto. */
  await verTexto();
}

async function aplicarTexto(texto){
  const d = leerExportacion(texto);
  if(d.error){
    await dialogo({ titulo:'No se pudo importar', texto:d.error });
    return false;
  }
  const n = Object.keys(d.prog).length;
  if(!n){
    await dialogo({ titulo:'No se pudo importar', texto:'El archivo no trae ningún ítem con progreso.' });
    return false;
  }

  let aviso = n + ' ítems' + (d.esquema === 1 ? ', traídos de la app del Tema 8' : '') + '.';
  if(d.perdidos && d.perdidos.length) aviso += ' ' + d.perdidos.length + ' no se pudieron traducir y se descartan.';
  const desf = desfase(d.hoy);
  if(desf > 1) aviso += ' Ojo: el archivo se exportó con una fecha que difiere en ' + desf + ' días de la de este dispositivo.';

  const r = await dialogo({
    titulo: 'Importar progreso',
    texto: aviso + ' Fusionar conserva lo mejor de cada lado; reemplazar borra lo que tienes aquí.',
    botones: [
      { t:'Fusionar', v:'fusionar', p:true },
      { t:'Reemplazar todo', v:'reemplazar' },
      { t:'Cancelar', v:null, cancela:true }
    ]
  });
  if(!r.boton) return false;

  aplicarImportacion(d, r.boton === 'reemplazar');
  pintarInicio();
  await dialogo({
    titulo: 'Progreso importado',
    texto: Object.keys(prog).length + ' ítems en total. Si algo salió mal, "Deshacer la importación" lo devuelve como estaba.'
  });
  return true;
}

function accionImportar(){
  const inp = $('#fileImport');
  inp.value = '';
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if(!f) return;
    const fr = new FileReader();
    fr.onload = () => aplicarTexto(String(fr.result || ''));
    fr.onerror = () => dialogo({ titulo:'No se pudo leer el archivo' });
    fr.readAsText(f);
  };
  inp.click();
}

async function accionPegar(){
  const r = await dialogo({
    titulo: 'Pegar el progreso',
    texto: 'Pega aquí el texto que exportaste desde el otro dispositivo o desde el puente.',
    campo: '',
    botones: [{ t:'Importar', v:'ok', p:true }, { t:'Cancelar', v:null, cancela:true }]
  });
  if(r.boton && String(r.campo || '').trim()) await aplicarTexto(r.campo);
}

async function accionDeshacer(){
  const r = await dialogo({
    titulo: 'Deshacer la última importación',
    texto: 'Vuelve el progreso al estado anterior a la importación. Lo importado se pierde.',
    botones: [{ t:'Deshacer', v:'ok', p:true }, { t:'Cancelar', v:null, cancela:true }]
  });
  if(r.boton !== 'ok') return;
  deshacerImportacion();
  pintarInicio();
}

async function accionBorrar(){
  const r = await dialogo({
    titulo: 'Borrar tu progreso',
    texto: 'Se borra todo lo guardado en este dispositivo. Exporta antes si quieres conservarlo.',
    botones: [{ t:'Borrar', v:'ok' }, { t:'Cancelar', v:null, p:true, cancela:true }]
  });
  if(r.boton !== 'ok') return;
  respaldar();
  prog = {}; save();
  pintarInicio();
}

function pintarAccionesProgreso(){
  $('#btnUndo').classList.toggle('hide', !hayRespaldo());
}

/* ═══════════ material de estudio ═══════════ */

/* La ficha se arma como HTML porque tiene tabla y ejemplos; `dialogo` recibe
   texto plano, así que el material usa su propio contenedor sobre el mismo
   velo. Es el único sitio que necesita marcado dentro del diálogo. */
function verFicha(f){
  if(!f) return;
  const d = $('#dlg');
  let cuerpo = '';

  if(f.uso) cuerpo += `<p class="f-uso">${esc(f.uso)}</p>`;

  if(f.tipo === 'forma'){
    cuerpo += `<div class="tblwrap"><table><tr><th>Grupo</th><th>Verbo</th><th>Queda en</th></tr>` +
      f.grupos.map(g => `<tr>
        <td>${g.g}</td>
        <td class="jp">${esc(g.verbo)}<small class="sub" style="display:block">${esc(g.es)}</small></td>
        <td class="jp">${esc(g.salida)}${g.salida !== g.lectura ? `<small class="sub" style="display:block">${esc(g.lectura)}</small>` : ''}</td>
      </tr>`).join('') + `</table></div>`;
    const reglas = f.grupos.filter(g => g.regla);
    if(reglas.length) cuerpo += `<p class="f-nota">${reglas.map(g => esc(g.regla)).join('<br>')}</p>`;
    if(f.exc.length) cuerpo += `<p class="f-nota"><b>Excepciones:</b> ` +
      f.exc.map(e => esc(e.kana) + ' → ' + esc(e.salida)).join(' · ') + `</p>`;
  } else {
    /* Como se construye. "Se pega a la forma simple" no le dice a nadie que
       poner: la formula nombra cada pieza y el orden en que van. */
    if(f.formula) cuerpo +=
      `<h2 class="sec" style="margin:18px 0 8px">Cómo se construye</h2>
       <div class="f-formula">${esc(f.formula)}</div>`;
    if(f.frases.length) cuerpo += `<h2 class="sec" style="margin:18px 0 8px">En el libro</h2>`;
    cuerpo += f.frases.map(x =>
      `<div class="f-ej">${esc(x.jp)}${x.es ? `<small>${esc(x.es)}</small>` : ''}</div>`).join('');
    if(f.huecos) cuerpo += `<p class="f-nota">Lo practicas en ${plural(f.huecos, 'ejercicio')} de hueco.</p>`;
  }

  /* Como se lee y que significa el termino. Sin esto, 他動詞 obliga a salir de
     la app a buscarlo. */
  const pie = [f.lectura, f.significado].filter(Boolean).join(' — ');

  d.innerHTML = `<div class="dlgcaja ficha" role="dialog" aria-modal="true">
    <h2 class="sec">${esc(f.desc || '')}</h2>
    <div class="prompt" style="margin:0; font-size:1.7rem">${esc(f.titulo)}</div>
    ${pie ? `<p class="sub" style="margin:4px 0 14px">${esc(pie)}</p>` : '<div style="height:12px"></div>'}
    ${cuerpo}
    <div class="acts"><button class="primary" id="fCerrar">Cerrar</button></div>
  </div>`;
  d.classList.remove('hide');
  const escapar = e => { if(e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); cerrar(); } };
  const cerrar = () => {
    d.classList.add('hide'); d.innerHTML = '';
    document.removeEventListener('keydown', escapar, true);
  };
  $('#fCerrar').onclick = cerrar;
  document.addEventListener('keydown', escapar, true);
  $('#fCerrar').focus();
}

/* "1 ejercicios" delata que nadie leyó la pantalla */
function plural(n, sing, pl){
  if(!n) return '';
  return n + ' ' + (n === 1 ? sing : (pl || sing + 's'));
}

function filaMaterial(titulo, uso, nota, lectura, significado){
  const pie = [lectura, significado].filter(Boolean).join(' — ');
  return `<button class="ghost">
    <span class="m-t"><span class="m-jp">${esc(titulo)}</span>${nota ? `<span class="m-n">${esc(nota)}</span>` : ''}</span>
    ${pie ? `<span class="m-lec">${esc(pie)}</span>` : ''}
    <span class="m-u">${esc(uso || 'Sin descripción todavía.')}</span>
  </button>`;
}

function pintarMateria(){
  const listas = unidadesListas();
  if(!sel.matUnidad || !listas.includes(sel.matUnidad)) sel.matUnidad = unidadActual() || listas[0];

  chips('#matUnidades', listas.map(n => [String(n), 'Unidad ' + n]),
    v => sel.matUnidad === +v, v => { sel.matUnidad = +v; pintarMateria(); });

  const m = materiaDe(sel.matUnidad);
  const cuerpo = $('#matCuerpo');
  if(!m){ cuerpo.innerHTML = '<div class="card"><p class="sub">Esa unidad todavía no tiene contenido.</p></div>'; return; }

  const paginas = m.paginas
    ? 'Clase 1, páginas ' + m.paginas[1] + ' · Clase 2, páginas ' + m.paginas[2]
    : '';

  const bloque = (titulo, filas, extra) => filas
    ? `<div class="card"><h2 class="sec">${titulo}</h2>${extra || ''}<div class="mat">${filas}</div></div>` : '';

  cuerpo.innerHTML =
    `<div class="card">
       <div class="prompt" style="margin:0; font-size:1.6rem">${esc(m.titulo)}</div>
       <p class="sub">${esc(m.es)}${paginas ? ' · ' + esc(paginas) : ''}</p>
       <p class="sub" style="margin-top:8px">${m.gramatica.length} patrones · ${m.formas.length} formas de conjugación · ${m.vocab.length} palabras · ${m.verbos.length} verbos</p>
     </div>` +

    bloque('Patrones gramaticales',
      /* Las frases dejaron de ser ejercicio al retirarse el modo "frase completa":
         sumarlas aquí prometía una práctica que ya no existe. Un patrón sin ningún
         hueco no miente diciendo "0 ejercicios", dice cuántos ejemplos trae. */
      m.gramatica.map(p => filaMaterial(p.pat, p.uso,
        p.huecos ? plural(p.huecos, 'ejercicio') : plural(p.frases, 'ejemplo'),
        p.lectura, p.es)).join(''),
      '<p class="sub" style="margin:-6px 0 12px">Toca uno para ver el ejemplo y dónde se practica.</p>') +

    bloque('Formas de conjugación',
      m.formas.map(f => filaMaterial(f.label, f.uso, f.clases.length === 2 ? 'las dos clases' : 'clase ' + f.clases[0], f.lectura, f.desc)).join(''),
      '<p class="sub" style="margin:-6px 0 12px">Toca una para ver la regla de cada grupo con un ejemplo.</p>') +

    bloque('Expresiones y fórmulas',
      m.expresiones.map(p => filaMaterial(p.pat, p.uso, '', p.lectura, p.es)).join('')) +

    `<div class="card"><h2 class="sec">Verbos</h2><div class="matlista">` +
      m.verbos.map(v => `<div><span class="w-jp ${prog['c:'+v.kana+':masu'] ? 'visto' : ''}">${esc(v.kanji || v.kana)}${v.kanji && v.kanji !== v.kana ? `<small> ${esc(v.kana)}</small>` : ''}</span><span class="w-es">${esc(v.es)} · G${v.g}</span></div>`).join('') +
    `</div></div>` +

    `<div class="card"><h2 class="sec">Vocabulario</h2><div class="matlista">` +
      m.vocab.map(v => `<div><span class="w-jp ${prog['v:'+v.jp+':jp'] ? 'visto' : ''}">${esc(v.jp)}${v.kana !== v.jp ? `<small> ${esc(v.kana)}</small>` : ''}</span><span class="w-es">${esc(v.es)}</span></div>`).join('') +
    `</div><p class="sub" style="margin-top:10px">En verde, lo que ya has visto en alguna sesión.</p></div>` +

    (m.kanji.length ? `<div class="card"><h2 class="sec">Palabras con kanji</h2><div class="matlista">` +
      m.kanji.map(v => `<div><span class="w-jp">${esc(v.jp)}</span><span class="w-es">${esc(v.kana)}</span></div>`).join('') +
    `</div><p class="sub" style="margin-top:10px">El kanji es de reconocimiento: se lee y se identifica, no se escribe.</p></div>` : '');

  /* cablear las fichas por posición dentro de cada bloque */
  const fuentes = [
    m.gramatica.map(p => () => fichaPatron(m.n, p.pat)),
    m.formas.map(f => () => fichaForma(f.id)),
    m.expresiones.map(p => () => fichaPatron(m.n, p.pat)),
  ].filter(x => x.length);
  [...cuerpo.querySelectorAll('.mat')].forEach((bl, i) => {
    [...bl.querySelectorAll('button')].forEach((b, j) => {
      if(fuentes[i] && fuentes[i][j]) b.onclick = () => verFicha(fuentes[i][j]());
    });
  });
}

/* ═══════════ contenido suelto y versión nueva ═══════════ */

/* Con la build --sin-contenido, la app llega vacía y el contenido se carga una
   vez desde un archivo. Queda en localStorage y no se vuelve a pedir; nueve
   unidades a la densidad del Tema 8 pesan bastante menos que el límite
   habitual de 5 MB (plano 6.5). */
const hayContenido = () => UNIDADES.length > 0;

async function aplicarContenido(texto){
  let d;
  try { d = JSON.parse(texto); } catch(e){
    await dialogo({ titulo:'No se pudo cargar', texto:'El archivo no es JSON válido.' });
    return false;
  }
  if(!d || !Array.isArray(d.unidades) || !d.unidades.length){
    await dialogo({ titulo:'No se pudo cargar', texto:'Ese archivo no trae el contenido de ninguna unidad.' });
    return false;
  }
  if(!escribirLS(LS_CONTENIDO, d)){
    await dialogo({ titulo:'No se pudo guardar', texto:'El navegador no dejó guardar el contenido en este dispositivo.' });
    return false;
  }
  await dialogo({
    titulo:'Contenido cargado',
    texto: d.unidades.length + (d.unidades.length === 1 ? ' unidad' : ' unidades') +
           '. La app se reinicia para usarlo.'
  });
  location.reload();
  return true;
}

function accionCargarContenido(){
  const inp = $('#fileContenido');
  inp.value = '';
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if(!f) return;
    const fr = new FileReader();
    fr.onload = () => aplicarContenido(String(fr.result || ''));
    fr.onerror = () => dialogo({ titulo:'No se pudo leer el archivo' });
    fr.readAsText(f);
  };
  inp.click();
}

/* El aviso de versión es propio, no el del navegador: en una PWA instalada el
   diálogo del sistema muestra el origen y rompe la ilusión de app (plano 6.4). */
async function avisarVersionNueva(nuevo){
  const r = await dialogo({
    titulo: 'Hay una versión nueva',
    texto: 'Se instaló una actualización. Tu progreso no se toca.',
    botones: [{ t:'Actualizar', v:'ok', p:true }, { t:'Más tarde', v:null, cancela:true }]
  });
  if(r.boton !== 'ok') return;
  nuevo.postMessage('skipWaiting');
}

/* El archivo único abierto desde un origen opaco no guarda nada entre
   aperturas, y el usuario lo descubre con el historial vacío. Solo se avisa
   cuando el almacenamiento falla de verdad, no por el hecho de ser un archivo:
   guardado en una carpeta y abierto siempre igual, funciona (sección 10). */
function avisarSiNoGuarda(){
  if(location.protocol === 'http:' || location.protocol === 'https:') return;
  let guarda = false;
  try {
    localStorage.setItem('dojo-prueba', '1');
    guarda = localStorage.getItem('dojo-prueba') === '1';
    localStorage.removeItem('dojo-prueba');
  } catch(e){ guarda = false; }
  if(guarda) return;
  dialogo({
    titulo: 'Aquí no se puede guardar tu progreso',
    texto: 'Estás abriendo el archivo desde un sitio donde el navegador no deja guardar nada. ' +
           'Guárdalo en una carpeta y ábrelo siempre desde ahí, o instala la app desde su dirección.'
  });
}

/* ══ 70-arranque.js ══ */
/* Dojo Marugoto - arranque
   El almacen se inicia antes del primer render, porque puede migrar desde el
   Tema 8, y de ahi sale si toca la pantalla de primer uso o el inicio. */

/* `manual` distingue la sesion del menu de la de "Practicar hoy". Las dos
   pasan por el mismo programador; lo unico que cambia es el pool (plano 2.4). */
function empezar(manual){
  const r = construir(!!manual);
  if(!cola.length){
    dialogo({
      titulo: 'No hay preguntas con esa combinación',
      texto: manual
        ? 'Prueba con otra unidad, otra clase, o marca otro modo.'
        : 'Todavía no hay contenido para practicar.'
    });
    return;
  }
  idx = 0; aciertos = 0; fallos = []; recuperadas = []; repasoPuesto = false;
  ir('scPlay'); pintarPregunta();
  return r;
}

$('#btnStart').onclick       = () => empezar(false);
$('#btnStartManual').onclick = () => empezar(true);
$('#btnMas').onclick         = seguirMas;
$('#btnMenu').onclick        = () => { pintarMenu(); ir('scMenu'); };
$('#btnVolver').onclick      = () => { pintarInicio(); ir('scHome'); };
$('#btnMateria').onclick     = () => { pintarMateria(); ir('scMateria'); };
$('#btnMatVolver').onclick   = () => { pintarInicio(); ir('scHome'); };
$('#btnHome').onclick        = () => { pintarInicio(); ir('scHome'); };
$('#btnQuit').onclick        = () => { cola = cola.slice(0, idx); terminar(); };

$('#btnPrimero').onclick = () => {
  sel.primerUso = false; saveCfg();
  pintarInicio(); ir('scHome');
};

$('#btnCargar').onclick  = accionCargarContenido;
$('#btnExport').onclick = accionExportar;
$('#btnImport').onclick = accionImportar;
$('#btnPaste').onclick  = accionPegar;
$('#btnUndo').onclick   = accionDeshacer;
$('#btnReset').onclick  = accionBorrar;

document.addEventListener('keydown', e => {
  if(!$('#dlg').classList.contains('hide')) return;   /* el dialogo maneja el suyo */
  if($('#scPlay').classList.contains('hide')) return;
  if(e.key === 'Enter'){
    e.preventDefault();
    if(respondida){ siguiente(); }
    else if($('#btnCheck')) comprobar();
  }
});

iniciarProgreso();

/* Las dos preguntas del primer uso solo aparecen con el almacen vacio y sin
   migracion: quien ya tenia historial no pasa por ahi (Anexo B). */
if(sel.primerUso && !Object.keys(prog).length && unidadesListas().length){
  pintarPrimerUso();
  ir('scPrimero');
} else {
  if(sel.primerUso){ sel.primerUso = false; saveCfg(); }
  pintarInicio();
  ir('scHome');
}

/* El aviso de migracion se muestra una sola vez, en el arranque en que ocurre.
   Si algun id no se pudo traducir se dice cuantos: con la tabla bien generada
   debe estar vacio, y la prueba de M1 lo exige (plano 5.2). */
if(avisoMigracion){
  dialogo({
    titulo: 'Tu historial del Tema 8 se trajo a la versión nueva',
    texto: avisoMigracion.items + ' ítems' +
      (avisoMigracion.perdidos.length
        ? '. ' + avisoMigracion.perdidos.length + ' no se pudieron traducir y se descartaron.'
        : '. Nada se perdió.') +
      ' Tu progreso antiguo queda intacto por si acaso.'
  });
}

/* ═══════════ service worker ═══════════ */

/* Solo en la salida PWA: el archivo único no lleva manifest, y desde file://
   el service worker no existe. La detección es el propio manifest, así que no
   hace falta ninguna bandera del build. */
if('serviceWorker' in navigator && document.querySelector('link[rel="manifest"]')){
  navigator.serviceWorker.register('./sw.js').then(reg => {
    reg.update();
    reg.addEventListener('updatefound', () => {
      const nuevo = reg.installing;
      if(!nuevo) return;
      nuevo.addEventListener('statechange', () => {
        /* hay controlador previo: es una actualizacion, no la primera visita */
        if(nuevo.state === 'installed' && navigator.serviceWorker.controller){
          avisarVersionNueva(nuevo);
        }
      });
    });
  }).catch(() => {});

  let recargando = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if(recargando) return;
    recargando = true;
    location.reload();
  });
}

avisarSiNoGuarda();
