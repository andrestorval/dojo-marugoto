/* Pista progresiva, exigencia escalonada por caja, ítem de grupo, fichas y
   tarjetas de presentación. Todo sin DOM: las pistas se calculan al construir
   la pregunta justamente para poder verificarlas aquí (plano 3.2). */

import test from 'node:test';
import assert from 'node:assert/strict';
import { cargarMotor, almacenFalso, CON_PROGRESO } from './motor.mjs';

const cargar = (inicial) => {
  const almacen = almacenFalso(inicial || {});
  const m = cargarMotor({ archivos: CON_PROGRESO, almacen });
  m.iniciarProgreso();
  return { m, almacen };
};

/* Una pregunta del pool real, ya pasada por la etapa que le toca según su caja */
function preguntaDe(m, filtro, caja) {
  const p = m.armarPool({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [] });
  const base = p.find(filtro);
  assert.ok(base, 'no hay ninguna pregunta que cumpla el filtro');
  if (caja !== undefined) {
    m.fijarProg({ [base.id]: { b: caja, v: 3, f: 1, int: 1, due: m.HOY, man: 0, last: m.HOY - 1 } });
  }
  const q = Object.assign({}, base);
  m.aplicarEtapa(q);
  q.pista1 = m.pistaDe(q);
  q.ejemplo2 = m.segundoEjemplo(q);
  return q;
}

/* ── moras ─────────────────────────────────────────────────────── */

test('las moras cuentan el kana pequeño como parte de la anterior', () => {
  const { m } = cargar();
  assert.deepEqual([...m.moras('くうこう')], ['く', 'う', 'こ', 'う']);
  assert.deepEqual([...m.moras('きゃく')], ['きゃ', 'く']);
  assert.deepEqual([...m.moras('がんばって')], ['が', 'ん', 'ば', 'っ', 'て']);
  assert.equal(m.esqueleto('くうこう', 1), 'く＿＿＿');
  assert.equal(m.esqueleto('きゃく', 1), 'きゃ＿');
});

/* ── etapa según la caja (plano 3.6) ───────────────────────────── */

test('la conjugación es elección en caja 0 y escribir desde la caja 1', () => {
  const { m } = cargar();
  const filtro = (q) => q.modo === 'conj';

  const c0 = preguntaDe(m, filtro, 0);
  assert.equal(c0.tipo, 'opcion', 'caja 0 debería ser elección');
  assert.equal(c0.eleccion, 'forma');
  assert.equal(c0.opciones.length, 4);
  assert.ok(c0.opciones.includes(c0.correcta));

  const c1 = preguntaDe(m, filtro, 1);
  assert.equal(c1.tipo, 'escribir');
  assert.ok(c1.pista1, 'en caja 1 se escribe con pista');

  const c2 = preguntaDe(m, filtro, 3);
  assert.equal(c2.tipo, 'escribir');
});

test('el hueco elige patrón en caja 0, escribe con pista en la 1 y sin ella desde la 2', () => {
  const { m } = cargar();
  const filtro = (q) => q.modo === 'hueco' && q.pat;

  const h0 = preguntaDe(m, filtro, 0);
  assert.equal(h0.tipo, 'opcion');
  assert.equal(h0.eleccion, 'patron');
  assert.equal(h0.opciones.length, 4);
  assert.ok(h0.opciones.includes(h0.pat));
  assert.equal(h0.hintOculto, true, 'en la elección no se enseña la pista');

  const h1 = preguntaDe(m, filtro, 1);
  assert.ok(h1.tipo === 'hueco' || h1.tipo === 'hueco2');
  assert.ok(!h1.hintOculto, 'en caja 1 el hint va visible');

  const h2 = preguntaDe(m, filtro, 2);
  assert.equal(h2.hintOculto, true, 'desde la caja 2 el hint se esconde');
  assert.equal(h2.pista1.texto, h2.hint, 'y pasa a ser la pista del primer fallo');
});

test('el ítem de grupo existe, es de tres opciones y no cambia con la caja', () => {
  const { m } = cargar();
  const p = m.armarPool({ modos: ['conj'], clase: '0', unidades: [] });
  const grupos = p.filter((q) => q.modo === 'grupo');
  /* uno por verbo de todo el contenido compilado, no solo de la unidad 8 */
  const verbos = m.UNIDADES.reduce((n, x) => n + x.verbos.length, 0);
  assert.equal(grupos.length, verbos, 'uno por verbo');

  for (const caja of [0, 1, 4]) {
    const g = preguntaDe(m, (q) => q.modo === 'grupo', caja);
    assert.equal(g.tipo, 'opcion');
    assert.deepEqual([...g.opciones], ['Grupo 1', 'Grupo 2', 'Grupo 3']);
    assert.match(g.correcta, /^Grupo [123]$/);
  }
});

test('armar y vocabulario no cambian de etapa', () => {
  const { m } = cargar();
  for (const modo of ['armar', 'vocabES', 'vocabJP']) {
    const a = preguntaDe(m, (q) => q.modo === modo, 0);
    const b = preguntaDe(m, (q) => q.modo === modo, 4);
    assert.equal(a.tipo, b.tipo, modo + ' cambió de tipo con la caja');
  }
});

/* ── distractores de conjugación (plano 3.6) ───────────────────── */

test('cada conjugación del Tema 8 produce al menos dos distractores distintos de la correcta', () => {
  const { m } = cargar();
  const u = m.UNIDADES.find((x) => x.n === 8);
  const flojos = [];
  for (const v of u.verbos) {
    for (const fid of u.formas[v.c]) {
      const d = m.distractoresConjugacion(v, fid, u.verbos);
      const correcta = m.conjugar(v, fid);
      if (d.length < 2) flojos.push(v.kana + ' ' + fid + ': ' + d.length);
      if (d.includes(correcta)) flojos.push(v.kana + ' ' + fid + ': incluye la correcta');
      if (new Set(d).size !== d.length) flojos.push(v.kana + ' ' + fid + ': repetidos');
    }
  }
  assert.deepEqual(flojos, []);
});

test('los distractores de patrón salen del catálogo y no repiten el correcto', () => {
  const { m } = cargar();
  const u = m.UNIDADES.find((x) => x.n === 8);
  const cat = new Set(u.patrones.map((p) => p.pat));
  for (const p of u.patrones) {
    const d = m.distractoresPatron(8, p.pat);
    assert.equal(d.length, 3, p.pat);
    assert.ok(!d.includes(p.pat), p.pat + ' se propone a sí mismo');
    for (const x of d) assert.ok(cat.has(x), x + ' no está en el catálogo');
  }
});

/* ── la pista de cada tipo (plano 3.2) ─────────────────────────── */

test('los cinco tipos tienen pista y dice lo que el plano pide', () => {
  const { m } = cargar();

  /* conjugación escribir: la regla */
  const c = preguntaDe(m, (q) => q.modo === 'conj', 1);
  assert.equal(c.pista1.clase, 'regla');
  assert.equal(c.pista1.texto, c.regla);

  /* grupo del verbo: la terminación y la regla general, sin dar el grupo */
  const g = preguntaDe(m, (q) => q.modo === 'grupo', 0);
  assert.ok(g.pista1, 'el grupo necesita pista');
  const textoGrupo = g.pistaGrupo;
  assert.match(textoGrupo, /Termina en/);
  assert.ok(!textoGrupo.includes('Grupo ' + g.grupo), 'la pista no puede dar el grupo');

  /* conjugación en elección: se retira una opción incorrecta */
  const ce = preguntaDe(m, (q) => q.modo === 'conj', 0);
  assert.equal(ce.pista1.clase, 'quita');
  assert.ok(ce.opciones.includes(ce.pista1.quitar));
  assert.notEqual(ce.pista1.quitar, ce.correcta);

  /* hueco en elección de patrón: las líneas de uso de las cuatro */
  const he = preguntaDe(m, (q) => q.modo === 'hueco' && q.pat, 0);
  assert.equal(he.pista1.clase, 'usos');
  assert.equal(he.pista1.usos.length, 4);
  for (const x of he.pista1.usos) assert.ok(x.uso, x.pat + ' sin línea de uso');
  assert.ok(!he.pista1.usos.some((x) => x.esCorrecta), 'no debe señalar cuál es');

  /* vocabulario escribir: primera mora y guiones */
  const ve = preguntaDe(m, (q) => q.modo === 'vocabES', 0);
  assert.equal(ve.pista1.clase, 'esqueleto');
  assert.equal(ve.pista1.texto, m.esqueleto(ve.lectura, 1));
  assert.ok(ve.pista1.texto.includes('＿'));

  /* vocabulario reconocer: se retira una opción */
  const vr = preguntaDe(m, (q) => q.modo === 'vocabJP', 0);
  assert.equal(vr.pista1.clase, 'quita');
  assert.notEqual(vr.pista1.quitar, vr.correcta);

  /* hueco con pista visible: primera mora de la respuesta */
  const h1 = preguntaDe(m, (q) => q.modo === 'hueco' && !q.ok2, 1);
  assert.equal(h1.pista1.clase, 'esqueleto');
  assert.equal(h1.pista1.texto, m.esqueleto(h1.ok[0], 1));

  /* armar: la primera pieza */
  const a = preguntaDe(m, (q) => q.modo === 'armar', 0);
  assert.equal(a.pista1.clase, 'pieza');
  assert.equal(a.pista1.pieza, a.chips[0]);

});

/* El modo "frase completa desde español" se retiró: escribir la oración entera
   en el teclado del celular mide tecleo, no idioma, y lo que enseñaba lo
   enseña "armar la frase". Las frases siguen en el contenido como ejemplos de
   los patrones, y esta prueba vigila que no vuelvan como ejercicio por
   descuido. */
test('el modo de frase completa ya no existe', () => {
  const { m } = cargar();
  assert.equal(m.TODOS_LOS_MODOS.includes('frase'), false);
  const p = m.armarPool({ modos: m.TODOS_LOS_MODOS.concat('frase'), clase: '0', unidades: [] });
  assert.equal(p.filter((q) => q.modo === 'frase').length, 0,
    'pedirlo explícitamente tampoco debe producir preguntas de frase');

  /* pero las frases siguen alimentando las fichas y la materia */
  const u = m.UNIDADES.find((x) => x.n === 8);
  assert.ok(u.frases.length > 0);
  assert.ok(m.fichaPatron(8, u.frases[0].pat).frases.length > 0);
});

test('ninguna pista revela la respuesta entera', () => {
  const { m } = cargar();
  const p = m.armarPool({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [] });
  const fallos = [];
  for (const base of p.slice(0, 200)) {
    for (const caja of [0, 1, 2]) {
      m.fijarProg({ [base.id]: { b: caja, v: 1, f: 0, int: 1, due: m.HOY, man: 0, last: 0 } });
      const q = Object.assign({}, base);
      m.aplicarEtapa(q);
      q.pista1 = m.pistaDe(q);
      if (!q.pista1 || !q.pista1.texto) continue;
      const modelo = q.tipo === 'opcion' ? q.correcta : q.modelo;
      if (modelo && q.pista1.texto.includes(modelo) && modelo.length > 2) {
        fallos.push(q.id + ' caja ' + caja + ': ' + q.pista1.texto);
      }
    }
  }
  assert.deepEqual(fallos, []);
});

test('el segundo ejemplo es otro verbo del mismo grupo en la misma forma', () => {
  const { m } = cargar();
  const c = preguntaDe(m, (q) => q.modo === 'conj', 1);
  assert.ok(c.ejemplo2, 'la corrección debería enseñar la regla, no solo la respuesta');
  const u = m.UNIDADES.find((x) => x.n === 8);
  const otro = u.verbos.find((v) => (v.kanji || v.kana) === c.ejemplo2.verbo);
  assert.ok(otro, 'el ejemplo no está en la unidad');
  assert.equal(otro.g, c.grupo, 'tiene que ser del mismo grupo');
  assert.notEqual(otro.kana, c.kana, 'y otro verbo, no el mismo');
});

/* ── fichas y tarjetas (plano 3.5 y 3.6) ───────────────────────── */

test('toda palabra nueva tiene su tarjeta al menos tres posiciones antes', () => {
  const { m } = cargar();
  m.fijarSel({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [], largo: 20, cupoNuevos: 6, presentaciones: true });
  m.construir(false);
  const cola = [...m.cola()];

  const fallos = [];
  cola.forEach((c, i) => {
    if (c.tipo !== 'nuevo') return;
    const j = cola.findIndex((q, k) => k > i && m.esPregunta(q) && q.jp === c.jp);
    if (j < 0) return fallos.push(c.jp + ': la tarjeta no tiene su pregunta después');
    if (j - i < 3) fallos.push(c.jp + ': solo ' + (j - i) + ' posiciones de separación');
  });
  assert.deepEqual(fallos, []);

  /* y ninguna palabra nueva se pregunta sin tarjeta previa */
  const sinTarjeta = [];
  cola.forEach((q, i) => {
    if (!m.esPregunta(q) || (q.modo !== 'vocabES' && q.modo !== 'vocabJP')) return;
    if (m.estado().prog[q.id]) return;
    const antes = cola.slice(0, i).some((c) => c.tipo === 'nuevo' && c.jp === q.jp);
    if (!antes) sinTarjeta.push(q.id);
  });
  assert.deepEqual(sinTarjeta, []);
});

test('la ficha de una forma nunca vista se inserta antes de su pregunta', () => {
  const { m } = cargar();
  m.fijarSel({ modos: ['conj'], clase: '0', unidades: [8], largo: 20, cupoNuevos: 10, presentaciones: true });
  m.construir(true);
  const cola = [...m.cola()];
  const fichas = cola.filter((c) => c.tipo === 'ficha');
  /* con el almacén vacío entran ítems de grupo, no formas; se fuerza una forma
     ya desbloqueada marcando su ítem de grupo como visto */
  assert.ok(Array.isArray(fichas));

  const u = m.UNIDADES.find((x) => x.n === 8);
  const v = u.verbos[0];
  m.fijarProg({ ['g:' + v.kana]: { b: 2, v: 2, f: 0, int: 3, due: m.HOY + 3, man: 0, last: m.HOY } });
  m.construir(true);
  const cola2 = [...m.cola()];
  const conj = cola2.find((q) => q.modo === 'conj');
  if (conj) {
    const i = cola2.indexOf(conj);
    const ficha = cola2.slice(0, i).find((c) => c.tipo === 'ficha' && c.clave === 'forma:' + conj.forma);
    assert.ok(ficha, 'la forma ' + conj.forma + ' entra sin ficha');
  }
});

test('cada forma y cada patrón del Tema 8 tienen ficha', () => {
  const { m } = cargar();
  const u = m.UNIDADES.find((x) => x.n === 8);
  const ids = [...new Set([].concat(u.formas[1], u.formas[2]))];
  for (const id of ids) {
    const f = m.fichaForma(id);
    assert.ok(f, 'sin ficha: ' + id);
    assert.ok(f.uso, id + ' sin línea de uso');
    assert.equal(f.grupos.length, 3, id + ' no tiene ejemplo de los tres grupos');
    for (const g of f.grupos) assert.ok(g.salida && g.salida !== g.verbo, id + ' grupo ' + g.g);
  }
  for (const p of u.patrones) {
    const f = m.fichaPatron(8, p.pat);
    assert.ok(f, 'sin ficha: ' + p.pat);
    assert.ok(f.uso, p.pat + ' sin línea de uso');
    assert.ok(f.formula, p.pat + ' sin fórmula de construcción');
    assert.ok(f.frases.length, p.pat + ' sin ejemplo');
  }
});

test('la ficha se muestra una sola vez por forma y por patrón en la misma cola', () => {
  const { m } = cargar();
  m.fijarSel({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [], largo: 0, cupoNuevos: 40, presentaciones: true });
  m.construir(false);
  const claves = m.cola().filter((c) => c.tipo === 'ficha' || c.tipo === 'nuevo').map((c) => c.clave);
  assert.equal(new Set(claves).size, claves.length, 'hay tarjetas repetidas');
});

test('las tarjetas y las fichas no son preguntas', () => {
  const { m } = cargar();
  assert.equal(m.esPregunta({ tipo: 'nuevo' }), false);
  assert.equal(m.esPregunta({ tipo: 'ficha' }), false);
  assert.equal(m.esPregunta({ tipo: 'escribir' }), true);
  assert.equal(m.esPregunta(null), false);
});

test('una forma ya vista no vuelve a traer ficha', () => {
  const { m } = cargar();
  assert.equal(m.yaVistaForma('masu'), false);
  m.fijarProg({ 'c:のる:masu': { b: 1, v: 1, f: 0, int: 1, due: m.HOY, man: 0, last: m.HOY } });
  assert.equal(m.yaVistaForma('masu'), true);
  assert.equal(m.yaVistaForma('te'), false);
});

/* ── lectura y significado de los términos (pedido de Patricio) ── */

test('todo patrón o forma con kanji dice cómo se lee y qué significa', () => {
  const { m } = cargar();
  const KANJI = /[一-龯]/;
  const fallos = [];

  for (const u of m.UNIDADES) {
    for (const p of u.patrones || []) {
      if (!p.es) fallos.push('patrón ' + p.pat + ': sin significado');
      if (KANJI.test(p.pat) && !p.lectura) fallos.push('patrón ' + p.pat + ': lleva kanji y no dice cómo se lee');
    }
  }
  for (const f of m.FORMAS) {
    const conKanji = KANJI.test(f.label) || KANJI.test(f.desc);
    if (conKanji && !f.lectura) fallos.push('forma ' + f.id + ': lleva kanji y no dice cómo se lee');
  }
  assert.deepEqual(fallos, []);
});

test('la ficha lleva la lectura y el significado hasta el render', () => {
  const { m } = cargar();
  const t = m.fichaPatron(8, '他動詞');
  assert.equal(t.lectura, 'たどうし · tadōshi');
  assert.equal(t.significado, 'verbo transitivo');

  const f = m.fichaForma('imp');
  assert.ok(f.lectura.includes('meireikei'), 'la forma imperativa se lee めいれいけい');
});

/* ── el material nuevo solo se muestra si se pide (corrección de Patricio) ── */

test('por defecto la sesión no muestra nada antes de preguntarlo', () => {
  const { m } = cargar();
  assert.equal(m.estado().sel.presentaciones, false, 'tiene que venir apagado');

  m.fijarSel({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [], largo: 20, cupoNuevos: 6 });
  m.construir(false);
  const cola = m.cola();
  assert.ok(cola.length > 0);
  assert.equal(cola.filter((q) => !m.esPregunta(q)).length, 0,
    'con el ajuste apagado no debe entrar ninguna tarjeta ni ficha');
  assert.equal(cola.length, cola.filter(m.esPregunta).length);
});

test('encendido sí las muestra, y el material sigue disponible en la materia', () => {
  const { m } = cargar();
  m.fijarSel({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [], largo: 20, cupoNuevos: 6, presentaciones: true });
  m.construir(false);
  assert.ok(m.cola().filter((q) => !m.esPregunta(q)).length > 0, 'encendido debería traer tarjetas');

  /* apagado o encendido, la materia no cambia: es lo que se consulta a propósito */
  assert.ok(m.materiaDe(8).gramatica.length > 0);
  assert.ok(m.fichaForma('masu'));
});
