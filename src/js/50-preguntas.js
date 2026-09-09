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

  if(q.modo === 'frase')
    return { clase:'texto',
             texto:(q.pat ? q.pat + ' · ' : '') + esqueleto(q.ok[0], 2) +
                   ' · ' + q.ok[0].length + ' caracteres' };

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
  if((q.modo === 'hueco' || q.modo === 'frase') && q.pat && !yaVistoPatron(q.unidad, q.pat)){
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
