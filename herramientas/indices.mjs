/* indices.mjs — lee los cuatro xlsx oficiales y escribe indices.json.
 *
 * Uso:  node herramientas/indices.mjs [--fuente="..\App"]
 *
 * Los índices no cambian, así que la extracción se corre una vez por máquina y
 * el validador consume el JSON. Los xlsx viven fuera del repositorio, en la
 * carpeta del libro; solo entra aquí el JSON derivado.
 *
 * Sin dependencias: `zip.mjs` abre el archivo y las hojas se leen con
 * expresiones regulares, que basta porque las cuatro son tablas planas
 * (plano 7.1).
 */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirZip } from './zip.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith('--' + n + '='))?.split('=')[1] ?? d;
const FUENTE = flag('fuente', join(RAIZ, '..', 'App'));

/* ── XML ───────────────────────────────────────────────────────── */

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const desescapar = (s) =>
  s.replace(/&(amp|lt|gt|quot|apos|#x?[0-9a-fA-F]+);/g, (m, e) => {
    if (ENTIDADES[e]) return ENTIDADES[e];
    return String.fromCodePoint(e[1] === 'x' || e[1] === 'X'
      ? parseInt(e.slice(2), 16)
      : parseInt(e.slice(1), 10));
  });

/* Las cadenas compartidas pueden venir partidas en varios <t>, y traer <rPh>
   con el furigana: eso NO es parte del texto y hay que sacarlo antes. */
function cadenasCompartidas(xml) {
  const out = [];
  for (const m of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    const sinFurigana = m[1].replace(/<rPh[\s\S]*?<\/rPh>/g, '');
    let texto = '';
    for (const t of sinFurigana.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) texto += t[1];
    out.push(desescapar(texto));
  }
  return out;
}

/* Devuelve la hoja como arreglo de filas, cada una un objeto por letra de
   columna. Las celdas vacías no vienen en el XML, así que se indexa por su
   referencia y no por posición. */
function leerHoja(xml, ss) {
  const filas = [];
  for (const f of xml.matchAll(/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
    const celdas = {};
    for (const c of f[2].matchAll(/<c r="([A-Z]+)\d+"([^>]*)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const col = c[1], attrs = c[2] || '', cuerpo = c[3] || '';
      const v = (cuerpo.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      let valor;
      if (/t="s"/.test(attrs)) valor = v !== undefined ? ss[+v] : '';
      else if (/t="inlineStr"/.test(attrs)) {
        valor = '';
        for (const t of cuerpo.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) valor += t[1];
        valor = desescapar(valor);
      } else valor = v !== undefined ? desescapar(v) : '';
      if (valor !== '') celdas[col] = String(valor).trim();
    }
    if (Object.keys(celdas).length) filas.push({ n: +f[1], c: celdas });
  }
  return filas;
}

function hojas(ruta) {
  const z = abrirZip(ruta);
  const ss = z.tiene('xl/sharedStrings.xml') ? cadenasCompartidas(z.texto('xl/sharedStrings.xml')) : [];
  const out = {};
  for (const n of z.nombres()) {
    const m = n.match(/^xl\/worksheets\/(sheet\d+)\.xml$/);
    if (m) out[m[1]] = leerHoja(z.texto(n), ss);
  }
  return out;
}

/* ── los cuatro índices ────────────────────────────────────────── */

const archivo = (n) => {
  const r = join(FUENTE, n);
  if (!existsSync(r)) {
    console.error('falta ' + r + '\nPasa la carpeta con --fuente="ruta"');
    process.exit(1);
  }
  return r;
};

/* Toma la primera fila cuya columna A sea un número: así se saltan los títulos
   y la cabecera sin depender de en qué fila estén. */
const soloDatos = (filas, col = 'A') => filas.filter((f) => /^\d+$/.test(f.c[col] || ''));

function vocabulario() {
  const h = hojas(archivo('preintermediate_vocabulary_index_ES.xlsx'));
  return soloDatos(h.sheet1).map((f) => ({
    i: +f.c.A,
    kana: f.c.B || '',
    kanji: f.c.C || '',
    dicc: f.c.E || '',
    grupo: /^[123]$/.test(f.c.F || '') ? +f.c.F : null,
    es: f.c.G || '',
    tema: /^\d+$/.test(f.c.H || '') ? +f.c.H : null,
    clase: f.c.I || '',
  }));
}

function gramatica() {
  const h = hojas(archivo('list_of_grammar_and_sentence_patterns.xlsx'));
  const filas = h.sheet2 && soloDatos(h.sheet2).length ? h.sheet2 : h.sheet1;
  return soloDatos(filas).map((f) => ({
    n: +f.c.A,
    item: f.c.B || '',
    forma: f.c.C || '',
    categoria: f.c.D || '',
    ejemplo: f.c.E || '',
    nivel: f.c.F || '',
    tema: f.c.G || '',
    leccion: f.c.H || '',
  }));
}

function kanji() {
  const h = hojas(archivo('pre-intermediate_kanji_word_list.xlsx'));
  return soloDatos(h.sheet1).map((f) => ({
    i: +f.c.A,
    n: /^\d+$/.test(f.c.B || '') ? +f.c.B : null,
    palabra: f.c.C || '',
    lectura: f.c.D || '',
    tema: /^\d+$/.test(f.c.E || '') ? +f.c.E : null,
  }));
}

function frases() {
  const h = hojas(archivo('preintermediate_phrase_index.xlsx'));
  return soloDatos(h.sheet1).map((f) => ({
    i: +f.c.A,
    frase: f.c.B || '',
    es: f.c.C || '',
    tema: /^\d+$/.test(f.c.D || '') ? +f.c.D : null,
  }));
}

/* ── salida ────────────────────────────────────────────────────── */

const datos = {
  generado: new Date().toISOString(),
  fuente: 'los cuatro xlsx oficiales del Marugoto A2/B1 Parte 2',
  vocabulario: vocabulario(),
  gramatica: gramatica(),
  kanji: kanji(),
  frases: frases(),
};

mkdirSync(join(RAIZ, 'fuentes-oficiales'), { recursive: true });
writeFileSync(
  join(RAIZ, 'fuentes-oficiales', 'indices.json'),
  JSON.stringify(datos, null, 1) + '\n',
  'utf8'
);

console.log('fuentes-oficiales/indices.json');
console.log('  vocabulario : ' + datos.vocabulario.length + ' filas');
console.log('  gramatica   : ' + datos.gramatica.length + ' filas');
console.log('  kanji       : ' + datos.kanji.length + ' filas');
console.log('  frases      : ' + datos.frases.length + ' filas');
