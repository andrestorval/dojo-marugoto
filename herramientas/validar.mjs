/* validar.mjs — comprueba el contenido de una unidad contra los índices
 * oficiales, el motor y el corpus del libro.
 *
 * Uso:  node herramientas/validar.mjs [--unidad=8]
 *
 * Tres niveles de severidad, y la diferencia importa:
 *   error       bloquea la integración. Es algo que la máquina sabe con
 *               certeza que está mal.
 *   advertencia lista de revisión humana. La máquina sospecha; decide Patricio.
 *   informe     números, sin juicio.
 *
 * Lo que NO puede comprobar, y por eso queda en manos de Patricio: si la frase
 * en español dice lo que dice la japonesa, si la lista `ok` incluye todas las
 * variantes razonables, si el `hint` es el correcto, si el corte de clases
 * respeta el del curso, y si una oración que no está en el corpus es japonés
 * natural (plano 7.3).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith('--' + n + '='))?.split('=')[1] ?? d;
const leer = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

const UNIDAD = Number(flag('unidad', '8'));

/* ── carga: contenido, motor e índices ─────────────────────────── */

const cont = join(RAIZ, 'contenido');
const archivosCont = ['catalogo.js'].concat(
  readdirSync(cont).filter((f) => /^u\d+\.js$/.test(f)).sort()
);
const tabla = join(cont, 'migracion-t8.json');

const M = vm.runInContext(
  archivosCont.map((f) => leer(join(cont, f))).join('\n') +
  (existsSync(tabla) ? '\nCONTENIDO.migracion = ' + leer(tabla) + ';' : '') + '\n' +
  ['00-tablas.js', '05-contenido.js', '10-conjugador.js', '20-normalizador.js']
    .map((f) => leer(join(RAIZ, 'src', 'js', f))).join('\n') +
  '\n;({ CONTENIDO, UNIDADES, FORMAS, CATEGORIAS, EXC, conjugar, conKanji, aceptadasDeConjugacion, normEstricta });',
  vm.createContext(Object.create(null)), { filename: 'contenido+motor' }
);

const rutaIdx = join(RAIZ, 'fuentes-oficiales', 'indices.json');
const rutaLibro = join(RAIZ, 'fuentes-oficiales', 'libro.txt');
if (!existsSync(rutaIdx)) {
  console.error('falta indices.json. Corre: node herramientas/indices.mjs');
  process.exit(1);
}
const IDX = JSON.parse(leer(rutaIdx));
const LIBRO = existsSync(rutaLibro) ? JSON.parse(leer(rutaLibro)) : { todo: '', porTema: {} };

const u = M.UNIDADES.find((x) => x.n === UNIDAD);
if (!u) { console.error('no hay unidad ' + UNIDAD + ' en contenido/'); process.exit(1); }

/* ── acumuladores ──────────────────────────────────────────────── */

const errores = [], avisos = [], informe = [];
const err = (s) => errores.push(s);
const avi = (s) => avisos.push(s);
const inf = (s) => informe.push(s);

const KANJI = /[一-龯]/;
const sinTildes = (t) => String(t).toLowerCase().normalize('NFD')
  .replace(new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36F) + ']', 'g'), '');
const palabras = (t) => sinTildes(t).split(/[^a-z0-9]+/).filter((w) => w.length >= 4);

/* El índice usa los paréntesis para dos cosas distintas, y hay que tratarlas
   distinto o las búsquedas fallan:
     （飛びます）      la palabra entera: en el libro se escribe en kana
     こしょう（します） un sufijo opcional: vale con する y sin él
   Por eso cada entrada genera varias formas y basta con que una coincida. */
function variantes(x) {
  /* El índice escribe la tilde de onda como ～ (U+FF5E) y el contenido como 〜
     (U+301C). Son dos caracteres distintos, así que sin igualarlos ni 〜便 ni
     〜部 se encontraban a sí mismos en el índice. */
  const s = String(x || '').trim().replace(/[～〜]/g, '〜');
  if (!s) return [];

  const out = new Set();

  /* El índice separa las formas alternativas con ／ dentro de la misma celda:
     あの／あのう, ごめんなさい／ごめん, にちようび／にち. Cada lado es una
     palabra por derecho propio. */
  for (const rama of s.split('／')) {
    const t = rama.trim();
    if (!t) continue;
    out.add(t);

    /* Los paréntesis marcan lo opcional, y puede haber más de uno en la misma
       entrada: だいじょ（う）ぶ（な） son cuatro escrituras válidas, no dos. Se
       generan todas las combinaciones de conservar o quitar cada grupo. */
    const grupos = [...t.matchAll(/[（(][^）)]*[）)]/g)];
    for (let m = 0; m < (1 << grupos.length); m++) {
      let v = '', i = 0;
      for (let g = 0; g < grupos.length; g++) {
        v += t.slice(i, grupos[g].index);
        if (m & (1 << g)) v += grupos[g][0].slice(1, -1);  // conservar el contenido
        i = grupos[g].index + grupos[g][0].length;
      }
      out.add((v + t.slice(i)).trim());
    }

    /* Los sustantivos verbales vienen como ほうこく（します）, y su columna de
       forma de diccionario dice （～する）, que no nombra ninguna palabra. La
       forma que la app usa es ほうこくする, y se genera aquí. */
    if (/[（(]します[）)]$/.test(t)) out.add(t.replace(/[（(]します[）)]$/, 'する'));
  }

  out.delete('');
  return [...out];
}
const coincide = (a, b) => variantes(a).some((x) => variantes(b).includes(x));
const limpiar = (s) => String(s || '').replace(/[（）()]/g, '').trim();

/* ── 1. estructura (contrato) ──────────────────────────────────── */

const claves = new Set();
const revisarClave = (arr, letra) => {
  for (const it of arr) {
    if (!it.k) { err('estructura: falta la clave `k` en un ' + letra); continue; }
    if (!new RegExp('^' + letra + UNIDAD + '-\\d{2,}$').test(it.k))
      err('estructura: clave con formato inválido: ' + it.k);
    if (claves.has(it.k)) err('estructura: clave repetida: ' + it.k);
    claves.add(it.k);
  }
};
revisarClave(u.frases, 'f');
revisarClave(u.huecos, 'h');
revisarClave(u.armar, 'a');

for (const v of u.vocab) {
  if (!v.jp || !v.kana || !v.es) err('estructura: vocabulario incompleto: ' + JSON.stringify(v));
  if (!M.CATEGORIAS.includes(v.cat)) err('estructura: categoría desconocida en ' + v.jp + ': ' + v.cat);
  if (v.c !== 1 && v.c !== 2) err('estructura: clase inválida en ' + v.jp + ': ' + v.c);
}
for (const h of u.huecos) {
  if (!h.ok || !h.ok.length) err('estructura: hueco ' + h.k + ' sin respuestas aceptadas');
  if (!/（\s*$/.test(h.pre)) avi('estructura: el `pre` de ' + h.k + ' no termina en （');
  if (!/^\s*）/.test(h.post)) avi('estructura: el `post` de ' + h.k + ' no empieza por ）');
}
for (const a of u.armar) {
  if (!a.chips || a.chips.length < 2) err('estructura: ' + a.k + ' tiene menos de dos piezas');
}
for (const f of u.frases) {
  if (!f.ok || !f.ok.length) err('estructura: frase ' + f.k + ' sin respuestas aceptadas');
}

/* UTF-8 sano: U+FFFD delata una secuencia multibyte cortada */
const crudoUnidad = leer(join(cont, 'u' + UNIDAD + '.js'));
if (crudoUnidad.includes('�')) err('estructura: el archivo contiene U+FFFD');
if (/<\/script/i.test(crudoUnidad)) err('estructura: el archivo contiene </script');

/* ── 2. verbos contra el índice de vocabulario ─────────────────── */

const vocIdx = IDX.vocabulario;
const buscarVerbo = (kana) => vocIdx.find((v) => coincide(v.dicc, kana))
  || vocIdx.find((v) => coincide(v.kana, kana));

/* Que un verbo venga de un tema anterior es lo normal y no es un problema: la
   gramática de una unidad se practica sobre verbos que ya se conocen. Se
   cuenta en el informe en vez de llenar la lista de revisión. */
const verbosDeOtroTema = [];
for (const v of u.verbos) {
  const o = buscarVerbo(v.kana);
  if (!o) { avi('verbo: ' + v.kana + ' no aparece como forma de diccionario en el índice'); continue; }
  if (o.grupo && o.grupo !== v.g)
    err('verbo: ' + v.kana + ' está como grupo ' + o.grupo + ' en el índice y aquí es ' + v.g);
  if (o.tema && o.tema !== UNIDAD) verbosDeOtroTema.push(v.kana + ' (tema ' + o.tema + ')');
  if (v.g === 3 && !v.kana.endsWith('する') && !v.kana.endsWith('くる'))
    err('verbo: ' + v.kana + ' es grupo 3 y no termina en する ni くる');
  if (v.kanji && v.kanji !== v.kana && !v.kanji.endsWith(v.kana.slice(-1)))
    avi('verbo: el kanji de ' + v.kana + ' (' + v.kanji + ') no termina como la lectura');
}

if (verbosDeOtroTema.length)
  inf('verbos que se introducen en otro tema: ' + verbosDeOtroTema.length + ' de ' + u.verbos.length +
      ' — es lo esperable: la gramática nueva se practica sobre verbos ya vistos');

/* ── 3. conjugación ────────────────────────────────────────────── */

for (const v of u.verbos) {
  for (const fid of [].concat(u.formas[v.c] || [])) {
    const s = M.conjugar(v, fid);
    if (typeof s !== 'string' || !s || s.includes('undefined'))
      err('conjugación: ' + v.kana + ' ' + fid + ' devuelve ' + s);
    else if (s === v.kana)
      err('conjugación: ' + v.kana + ' ' + fid + ' no cambia la forma');
  }
}

/* ── 4. vocabulario contra el índice ───────────────────────────── */

const deOtroTema = [];
for (const v of u.vocab) {
  /* El match por kana solo es de fiar cuando además cuadra el kanji, o cuando
     ninguno de los dos lo tiene. Sin esa condición, かじ encuentra 家事
     ("tareas domésticas") y el validador acusa de mala glosa a 火事. */
  const exacto = vocIdx.find((x) => coincide(x.kanji, v.jp) && coincide(x.kana, v.kana));
  const porKanji = exacto || vocIdx.find((x) => coincide(x.kanji, v.jp));
  const porKana = vocIdx.find((x) => coincide(x.kana, v.kana));
  const o = porKanji || porKana;

  if (!o) { avi('vocabulario: ' + v.jp + ' (' + v.kana + ') no aparece en el índice'); continue; }
  if (!porKanji && KANJI.test(v.jp) && KANJI.test(o.kanji || '') && !coincide(o.kanji, v.jp)) {
    avi('vocabulario: ' + v.jp + ' no está en el índice; ' + v.kana + ' sí, pero como ' + o.kanji +
        ' ("' + o.es + '"). Comprueba que no sea un homófono distinto');
    continue;
  }
  if (o.tema && o.tema !== UNIDAD) deOtroTema.push(v.jp + ' (tema ' + o.tema + ')');
  const mias = palabras(v.es), suyas = palabras(o.es);
  if (mias.length && suyas.length && !mias.some((w) => suyas.includes(w)))
    avi('glosa: ' + v.jp + ' — aquí "' + v.es + '", en el índice "' + o.es + '"');
}
if (deOtroTema.length)
  inf('palabras que aparecen por primera vez en otro tema: ' + deOtroTema.length +
      ' (' + deOtroTema.slice(0, 8).join(', ') + (deOtroTema.length > 8 ? '…' : '') + ')');

const repetidas = u.vocab.map((v) => v.jp).filter((x, i, a) => a.indexOf(x) !== i);
for (const r of new Set(repetidas)) err('vocabulario: ' + r + ' está dos veces en la unidad');

/* ── 5. categorías ─────────────────────────────────────────────── */

const porCat = {};
for (const uu of M.UNIDADES) for (const v of uu.vocab) porCat[v.cat] = (porCat[v.cat] || 0) + 1;
for (const c of new Set(u.vocab.map((v) => v.cat)))
  if (porCat[c] < 4) avi('categoría: "' + c + '" reúne solo ' + porCat[c] + ' palabras en todo el libro');

/* ── 6. patrones ───────────────────────────────────────────────── */

const cat = new Map((u.patrones || []).map((p) => [p.pat, p]));
for (const p of u.patrones || []) {
  if (!p.uso) err('patrón: ' + p.pat + ' no tiene línea de uso');
  if (!p.es) err('patrón: ' + p.pat + ' no dice qué significa');
  if (KANJI.test(p.pat) && !p.lectura) err('patrón: ' + p.pat + ' lleva kanji y no dice cómo se lee');
  if (!p.formula) avi('patrón: ' + p.pat + ' no dice cómo se construye');
  if (!p.ejemplo) avi('patrón: ' + p.pat + ' no tiene ejemplo');
}
for (const it of [...u.huecos, ...u.frases]) {
  if (!it.pat) { avi('patrón: ' + it.k + ' no tiene `pat`'); continue; }
  if (!cat.has(it.pat)) err('patrón: ' + it.k + ' usa "' + it.pat + '", que no está en el catálogo de la unidad');
}
if ((u.patrones || []).length < 4)
  avi('patrón: la unidad tiene menos de cuatro patrones; la elección de patrón se queda sin distractores');

/* ── 7. formas ─────────────────────────────────────────────────── */

for (const fid of new Set([].concat(u.formas[1] || [], u.formas[2] || []))) {
  const f = M.FORMAS.find((x) => x.id === fid);
  if (!f) { err('forma: la unidad practica "' + fid + '", que no está en FORMAS'); continue; }
  if (!f.uso) err('forma: ' + fid + ' no tiene línea de uso');
  for (const g of [1, 2, 3]) {
    const nombre = f.ej && f.ej[g];
    if (!nombre) { avi('forma: ' + fid + ' no tiene verbo de ejemplo para el grupo ' + g); continue; }
    const existe = M.UNIDADES.some((uu) => uu.verbos.some((v) => v.kana === nombre));
    if (!existe) avi('forma: el verbo de ejemplo ' + nombre + ' de ' + fid + ' no está en el contenido');
  }
}

/* ── 8. una variante en kana en cada lista de aceptadas ────────── */

const sinKanji = (lista) => lista.some((x) => !KANJI.test(x));
for (const f of u.frases)
  if (!sinKanji(f.ok)) err('kana: la frase ' + f.k + ' no acepta ninguna variante sin kanji: ' + f.ok[0]);
for (const h of u.huecos) {
  if (!sinKanji(h.ok)) err('kana: el hueco ' + h.k + ' no acepta ninguna variante sin kanji: ' + h.ok[0]);
  if (h.ok2 && !sinKanji(h.ok2)) err('kana: el segundo hueco de ' + h.k + ' no acepta variante sin kanji: ' + h.ok2[0]);
}

/* ── 9. presencia en el libro: informe, nunca advertencia ──────── */

const corpus = (LIBRO.porTema[UNIDAD] || '') + LIBRO.todo +
  IDX.gramatica.map((g) => M.normEstricta(g.ejemplo)).join('');
const oraciones = [
  ...u.frases.map((f) => ({ k: f.k, jp: f.ok[0] })),
  ...u.huecos.map((h) => ({ k: h.k, jp: h.pre.replace('（', '') + h.ok[0] + h.post.replace('）', '') })),
  ...u.armar.map((a) => ({ k: a.k, jp: a.chips.join('') })),
];
const confirmadas = oraciones.filter((o) => {
  const n = M.normEstricta(o.jp);
  return n && corpus.includes(n);
});
inf('oraciones confirmadas en el libro: ' + confirmadas.length + ' de ' + oraciones.length +
    ' (' + Math.round(confirmadas.length / oraciones.length * 100) + '%)');
inf('  encontrar una oración prueba que está en el libro; no encontrarla no prueba nada,');
inf('  porque el corpus solo cubre lo que la guía de gramática cita (ver corpus.mjs)');

/* ── 10. cobertura ─────────────────────────────────────────────── */

const delTema = (arr, f) => arr.filter(f);
const vocTema = delTema(vocIdx, (v) => v.tema === UNIDAD);
const mios = new Set(u.vocab.map((v) => v.kana));
const faltanVoc = vocTema.filter((v) => !mios.has(limpiar(v.kana)) && !mios.has(limpiar(v.kanji)));
inf('vocabulario del tema en el índice: ' + vocTema.length + ' · en la app: ' + u.vocab.length +
    ' · sin cubrir: ' + faltanVoc.length);

const kanjiTema = IDX.kanji.filter((k) => k.tema === UNIDAD);
/* Con igualdad de cadenas, ～対～（２対１） no encontraba a 〜対〜 ni
   ～便（115便） a 〜便: el índice le pega un ejemplo entre paréntesis a la
   palabra. Se compara con las mismas variantes que el resto del validador. */
const enApp = (p) => u.vocab.some((v) => coincide(v.jp, p)) || u.verbos.some((v) => coincide(v.kanji || '', p));
const faltanKanji = kanjiTema.filter((k) => !enApp(k.palabra));
inf('kanji del tema: ' + kanjiTema.length + ' · sin cubrir: ' + faltanKanji.length +
    (faltanKanji.length ? ' (' + faltanKanji.map((k) => k.palabra).join(' ') + ')' : ''));

const gramTema = IDX.gramatica.filter((g) => g.nivel === '初中級' && new RegExp('^' + UNIDAD + '[\\s　]').test(g.tema || ''));

/* El índice escribe la tilde de onda como ～ (U+FF5E) y el contenido como 〜
   (U+301C): son dos caracteres distintos y sin igualarlos ni "〜ながら" se
   reconocía a sí mismo. */
const tilde = (s) => (s || '').replace(/[～〜]/g, '〜');

/* Cuando el índice nombra el patrón en forma simple («～ことができる») y el
   libro lo enseña en cortés («〜ことができます»), ninguna comparación por
   texto los va a unir. Para eso está el campo «oficial» del patrón, que lo
   declara a mano. */
const conEjercicio = new Set([...u.huecos, ...u.frases].map((it) => tilde(it.pat)));
const declarados = new Set(
  (u.patrones || []).filter((p) => p.oficial && conEjercicio.has(tilde(p.pat))).map((p) => tilde(p.oficial)));

const sinEjercicio = gramTema.filter((g) => {
  const item = tilde(g.item);
  if (declarados.has(item)) return false;
  return ![...conEjercicio].some((pat) => pat.includes(item) || item.includes(pat));
});
inf('patrones oficiales del tema: ' + gramTema.length + ' · sin ningún ejercicio: ' + sinEjercicio.length +
    (sinEjercicio.length ? ' (' + sinEjercicio.map((g) => g.item).join(' · ') + ')' : ''));

const formasSinVerbo = [...new Set([].concat(u.formas[1] || [], u.formas[2] || []))]
  .filter((fid) => !u.verbos.some((v) => (u.formas[v.c] || []).includes(fid)));
if (formasSinVerbo.length) avi('cobertura: formas sin ningún verbo que las practique: ' + formasSinVerbo.join(' '));

/* ── 11. la tabla de migración contra el archivo congelado ─────── */

if (UNIDAD === 8 && M.CONTENIDO.migracion) {
  const congelado = join(RAIZ, 'fuentes-oficiales', 'congelado-t8.html');
  if (existsSync(congelado)) {
    const b0 = [...leer(congelado).matchAll(/<script>\n([\s\S]*?)<\/script>/g)][0][1];
    const c = vm.runInContext(b0 + '\n;({FRASES,HUECOS,ARMAR});', vm.createContext(Object.create(null)));
    const T = M.CONTENIDO.migracion;
    const modelo = (o) => (o.chips ? o.chips.join('') : o.ok[0]);
    for (const [letra, viejo, nuevo] of [['f', c.FRASES, u.frases], ['h', c.HUECOS, u.huecos], ['a', c.ARMAR, u.armar]]) {
      (T[letra] || []).forEach((k, i) => {
        const d = nuevo.find((x) => x.k === k);
        if (!d) return err('migración: la tabla apunta a ' + k + ', que ya no existe');
        if (modelo(d) !== modelo(viejo[i]))
          err('migración: ' + letra + ':' + i + ' → ' + k + ' apunta a otro ejercicio');
      });
    }
  }
}

/* ── informe ───────────────────────────────────────────────────── */

const lineas = [];
lineas.push('# Validación de la unidad ' + UNIDAD + ' — ' + u.titulo + ' (' + u.es + ')');
lineas.push('');
lineas.push('Generado el ' + new Date().toISOString().slice(0, 10) + ' por `herramientas/validar.mjs`.');
lineas.push('');
lineas.push('| | |');
lineas.push('|---|---|');
lineas.push('| Errores | ' + errores.length + ' |');
lineas.push('| Advertencias | ' + avisos.length + ' |');
lineas.push('');

const bloque = (titulo, arr, vacio) => {
  lineas.push('## ' + titulo);
  lineas.push('');
  if (!arr.length) { lineas.push(vacio); lineas.push(''); return; }
  for (const x of arr) lineas.push('- ' + x);
  lineas.push('');
};

bloque('Errores', errores, 'Ninguno. La unidad puede integrarse.');
bloque('Advertencias', avisos, 'Ninguna.');
lineas.push('## Cobertura');
lineas.push('');
for (const x of informe) lineas.push(x.startsWith('  ') ? '  ' + x.trim() : '- ' + x);
lineas.push('');
lineas.push('## Lo que esto no comprueba');
lineas.push('');
lineas.push('Si la frase en español dice lo que dice la japonesa. Si la lista de respuestas');
lineas.push('aceptadas incluye todas las variantes razonables, que es el error más frecuente');
lineas.push('en la práctica. Si la pista de cada hueco es la correcta. Si el corte de clases');
lineas.push('respeta el del curso. Y si una oración que no aparece en el corpus es japonés');
lineas.push('natural. Eso es revisión humana, con el libro al lado.');
lineas.push('');

mkdirSync(join(RAIZ, 'dist'), { recursive: true });
const destino = join(RAIZ, 'dist', 'validacion-u' + UNIDAD + '.md');
writeFileSync(destino, lineas.join('\n'), 'utf8');

console.log('unidad ' + UNIDAD + ': ' + errores.length + ' errores, ' + avisos.length + ' advertencias');
for (const x of informe) console.log('  ' + x.trim());
console.log('informe: dist/validacion-u' + UNIDAD + '.md');
process.exit(errores.length ? 1 : 0);
