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
