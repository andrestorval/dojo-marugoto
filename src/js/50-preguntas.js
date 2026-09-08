/* Dojo Marugoto - construccion de preguntas
   baraja, distractores y construir. Contenido literal del archivo congelado. */

function baraja(a){ const r = a.slice(); for(let i=r.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }
/* --- distractores del mismo campo semántico -------------------
   Sin esto, las opciones se descartan por sentido común y el
   ejercicio no mide nada. Dos reglas:
   1. Primero se buscan palabras de la misma categoría.
   2. Se descarta cualquier opción que en español se pise con la
      correcta o con otra opción ya elegida (agua / agua caliente,
      vuelo / vuelo número, habitación / habitación número).
--------------------------------------------------------------- */
function sinTildes(t){
  return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
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
function distractores(v){
  const libres = VOCAB.filter(x => x.jp !== v.jp && !chocan(x.es, v.es));
  const mismos = baraja(libres.filter(x => x.cat === v.cat));
  const resto  = baraja(libres.filter(x => x.cat !== v.cat));
  const out = [];
  for(const c of mismos.concat(resto)){
    if(out.length >= 3) break;
    if(out.some(o => chocan(o.es, c.es))) continue;
    out.push(c);
  }
  return out.map(x => x.es);
}

/* ═══════════ construcción de preguntas ═══════════ */
function construir(){
  let pool = [];

  if (sel.modos.includes('vocabES'))
    VOCAB.filter(v => enClase(v.c)).forEach(v => pool.push({
      tipo:'escribir', id:'v:'+v.jp+':es', tag:'Vocabulario', clase:v.c,
      promptEs:v.es, ok:[v.jp, v.kana], modelo:v.jp, lectura:v.kana
    }));

  if (sel.modos.includes('vocabJP'))
    VOCAB.filter(v => enClase(v.c)).forEach(v => pool.push({
      tipo:'opcion', id:'v:'+v.jp+':jp', tag:'Vocabulario', clase:v.c,
      promptJp:v.jp, lectura:v.kana, correcta:v.es, modelo:v.es,
      opciones: baraja([v.es].concat(distractores(v)))
    }));

  if (sel.modos.includes('conj')){
    const formas = FORMAS.filter(f => sel.clase === '0' || f.c.includes(+sel.clase));
    VERBOS.filter(v => enClase(v.c)).forEach(v => formas.forEach(f => {
      pool.push({
        tipo:'escribir', id:'c:'+v.kana+':'+f.id, tag:'Conjugación', clase:v.c,
        promptJp:v.kanji, lectura:(v.kanji!==v.kana? v.kana : ''),
        pide:f.label, sub:v.es + ' · Grupo ' + v.g, nota:v.nota || '',
        ok: aceptadasDeConjugacion(v, f.id), modelo: conKanji(v, conjugar(v,f.id)) || conjugar(v,f.id),
        lecturaResp: conjugar(v, f.id), grupo:v.g, forma:f.desc, regla: reglaDe(v, f.id)
      });
    }));
  }

  if (sel.modos.includes('hueco'))
    HUECOS.forEach((h,i) => { if(!enClase(h.c)) return; pool.push({
      tipo: h.ok2 ? 'hueco2' : 'hueco', id:'h:'+i, tag:'Frase con hueco', clase:h.c,
      pre:h.pre, post:h.post, post2:h.post2, hint:h.hint, ok:h.ok, ok2:h.ok2, sub:h.es,
      modelo:h.ok[0] + (h.ok2 ? ' … ' + h.ok2[0] : '')
    }); });

  if (sel.modos.includes('armar'))
    ARMAR.forEach((a,i) => { if(!enClase(a.c)) return; pool.push({
      tipo:'armar', id:'a:'+i, tag:'Armar la frase', clase:a.c,
      promptEs:a.es, chips:a.chips, modelo:a.chips.join('')
    }); });

  if (sel.modos.includes('frase'))
    FRASES.forEach((f,i) => { if(!enClase(f.c)) return; pool.push({
      tipo:'escribir', id:'f:'+i, tag:'Frase completa', clase:f.c, tag2:f.pat,
      promptEs:f.es, ok:f.ok, modelo:f.ok[0], libre:true
    }); });

  cola = pesado(pool).slice(0, sel.largo === 0 ? pool.length : sel.largo);
  cola = baraja(cola);
}
