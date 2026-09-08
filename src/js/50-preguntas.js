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
        ids.forEach((fid, j) => {
          const f = FORMAS.find(x => x.id === fid);
          if(!f || !enClaseDe(v.c)) return;
          meter({
            modo:'conj', tipo:'escribir', id:'c:'+v.kana+':'+f.id, tag:'Conjugación',
            unidad:u.n, clase:v.c, orden:i * 20 + j, kana:v.kana, forma:f.id,
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

    if(modos.includes('frase'))
      u.frases.forEach((f, i) => { if(!enClaseDe(f.c)) return; meter({
        modo:'frase', tipo:'escribir', id:'f:'+u.n+':'+f.k, tag:'Frase completa',
        unidad:u.n, clase:f.c, orden:i, tag2:f.pat, pat:f.pat,
        promptEs:f.es, ok:f.ok, modelo:f.ok[0], libre:true
      }); });
  }
  return pool;
}

/* Arma la sesión. `manual` es la del menú "Elegir qué practicar", que filtra
   el pool pero pasa por el mismo programador: también respeta vencimientos y
   también registra progreso (plano 2.4). */
/* Los seis modos, sin depender de la tabla de la interfaz */
const TODOS_LOS_MODOS = ['vocabES','vocabJP','conj','hueco','armar','frase'];

function construir(manual){
  const filtro = manual
    ? { modos: sel.modos, clase: sel.clase, unidades: sel.unidades }
    : { modos: TODOS_LOS_MODOS, clase: '0', unidades: [] };

  const pool = armarPool(filtro);
  const r = seleccionar(pool, sel.largo, sel.cupoNuevos, unidadActual(), HOY);
  cola = r.cola;
  return r;
}

/* Lo que habría hoy en "Practicar hoy", para el subtítulo del botón. */
function panoramaHoy(){
  const pool = armarPool({ modos: TODOS_LOS_MODOS, clase:'0', unidades:[] });
  return panorama(pool, sel.largo, sel.cupoNuevos, unidadActual(), HOY);
}
