/* El motor de src/ tiene que reproducir, caso por caso, lo que producía el
   archivo congelado. Si una forma nueva de una unidad futura altera una de
   estas salidas, la prueba lo dice antes de que llegue al celular. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { cargarMotor, vector } from './motor.mjs';

const m = cargarMotor();
const v = vector();

test('el vector viene del archivo congelado y no está vacío', () => {
  assert.equal(v.origen, 'fuentes-oficiales/congelado-t8.html');
  assert.ok(v.casos.length > 400, 'el vector trae ' + v.casos.length + ' casos');
});

test('conjugar reproduce el vector congelado', () => {
  const verbo = (kana) => m.VERBOS.find((x) => x.kana === kana);
  const fallos = [];
  for (const c of v.casos) {
    const vb = verbo(c.kana);
    if (!vb) {
      fallos.push(c.kana + ': el verbo ya no está en el contenido');
      continue;
    }
    const salida = m.conjugar(vb, c.forma);
    if (salida !== c.salida) {
      fallos.push(c.kana + ' ' + c.forma + ': ' + salida + ' ≠ ' + c.salida);
    }
  }
  assert.deepEqual(fallos, []);
});

test('conKanji y aceptadasDeConjugacion reproducen el vector', () => {
  const verbo = (kana) => m.VERBOS.find((x) => x.kana === kana);
  const fallos = [];
  for (const c of v.casos) {
    const vb = verbo(c.kana);
    if (!vb) continue;
    const k = m.conKanji(vb, m.conjugar(vb, c.forma));
    if (k !== c.kanji) fallos.push(c.kana + ' ' + c.forma + ' kanji: ' + k + ' ≠ ' + c.kanji);
    const a = m.aceptadasDeConjugacion(vb, c.forma);
    if (a.join('|') !== c.aceptadas.join('|')) {
      fallos.push(c.kana + ' ' + c.forma + ' aceptadas: ' + a.join('|') + ' ≠ ' + c.aceptadas.join('|'));
    }
  }
  assert.deepEqual(fallos, []);
});

test('reglaDe reproduce el vector', () => {
  const verbo = (kana) => m.VERBOS.find((x) => x.kana === kana);
  const fallos = [];
  for (const c of v.casos) {
    const vb = verbo(c.kana);
    if (!vb) continue;
    const r = m.reglaDe(vb, c.forma);
    if (r !== c.regla) fallos.push(c.kana + ' ' + c.forma + ': ' + r + ' ≠ ' + c.regla);
  }
  assert.deepEqual(fallos, []);
});

/* Invariantes que el vector no cubre porque valen para cualquier unidad. */

test('ninguna conjugación devuelve undefined ni deja el verbo sin tocar', () => {
  const fallos = [];
  /* las formas ya no llevan el campo c: cuáles practica cada clase lo dice
     la unidad (Anexo A del plano) */
  for (const vb of m.VERBOS) {
    for (const fid of m.TEMA.formas[vb.c]) {
      const f = m.FORMAS.find((x) => x.id === fid);
      const s = m.conjugar(vb, f.id);
      if (typeof s !== 'string' || !s || s.includes('undefined')) {
        fallos.push(vb.kana + ' ' + f.id + ': ' + s);
      } else if (s === vb.kana) {
        fallos.push(vb.kana + ' ' + f.id + ': la forma no cambió');
      }
    }
  }
  assert.deepEqual(fallos, []);
});

test('todo verbo del grupo 3 termina en する o くる', () => {
  /* Array.from saca el arreglo del realm del vm: deepEqual compara prototipos */
  const malos = Array.from(
    m.VERBOS.filter((vb) => vb.g === 3 && !vb.kana.endsWith('する') && !vb.kana.endsWith('くる')),
    (x) => x.kana
  );
  assert.deepEqual(malos, []);
});

test('las excepciones de EXC se aplican', () => {
  const iku = m.VERBOS.find((x) => x.kana === 'いく');
  assert.equal(m.conjugar(iku, 'te'), 'いって');
  assert.equal(m.conjugar(iku, 'ta'), 'いった');
  const aru = m.VERBOS.find((x) => x.kana === 'ある');
  assert.equal(m.conjugar(aru, 'nai'), 'ない');
  assert.equal(m.conjugar(aru, 'nakatta'), 'なかった');
});

test('los irregulares する y くる salen de sus tablas', () => {
  const suru = m.VERBOS.find((x) => x.g === 3 && x.kana.endsWith('する'));
  assert.ok(m.conjugar(suru, 'masu').endsWith('します'));
  assert.ok(m.conjugar(suru, 'te').endsWith('して'));
});

/* ── las formas que estrena la unidad 9 ─────────────────────────
   El vector congelado no puede cubrirlas: no existen en el archivo del que
   sale. Van fijadas a mano, con un verbo regular por grupo y los dos
   irregulares, que es lo que el plano exige de cada forma nueva (9.2). */
test('たら, たい, やすい y ことができます, un verbo por grupo', () => {
  const casos = [
    /* grupo 1 */
    ['はたらく', 'tara',  'はたらいたら'],
    ['はたらく', 'tai',   'はたらきたいです'],
    ['はたらく', 'yasui', 'はたらきやすいです'],
    ['はたらく', 'koto',  'はたらくことができます'],
    /* grupo 1 con て sonora: ぶ → んだ */
    ['えらぶ',   'tara',  'えらんだら'],
    /* grupo 2 */
    ['つとめる', 'tara',  'つとめたら'],
    ['つとめる', 'tai',   'つとめたいです'],
    ['つとめる', 'yasui', 'つとめやすいです'],
    ['つとめる', 'koto',  'つとめることができます'],
    /* grupo 3 */
    ['そつぎょうする', 'tara',  'そつぎょうしたら'],
    ['そつぎょうする', 'tai',   'そつぎょうしたいです'],
    ['そつぎょうする', 'yasui', 'そつぎょうしやすいです'],
    ['そつぎょうする', 'koto',  'そつぎょうすることができます'],
  ];
  /* VERBOS es solo el de la primera unidad, un alias que viene del archivo
     congelado de una sola unidad; estos verbos son de la 9. */
  const todos = m.UNIDADES.flatMap((u) => u.verbos);
  const fallos = [];
  for (const [kana, forma, esperado] of casos) {
    const vb = todos.find((x) => x.kana === kana);
    assert.ok(vb, 'falta el verbo ' + kana + ' en el contenido');
    const sale = m.conjugar(vb, forma);
    if (sale !== esperado) fallos.push(kana + ' ' + forma + ': ' + sale + ' ≠ ' + esperado);
  }
  assert.deepEqual(fallos, []);
});

test('いく mantiene su excepción también en たら', () => {
  const iku = m.VERBOS.find((x) => x.kana === 'いく');
  /* la regla daría いきたら; la forma て de いく es irregular y たら sale de ella */
  assert.equal(m.conjugar(iku, 'tara'), 'いったら');
});

/* ── las formas que estrena la unidad 1 ─────────────────────────
   Mismo motivo que las de la unidad 9: el vector congelado no las conoce.
   Un verbo regular por grupo, más los dos irregulares y un grupo 1 acabado
   en 〜う, que es donde la forma ない tiene su trampa (う → わ, nunca あ). */
test('なら, って, な, la raíz sustantivada, なければ y なきゃ', () => {
  const casos = [
    /* grupo 1 */
    ['かつ',   'nara',     'かつなら'],
    ['かつ',   'na',       'かつな'],
    ['かつ',   'meishi',   'かち'],
    ['かつ',   'nakereba', 'かたなければなりません'],
    ['かつ',   'nakya',    'かたなきゃいけません'],
    ['かつ',   'imp',      'かて'],
    /* grupo 1 en 〜う: la forma ない va a わ, no a あ */
    ['さそう', 'nakereba', 'さそわなければなりません'],
    ['さそう', 'meishi',   'さそい'],
    ['さそう', 'tte',      'さそうって言ってました'],
    /* grupo 2 */
    ['まける', 'nara',     'まけるなら'],
    ['まける', 'na',       'まけるな'],
    ['まける', 'meishi',   'まけ'],
    ['まける', 'nakereba', 'まけなければなりません'],
    ['まける', 'nakya',    'まけなきゃいけません'],
    /* grupo 3 */
    ['キャンセルする', 'nara',     'キャンセルするなら'],
    ['キャンセルする', 'na',       'キャンセルするな'],
    ['キャンセルする', 'meishi',   'キャンセルし'],
    ['キャンセルする', 'nakereba', 'キャンセルしなければなりません'],
  ];
  const todos = m.UNIDADES.flatMap((u) => u.verbos);
  const fallos = [];
  for (const [kana, forma, esperado] of casos) {
    const vb = todos.find((x) => x.kana === kana);
    assert.ok(vb, 'falta el verbo ' + kana + ' en el contenido');
    const sale = m.conjugar(vb, forma);
    if (sale !== esperado) fallos.push(kana + ' ' + forma + ': ' + sale + ' ≠ ' + esperado);
  }
  assert.deepEqual(fallos, []);
});

test('くる es irregular también en las formas nuevas', () => {
  const kuru = m.UNIDADES.flatMap((u) => u.verbos).find((x) => x.kana === 'くる');
  assert.ok(kuru, 'falta くる');
  /* la regla daría くなければ; くる va de memoria y su ない es こない */
  assert.equal(m.conjugar(kuru, 'nakereba'), 'こなければなりません');
  assert.equal(m.conjugar(kuru, 'nakya'), 'こなきゃいけません');
  assert.equal(m.conjugar(kuru, 'meishi'), 'き');
});
