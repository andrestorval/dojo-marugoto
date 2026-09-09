/* Escalera, transiciones, marcado manual, selección de la sesión y orden de
   entrada de ítems nuevos. Todo con día simulado: `transicion` y `seleccionar`
   reciben el día por parámetro, así que nada depende del reloj de la máquina. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { cargarMotor, almacenFalso, CON_PROGRESO } from './motor.mjs';

const plano = (x) => JSON.parse(JSON.stringify(x));
const cargar = (inicial) => {
  const almacen = almacenFalso(inicial || {});
  const m = cargarMotor({ archivos: CON_PROGRESO, almacen });
  m.iniciarProgreso();
  return { m, almacen };
};

const D = 20700;   /* día base de todas las pruebas */
const nuevo = (m) => m.registroNuevo(D);

/* ── escalera y transiciones (plano 2.2) ───────────────────────── */

test('la escalera es la del plano y llega al paso 7', () => {
  const { m } = cargar();
  assert.deepEqual([...m.ESCALERA], [0, 1, 3, 7, 14, 30, 60, 120]);
});

test('una racha de aciertos recorre la escalera entera', () => {
  const { m } = cargar();
  const r = nuevo(m);
  const vistos = [];
  for (let i = 0; i < 7; i++) {
    m.transicion(r, 'ok', D + i);
    vistos.push([r.b, r.int, r.due - (D + i)]);
  }
  assert.deepEqual(plano(vistos), [
    [1, 1, 1], [2, 3, 3], [3, 7, 7], [4, 14, 14], [5, 30, 30], [6, 60, 60], [7, 120, 120],
  ]);
  assert.equal(r.v, 7);
  assert.equal(r.f, 0);
});

test('desde el paso 7 el intervalo se duplica con tope de 365', () => {
  const { m } = cargar();
  const r = Object.assign(nuevo(m), { b: 7, int: 120 });
  m.transicion(r, 'ok', D);
  assert.deepEqual([r.b, r.int], [7, 240]);
  m.transicion(r, 'ok', D);
  assert.deepEqual([r.b, r.int], [7, 365]);
  m.transicion(r, 'ok', D);
  assert.equal(r.int, 365, 'no pasa del tope');
});

test('un `casi` no promueve, no castiga y reprograma', () => {
  const { m } = cargar();
  const r = Object.assign(nuevo(m), { b: 3, int: 7, v: 4, f: 1 });
  m.transicion(r, 'casi', D);
  assert.deepEqual([r.b, r.f, r.int, r.due], [3, 1, 7, D + 7]);
  assert.equal(r.v, 5, 'sí cuenta como vista');

  /* un item nunca visto que sale casi no queda vencido para siempre */
  const s = nuevo(m);
  m.transicion(s, 'casi', D);
  assert.equal(s.due, D + 1);
});

test('un `mal` cae a la caja 0, vuelve hoy y saca del estado jubilado', () => {
  const { m } = cargar();
  const r = Object.assign(nuevo(m), { b: 7, int: 120, man: D - 10, v: 30 });
  m.transicion(r, 'mal', D);
  assert.deepEqual([r.b, r.int, r.due, r.man, r.f], [0, 0, D, 0, 1]);
});

/* ── marcado manual (plano 2.3) ────────────────────────────────── */

test('marcar y desmarcar aprendido son inversos', () => {
  const { m } = cargar();
  const r = nuevo(m);
  m.transicionManual(r, D);
  assert.deepEqual([r.b, r.int, r.due, r.man], [7, 120, D + 120, D]);
  assert.equal(m.esJubilado(r), true);

  m.transicionDesmarcar(r, D);
  assert.deepEqual([r.b, r.int, r.due, r.man], [4, 14, D + 14, 0]);
  assert.equal(m.esJubilado(r), false);
});

test('lo jubilado sigue en el calendario y un fallo lo devuelve al repaso', () => {
  const { m } = cargar();
  m.marcarAprendido('c:のる:masu');
  assert.equal(m.jubilado('c:のる:masu'), true);
  assert.equal(m.estado().prog['c:のる:masu'].due, m.HOY + 120, 'no desaparece');
  m.marcar('c:のる:masu', 'mal');
  assert.equal(m.jubilado('c:のる:masu'), false);
  assert.equal(m.estado().prog['c:のる:masu'].due, m.HOY);
});

test('"La tenía bien" restaura el registro previo en vez de marcar sobre el fallo', () => {
  const { m } = cargar();
  const id = 'c:のる:masu';
  /* estado de partida: caja 3, un fallo antiguo */
  m.fijarProg({ [id]: { b: 3, v: 9, f: 1, int: 7, due: m.HOY, man: 0, last: m.HOY - 7 } });

  const previo = m.copiaDe(id);
  m.marcar(id, 'mal');
  assert.deepEqual([m.estado().prog[id].b, m.estado().prog[id].f], [0, 2]);

  /* el botón restaura y aplica ok sobre el registro de antes */
  m.restaurar(id, previo);
  m.marcar(id, 'ok');
  const r = m.estado().prog[id];
  assert.equal(r.b, 4, 'sube desde 3, no desde 0');
  assert.equal(r.f, 1, 'el fallo no queda contado');
  assert.equal(r.v, 10);
});

/* ── selección de la sesión (plano 2.4) ────────────────────────── */

/* Pool de mentira: ids sintéticos con el mínimo que la selección mira. */
function pool(n, modo = 'conj', unidad = 8, clase = 1) {
  return Array.from({ length: n }, (_, i) => ({
    id: modo + ':x' + i, modo, unidad, clase, orden: i, kana: 'k' + i, jp: 'j' + i,
  }));
}
const conDue = (m, ids, due, b = 1) => {
  const p = {};
  for (const id of ids) p[id] = { b, v: 1, f: 0, int: 1, due, man: 0, last: due - 1 };
  m.fijarProg(p);
};

test('sin nada vencido entran hasta cupoNuevos ítems nuevos', () => {
  const { m } = cargar();
  const p = pool(50);
  const r = m.seleccionar(p, 20, 6, 8, D);
  assert.equal(r.vencidas, 0);
  assert.equal(r.nuevas, 20, 'el hueco que deja el cupo se rellena con más nuevos');
  assert.equal(r.cola.length, 20);
  assert.equal(r.bloqueaNuevos, false);
});

test('el atraso mayor que el largo llena la sesión y bloquea lo nuevo', () => {
  const { m } = cargar();
  const p = pool(50);
  conDue(m, p.slice(0, 30).map((q) => q.id), D - 2);

  const r = m.seleccionar(p, 20, 6, 8, D);
  assert.equal(r.vencidas, 30);
  assert.equal(r.cola.length, 20);
  assert.equal(r.nuevas, 0, 'no entra material nuevo mientras haya atraso');
  assert.equal(r.bloqueaNuevos, true);
  assert.equal(r.atrasados, 10, 'lo que queda para los días siguientes');
  for (const q of r.cola) assert.ok(m.estado().prog[q.id], 'la cola es solo de vencidos');
});

test('con poco vencido entran los vencidos, el cupo de nuevos y luego adelantados', () => {
  const { m } = cargar();
  const p = pool(50);
  const prog = {};
  p.slice(0, 3).forEach((q) => { prog[q.id] = { b: 1, v: 1, f: 0, int: 1, due: D - 1, man: 0, last: D - 2 }; });
  p.slice(3, 40).forEach((q) => { prog[q.id] = { b: 2, v: 1, f: 0, int: 3, due: D + 2, man: 0, last: D - 1 }; });
  m.fijarProg(prog);

  const r = m.seleccionar(p, 20, 6, 8, D);
  assert.equal(r.vencidas, 3);
  assert.equal(r.nuevas, 6, 'el cupo de nuevos');
  assert.equal(r.cola.length, 20);
  /* 3 vencidos + 6 nuevos + 11 adelantados */
  const adelantados = r.cola.filter((q) => m.estado().prog[q.id] && m.estado().prog[q.id].due > D).length;
  assert.equal(adelantados, 11);
});

test('los vencidos entran por fecha y, a igual fecha, por caja más baja', () => {
  const { m } = cargar();
  const p = pool(6);
  m.fijarProg({
    'conj:x0': { b: 5, v: 1, f: 0, int: 1, due: D - 5, man: 0, last: 0 },
    'conj:x1': { b: 1, v: 1, f: 0, int: 1, due: D - 1, man: 0, last: 0 },
    'conj:x2': { b: 4, v: 1, f: 0, int: 1, due: D - 1, man: 0, last: 0 },
  });
  const r = m.seleccionar(p, 2, 0, 8, D);
  assert.equal(r.cola.length, 2);
  const ids = r.cola.map((q) => q.id).sort();
  assert.deepEqual(ids, ['conj:x0', 'conj:x1'], 'el más atrasado y, a igual día, la caja más baja');
});

test('largo 0 significa todo el pool', () => {
  const { m } = cargar();
  const p = pool(30);
  assert.equal(m.seleccionar(p, 0, 6, 8, D).cola.length, 30);
});

/* ── orden de entrada de ítems nuevos (plano 2.5) ──────────────── */

test('el cupo se reparte entre tipos y no se agota uno antes de pasar al siguiente', () => {
  const { m } = cargar();
  /* el pool real del Tema 8, que es donde importa que no haya inanición */
  const p = m.armarPool({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [] });
  const entran = m.ordenEntrada(p, 6, 8, new Set(p.map((q) => q.id)));

  assert.equal(entran.length, 6);
  const modos = entran.map((q) => q.modo);
  assert.ok(modos.filter((x) => x.startsWith('vocab')).length >= 1, 'algo de vocabulario');
  /* Desde M3, la conjugación entra por el ítem de grupo: conjugar sin saber el
     grupo es adivinar, así que `conj` espera a que `g:<kana>` se haya visto. */
  assert.ok(modos.includes('grupo') || modos.includes('conj'), 'y conjugación desde la primera sesión');
  assert.ok(new Set(modos).size >= 3, 'al menos tres tipos distintos: ' + modos.join(', '));
});

test('reconocer entra antes que escribir para la misma palabra', () => {
  const { m } = cargar();
  const p = m.armarPool({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [] });
  const ids = new Set(p.map((q) => q.id));

  /* con el almacén vacío, ninguna palabra puede entrar a escribir */
  const entran = m.ordenEntrada(p, 6, 8, ids);
  assert.equal(entran.filter((q) => q.modo === 'vocabES').length, 0);

  /* una vez vista en reconocer, esa palabra sí es candidata a escribir */
  const palabra = p.find((q) => q.modo === 'vocabJP');
  m.fijarProg({ [palabra.id]: { b: 1, v: 1, f: 0, int: 1, due: D + 1, man: 0, last: D } });
  const soloEscribir = p.filter((q) => q.modo === 'vocabES');
  const despues = m.ordenEntrada(soloEscribir, 6, 8, ids);
  assert.ok(despues.some((q) => q.jp === palabra.jp), 'ya puede entrar a escribir');
});

test('una frase espera a que un hueco de su patrón llegue a la caja 2', () => {
  const { m } = cargar();
  const u = m.UNIDADES.find((x) => x.n === 8);
  const pat = u.frases[0].pat;
  /* se simula lo que hará M3: los huecos del patrón, con `pat` puesto */
  const hueco = { id: 'h:8:hx', modo: 'hueco', unidad: 8, clase: 1, orden: 0, pat };
  const frase = { id: 'f:8:' + u.frases[0].k, modo: 'frase', unidad: 8, clase: 1, orden: 0, pat };
  u.huecos.push({ k: 'hx', pat, c: 1, pre: '', post: '', hint: '', ok: [''], es: '' });

  const ids = new Set([hueco.id, frase.id]);
  assert.equal(m.dependenciaCumplida(frase, ids), false, 'sin el hueco visto, la frase no entra');

  m.fijarProg({ [hueco.id]: { b: 2, v: 3, f: 0, int: 3, due: D + 3, man: 0, last: D } });
  assert.equal(m.dependenciaCumplida(frase, ids), true);

  /* y si el hueco no está en el pool, la regla no bloquea: un portón que no
     puede abrirse es un muro */
  m.fijarProg({});
  assert.equal(m.dependenciaCumplida(frase, new Set([frase.id])), true);
  u.huecos.pop();
});

test('una sola forma por verbo por sesión', () => {
  const { m } = cargar();
  const p = m.armarPool({ modos: ['conj'], clase: '0', unidades: [] });
  const entran = m.ordenEntrada(p, 10, 8, new Set(p.map((q) => q.id)));
  const kanas = entran.filter((q) => q.modo === 'conj' || q.modo === 'grupo').map((q) => q.kana);
  assert.equal(new Set(kanas).size, kanas.length, 'un verbo entró con dos formas: ' + kanas.join(', '));
});

test('el orden de unidades sale de la que se cursa hacia abajo y luego arriba', () => {
  const { m } = cargar();
  const original = m.UNIDADES.slice();
  /* se simulan nueve unidades sin tocar el contenido real */
  m.UNIDADES.length = 0;
  for (let n = 1; n <= 9; n++) m.UNIDADES.push({ n, estado: 'lista' });
  assert.deepEqual([...m.ordenUnidades(6)], [6, 5, 4, 3, 2, 1, 7, 8, 9]);
  assert.deepEqual([...m.ordenUnidades(1)], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual([...m.ordenUnidades(9)], [9, 8, 7, 6, 5, 4, 3, 2, 1]);
  m.UNIDADES.length = 0;
  original.forEach((u) => m.UNIDADES.push(u));
});

test('dentro de una unidad, la clase 1 entra antes que la 2', () => {
  const { m } = cargar();
  const p = m.armarPool({ modos: ['armar'], clase: '0', unidades: [] });
  const entran = m.ordenEntrada(p, 8, 8, new Set(p.map((q) => q.id)));
  const clases = entran.map((q) => q.clase);
  const primeraDos = clases.indexOf(2);
  const ultimaUno = clases.lastIndexOf(1);
  if (primeraDos >= 0 && ultimaUno >= 0) assert.ok(primeraDos > ultimaUno, 'clases mezcladas: ' + clases.join(','));
});

/* ── panorama e integración con la app ─────────────────────────── */

test('el panorama cuenta lo mismo que la selección arma', () => {
  const { m } = cargar();
  const p = pool(50);
  conDue(m, p.slice(0, 5).map((q) => q.id), D - 1);
  const pan = m.panorama(p, 20, 6, 8, D);
  const sel = m.seleccionar(p, 20, 6, 8, D);
  assert.equal(pan.vencidas, sel.vencidas);
  assert.equal(pan.nuevas, 6);
  assert.equal(pan.bloquea, false);

  conDue(m, p.map((q) => q.id), D - 1);
  assert.equal(m.panorama(p, 20, 6, 8, D).bloquea, true);
  assert.equal(m.panorama(p, 20, 6, 8, D).nuevas, 0);
});

test('"Practicar hoy" ignora la selección de unidades y el menú la respeta', () => {
  const { m } = cargar();
  m.fijarSel({ modos: ['armar'], clase: '2', unidades: [99], largo: 20, cupoNuevos: 6 });

  /* automática: todos los modos, todas las unidades listas */
  m.construir(false);
  const auto = m.cola();
  assert.ok(auto.length > 0);
  assert.ok(new Set(auto.map((q) => q.modo)).size > 1, 'la automática no se limita a un modo');

  /* manual: respeta el filtro, y con la unidad 99 no hay nada */
  m.construir(true);
  assert.equal(m.cola().length, 0);

  m.fijarSel({ unidades: [8] });
  m.construir(true);
  const manual = m.cola();
  assert.ok(manual.length > 0);
  for (const q of manual) {
    assert.equal(q.modo, 'armar');
    assert.equal(q.clase, 2);
  }
});

test('la sesión manual también registra progreso y respeta vencimientos', () => {
  const { m } = cargar();
  m.fijarSel({ modos: ['armar'], clase: '0', unidades: [8], largo: 5, cupoNuevos: 6 });
  m.construir(true);
  const q = m.cola()[0];
  m.marcar(q.id, 'ok');
  const r = m.estado().prog[q.id];
  assert.equal(r.b, 1);
  assert.equal(r.due, m.HOY + m.ESCALERA[1]);
});

test('el pool no repite un id aunque la palabra esté en dos unidades', () => {
  const { m } = cargar();
  const p = m.armarPool({ modos: m.TODOS_LOS_MODOS, clase: '0', unidades: [] });
  const ids = p.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('las formas que practica cada clase salen de la unidad, no de FORMAS', () => {
  const { m } = cargar();
  assert.equal(m.FORMAS.every((f) => f.c === undefined), true, 'FORMAS ya no lleva c');
  const u = m.UNIDADES.find((x) => x.n === 8);
  assert.equal(u.formas[1].length, 9);
  assert.equal(u.formas[2].length, 8);

  const p = m.armarPool({ modos: ['conj'], clase: '0', unidades: [8] });
  const conj = p.filter((q) => q.modo === 'conj');
  assert.equal(conj.length, 472, '56 verbos por las formas de su clase');
  for (const q of conj) assert.ok(u.formas[q.clase].includes(q.forma), q.id);
  /* y un ítem de grupo por verbo, que M3 antepone a sus formas */
  assert.equal(p.filter((q) => q.modo === 'grupo').length, u.verbos.length);
});

test('los distractores buscan en tres anillos y no se pisan en español', () => {
  const { m } = cargar();
  const u = m.UNIDADES.find((x) => x.n === 8);
  const agua = u.vocab.find((v) => v.es === 'agua');
  const d = m.distractores(agua, 8);
  assert.equal(d.length, 3);
  for (const x of d) {
    assert.equal(m.chocan(x, agua.es), false, x + ' se pisa con ' + agua.es);
  }
  assert.equal(new Set(d).size, 3);
});
