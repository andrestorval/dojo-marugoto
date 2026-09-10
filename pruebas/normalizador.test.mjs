/* Pares ok / casi / mal. `casi` es el caso en que la respuesta solo falla en
   vocales largas o kana pequeño; `mal` es todo lo demás. La lista cubre las
   trampas reales del uso en celular: rōmaji con y sin macrones, katakana,
   chōon, consonante doble, y puntuación pegada. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { cargarMotor } from './motor.mjs';

const m = cargarMotor();

const PARES = [
  /* ── ok ── */
  ['とばない', ['とばない'], 'ok', 'kana exacto'],
  ['tobanai', ['とばない'], 'ok', 'rōmaji'],
  ['トバナイ', ['とばない'], 'ok', 'katakana por hiragana'],
  ['乗ります', ['乗ります', 'のります'], 'ok', 'kanji'],
  ['のります', ['乗ります', 'のります'], 'ok', 'kana de una aceptada con kanji'],
  ['norimasu', ['乗ります', 'のります'], 'ok', 'rōmaji contra kanji'],
  ['のります。', ['のります'], 'ok', 'punto japonés'],
  ['  のります  ', ['のります'], 'ok', 'espacios alrededor'],
  ['kōkū', ['こうくう'], 'ok', 'macrones'],
  ['koukuu', ['こうくう'], 'ok', 'vocal doble'],
  ['スーツケース', ['スーツケース'], 'ok', 'chōon en katakana'],
  ['suutsukeesu', ['スーツケース'], 'ok', 'rōmaji contra chōon'],
  ['shita ato de', ['した後で', 'したあとで'], 'ok', 'rōmaji con espacios'],
  ['行って', ['行って', 'いって'], 'ok', 'excepción いく'],
  ['itte', ['行って', 'いって'], 'ok', 'consonante doble en rōmaji'],
  ['きゃく', ['きゃく'], 'ok', 'kana pequeño'],
  ['kyaku', ['きゃく'], 'ok', 'kana pequeño en rōmaji'],
  ['konnichiha', ['こんにちは'], 'ok', 'ん antes de vocal'],
  ['zasshi', ['ざっし'], 'ok', 'っ de doble consonante'],
  ['ganbatte', ['がんばって'], 'ok', 'ん y っ juntos'],
  ['hidoi me ni aimashita', ['ひどい目にあいました。', 'ひどいめにあいました。'], 'ok', 'frase en rōmaji'],
  ['ひどい目にあいました', ['ひどい目にあいました。', 'ひどいめにあいました。'], 'ok', 'frase con kanji sin punto'],
  ['たべた', ['食べた', 'たべた'], 'ok', 'kana contra kanji'],

  /* ── casi: solo falla la vocal larga ── */
  ['そですね', ['そうですね'], 'casi', 'そう escrito そ'],
  ['こくう', ['こうくう'], 'casi', 'くうこう sin alargamientos'],
  ['すつけす', ['スーツケース'], 'casi', 'chōon comidos'],
  ['べんきょ', ['べんきょう'], 'casi', 'きょう escrito きょ'],
  ['ときょ', ['とうきょう'], 'casi', 'dos alargamientos comidos'],
  ['おくれるそです', ['おくれるそうです'], 'casi', 'そうです en frase'],
  ['gakko', ['がっこう'], 'casi', 'rōmaji sin la vocal larga'],
  ['はじまるそです', ['始まるそうです', 'はじまるそうです'], 'casi', 'contra la aceptada en kana'],

  /* ── mal ── */
  ['', ['のります'], 'mal', 'vacío'],
  ['   ', ['のります'], 'mal', 'solo espacios'],
  ['のった', ['のります'], 'mal', 'otra forma del mismo verbo'],
  ['norimasen', ['のります'], 'mal', 'negativo por afirmativo'],
  ['たべる', ['食べた', 'たべた'], 'mal', 'diccionario por forma た'],
  ['わからない', ['とばない'], 'mal', 'otro verbo'],
  ['行きます', ['行って', 'いって'], 'mal', 'forma ます por forma て'],
  ['したり', ['寝たり', 'ねたり'], 'mal', 'el たり del otro verbo'],
  ['あ', ['あい'], 'mal', 'una mora de menos que no es alargamiento'],
  ['しました', ['します'], 'mal', 'pasado por presente'],
];

test('la lista cubre los tres estados con al menos 40 pares', () => {
  assert.ok(PARES.length >= 40, 'hay ' + PARES.length + ' pares');
  for (const e of ['ok', 'casi', 'mal']) {
    assert.ok(PARES.some((p) => p[2] === e), 'falta algún par ' + e);
  }
});

test('revisar clasifica cada par en el estado esperado', () => {
  const fallos = [];
  for (const [usuario, aceptadas, esperado, por] of PARES) {
    const r = m.revisar(usuario, aceptadas);
    if (r.estado !== esperado) {
      fallos.push(
        JSON.stringify(usuario) + ' vs ' + JSON.stringify(aceptadas) +
        ' → ' + r.estado + ', se esperaba ' + esperado + ' (' + por + ')'
      );
    }
  }
  assert.deepEqual(fallos, []);
});

test('un ok siempre devuelve la aceptada que coincidió como modelo', () => {
  const r = m.revisar('のります', ['乗ります', 'のります']);
  assert.equal(r.estado, 'ok');
  assert.equal(r.modelo, 'のります');
});

test('un mal devuelve la primera aceptada como modelo', () => {
  const r = m.revisar('xxx', ['乗ります', 'のります']);
  assert.equal(r.estado, 'mal');
  assert.equal(r.modelo, '乗ります');
});

test('normEstricta y normSuelta son idempotentes', () => {
  for (const s of ['スーツケース', 'こうくう', 'した後で', 'ganbatte']) {
    assert.equal(m.normEstricta(m.normEstricta(s)), m.normEstricta(s));
    assert.equal(m.normSuelta(m.normSuelta(s)), m.normSuelta(s));
  }
});

/* Regla del plano 7.2: quien escribe en rōmaji produce kana, y una lista solo
   en kanji le da "mal" a una respuesta correcta. El Tema 8 congelado incumplia
   la regla en FRASES[0]; M0 copio el contenido sin tocarlo, la prueba quedo
   escrita y marcada `todo`, y M5 la corrigio agregando las variantes en kana.
   Desde entonces exige. */
test('toda lista ok de frases y huecos trae una variante sin kanji', () => {
  const KANJI = /[一-龯]/;
  const sinKanji = (lista) => lista.some((x) => !KANJI.test(x));
  const fallos = [];
  m.FRASES.forEach((f, i) => {
    if (!sinKanji(f.ok)) fallos.push('frase ' + i + ': ' + f.ok[0]);
  });
  m.HUECOS.forEach((h, i) => {
    if (!sinKanji(h.ok)) fallos.push('hueco ' + i + ': ' + h.ok[0]);
    if (h.ok2 && !sinKanji(h.ok2)) fallos.push('hueco ' + i + ' (segundo): ' + h.ok2[0]);
  });
  assert.deepEqual(fallos, []);
});
