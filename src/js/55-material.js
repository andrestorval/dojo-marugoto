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
           uso:f.uso || '', grupos, exc };
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
      id, label:f.label, desc:f.desc, uso:f.uso || '',
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
