/* Almacén v2, migración desde el Tema 8, exportar, importar y fusión.
   El criterio de M1 es que ningún ítem del historial real se pierda por el
   camino, así que las pruebas cuentan ítems y suman `v` y `f` a los dos lados. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { cargarMotor, almacenFalso, CON_PROGRESO, tablaMigracion, RAIZ } from './motor.mjs';

/* Los objetos que devuelve el vm tienen los prototipos de su propio realm, y
   deepEqual los compara. Un viaje por JSON los deja comparables. */
const plano = (x) => JSON.parse(JSON.stringify(x));

const cargar = (inicial) => {
  const almacen = almacenFalso(inicial || {});
  return { m: cargarMotor({ archivos: CON_PROGRESO, almacen }), almacen };
};

/* Un almacén del Tema 8 con un registro por cada id que la app antigua podía
   producir: los tres formatos posicionales completos, más vocabulario y
   conjugación. Si la tabla tiene un hueco, esta prueba lo encuentra. */
function almacenT8() {
  const { m } = cargar();
  const prog = {};
  let n = 0;
  const meter = (id) => { n++; prog[id] = { b: n % 5, v: n % 7 + 1, f: n % 3 }; };

  m.FRASES.forEach((_, i) => meter('f:' + i));
  m.HUECOS.forEach((_, i) => meter('h:' + i));
  m.ARMAR.forEach((_, i) => meter('a:' + i));
  m.VOCAB.slice(0, 10).forEach((v) => { meter('v:' + v.jp + ':es'); meter('v:' + v.jp + ':jp'); });
  m.VERBOS.slice(0, 10).forEach((v) => meter('c:' + v.kana + ':masu'));
  return prog;
}

const suma = (p, campo) => Object.values(p).reduce((a, r) => a + r[campo], 0);

/* ── migración ─────────────────────────────────────────────────── */

test('la tabla de migración existe y cubre los tres arreglos', () => {
  const t = tablaMigracion();
  const { m } = cargar();
  assert.equal(t.unidad, 8);
  assert.equal(t.f.length, m.FRASES.length);
  assert.equal(t.h.length, m.HUECOS.length);
  assert.equal(t.a.length, m.ARMAR.length);
  assert.equal(new Set(t.f.concat(t.h, t.a)).size, t.f.length + t.h.length + t.a.length);
});

test('migrar no pierde ningún ítem ni ninguna respuesta', () => {
  const { m } = cargar();
  const t8 = almacenT8();
  const r = m.migrarT8(t8, { modos: ['armar'], clase: '2', largo: 25 }, m.HOY);

  assert.deepEqual(plano(r.perdidos), [], 'ids que no se pudieron traducir');
  assert.equal(Object.keys(r.prog).length, Object.keys(t8).length);
  assert.equal(suma(r.prog, 'v'), suma(t8, 'v'));
  assert.equal(suma(r.prog, 'f'), suma(t8, 'f'));
  assert.equal(suma(r.prog, 'b'), suma(t8, 'b'));
});

test('migrar traduce los ids posicionales al ejercicio correcto', () => {
  const { m } = cargar();
  const t = tablaMigracion();
  const r = m.migrarT8({ 'h:7': { b: 3, v: 9, f: 1 }, 'f:0': { b: 1, v: 2, f: 1 } }, null, m.HOY);

  const idHueco = 'h:8:' + t.h[7];
  const idFrase = 'f:8:' + t.f[0];
  assert.ok(r.prog[idHueco], 'falta ' + idHueco);
  assert.ok(r.prog[idFrase], 'falta ' + idFrase);
  assert.equal(r.prog[idHueco].v, 9);
  assert.equal(m.HUECOS.find((h) => h.k === t.h[7]).ok[0], m.HUECOS[7].ok[0]);
  assert.equal(m.FRASES.find((f) => f.k === t.f[0]).ok[0], m.FRASES[0].ok[0]);
});

test('migrar conserva los ids de vocabulario y conjugación tal cual', () => {
  const { m } = cargar();
  const r = m.migrarT8({ 'v:空港:es': { b: 2, v: 3, f: 1 }, 'c:のる:masu': { b: 4, v: 9, f: 1 } }, null, m.HOY);
  assert.ok(r.prog['v:空港:es']);
  assert.ok(r.prog['c:のる:masu']);
});

test('migrar reporta como perdido lo que no sabe traducir', () => {
  const { m } = cargar();
  const r = m.migrarT8({ 'h:999': { b: 1, v: 1, f: 0 }, 'z:raro': { b: 1, v: 1, f: 0 } }, null, m.HOY);
  assert.deepEqual(plano(r.perdidos).sort(), ['h:999', 'z:raro']);
  assert.equal(Object.keys(r.prog).length, 0);
});

test('migrar da a cada ítem el intervalo de su caja y last en 0', () => {
  const { m } = cargar();
  const r = m.migrarT8({ 'c:のる:masu': { b: 4, v: 9, f: 1 }, 'c:とぶ:masu': { b: 0, v: 1, f: 1 } }, null, 20704);
  assert.deepEqual(plano(r.prog['c:のる:masu']), { b: 4, v: 9, f: 1, int: 14, due: 20718, man: 0, last: 0 });
  /* caja 0 vence hoy: la primera sesión lo ve como vencido */
  assert.equal(r.prog['c:とぶ:masu'].due, 20704);
  assert.equal(r.prog['c:とぶ:masu'].last, 0);
});

test('el arranque migra solo si hay almacén del Tema 8 y no hay v2', () => {
  const t8 = almacenT8();

  const a = cargar({ 'dojo-marugoto-t8': t8 });
  a.m.iniciarProgreso();
  const e1 = a.m.estado();
  assert.equal(Object.keys(e1.prog).length, Object.keys(t8).length);
  assert.ok(e1.avisoMigracion, 'debería avisar de la migración');
  assert.deepEqual(plano(e1.avisoMigracion.perdidos), []);
  assert.ok(a.almacen.leer('dojo-marugoto-t8'), 'la clave antigua tiene que quedar intacta');
  assert.ok(a.almacen.leer('dojo-marugoto-v2'), 'la clave nueva tiene que quedar escrita');

  /* con v2 ya presente no se vuelve a migrar */
  const b = cargar({ 'dojo-marugoto-t8': t8, 'dojo-marugoto-v2': { 'v:空港:es': { b: 1, v: 1, f: 0 } } });
  b.m.iniciarProgreso();
  const e2 = b.m.estado();
  assert.equal(Object.keys(e2.prog).length, 1);
  assert.equal(e2.avisoMigracion, null);

  /* sin nada, arranca vacío y sin aviso */
  const c = cargar();
  c.m.iniciarProgreso();
  assert.deepEqual(plano(c.m.estado().prog), {});
  assert.equal(c.m.estado().avisoMigracion, null);
});

/* ── exportar e importar ───────────────────────────────────────── */

test('exportar seguido de importar sobre almacén vacío devuelve lo idéntico', () => {
  const a = cargar();
  a.m.iniciarProgreso();
  const t8 = almacenT8();
  a.m.fijarProg(a.m.migrarT8(t8, null, a.m.HOY).prog);
  const salida = a.m.exportar();

  const b = cargar();
  b.m.iniciarProgreso();
  const d = b.m.leerExportacion(salida.texto);
  assert.ok(!d.error, d.error);
  assert.equal(d.esquema, 2);
  b.m.aplicarImportacion(d, true);
  assert.deepEqual(plano(b.m.estado().prog), plano(a.m.estado().prog));
});

test('el nombre del archivo lleva la fecha', () => {
  const { m } = cargar();
  assert.match(m.nombreExportacion(m.HOY), /^dojo-marugoto-progreso-\d{4}-\d{2}-\d{2}\.json$/);
});

test('importar acepta el esquema 1 que produce el puente', () => {
  const { m } = cargar();
  const t8 = almacenT8();
  const d = m.leerExportacion(JSON.stringify({
    app: 'dojo-marugoto-t8', esquema: 1, hoy: m.HOY,
    prog: t8, cfg: { modos: ['conj'], clase: '1', largo: 40 }
  }));
  assert.ok(!d.error, d.error);
  assert.equal(d.esquema, 1);
  assert.deepEqual(plano(d.perdidos), []);
  assert.equal(Object.keys(d.prog).length, Object.keys(t8).length);
  assert.equal(d.cfg.largo, 40);
});

test('importar rechaza lo que no es un progreso de esta app', () => {
  const { m } = cargar();
  assert.ok(m.leerExportacion('no soy json').error);
  assert.ok(m.leerExportacion('{"app":"otra-cosa","esquema":2,"prog":{}}').error);
  assert.ok(m.leerExportacion('{"app":"dojo-marugoto","esquema":99,"prog":{}}').error);
  assert.ok(m.leerExportacion('{"app":"dojo-marugoto","esquema":2}').error);
});

test('un reloj corrido se avisa, no se bloquea', () => {
  const { m } = cargar();
  assert.equal(m.desfase(m.HOY), 0);
  assert.equal(m.desfase(m.HOY - 5), 5);
  assert.equal(m.desfase(undefined), 0);
});

/* ── fusión ────────────────────────────────────────────────────── */

test('la fusión elige un registro completo, nunca suma campos', () => {
  const { m } = cargar();
  const r = (b, v, f, last) => ({ b, v, f, last, int: 0, due: 0, man: 0 });

  /* 1. solo local */
  assert.deepEqual(m.fusionar({ a: r(1, 1, 0, 10) }, {}).a, r(1, 1, 0, 10));
  /* 2. solo importado */
  assert.deepEqual(m.fusionar({}, { a: r(2, 2, 0, 20) }).a, r(2, 2, 0, 20));
  /* 3. gana el de last mayor, venga de donde venga */
  assert.equal(m.fusionar({ a: r(5, 9, 0, 10) }, { a: r(1, 1, 0, 20) }).a.last, 20);
  assert.equal(m.fusionar({ a: r(1, 1, 0, 30) }, { a: r(5, 9, 0, 20) }).a.last, 30);
  /* 4. empate en last: gana el de más vistas */
  assert.equal(m.fusionar({ a: r(1, 3, 0, 10) }, { a: r(1, 8, 0, 10) }).a.v, 8);
  /* 5. empate en last y v: gana la caja más alta */
  assert.equal(m.fusionar({ a: r(1, 3, 0, 10) }, { a: r(4, 3, 0, 10) }).a.b, 4);
  /* 6. empate en todo: se queda el local */
  const local = r(2, 2, 1, 10);
  assert.equal(m.fusionar({ a: local }, { a: r(2, 2, 9, 10) }).a, local);

  /* y en ningún caso se suman las vistas */
  const f = m.fusionar({ a: r(1, 5, 0, 10) }, { a: r(1, 5, 0, 20) });
  assert.equal(f.a.v, 5);
});

test('un registro migrado (last 0) pierde contra cualquier historial real', () => {
  const { m } = cargar();
  const migrado = { b: 4, v: 20, f: 0, last: 0, int: 14, due: 0, man: 0 };
  const real = { b: 1, v: 2, f: 1, last: 20704, int: 1, due: 20705, man: 0 };
  assert.equal(m.fusionar({ a: migrado }, { a: real }).a, real);
  assert.equal(m.fusionar({ a: real }, { a: migrado }).a, real);
});

test('importar respalda antes y deshacer devuelve el estado anterior', () => {
  const { m, almacen } = cargar();
  m.iniciarProgreso();
  const antes = { 'v:空港:es': { b: 3, v: 5, f: 0, last: 20700, int: 7, due: 20707, man: 0 } };
  m.fijarProg(antes);
  m.save();

  assert.equal(m.hayRespaldo(), false);
  m.aplicarImportacion({ prog: { 'v:水:es': { b: 1, v: 1, f: 0, last: 20704, int: 1, due: 20705, man: 0 } } }, true);
  assert.equal(m.hayRespaldo(), true);
  assert.deepEqual([...Object.keys(m.estado().prog)], ['v:水:es']);

  assert.equal(m.deshacerImportacion(), true);
  assert.deepEqual(plano(m.estado().prog), antes);
  assert.equal(m.hayRespaldo(), false, 'el respaldo se consume al deshacer');
  assert.deepEqual(plano(almacen.leer('dojo-marugoto-v2')), antes);
});

/* ── registro e ids ────────────────────────────────────────────── */

test('marcar escribe el registro completo de 2.1', () => {
  const { m } = cargar();
  m.iniciarProgreso();
  m.marcar('c:のる:masu', true);
  const p = m.estado().prog['c:のる:masu'];
  assert.deepEqual(Object.keys(p).sort(), ['b', 'due', 'f', 'int', 'last', 'man', 'v']);
  assert.equal(p.b, 1);
  assert.equal(p.int, m.ESCALERA[1]);
  assert.equal(p.due, m.HOY + m.ESCALERA[1]);
  assert.equal(p.last, m.HOY);

  m.marcar('c:のる:masu', false);
  const q = m.estado().prog['c:のる:masu'];
  assert.equal(q.b, 0);
  assert.equal(q.f, 1);
  assert.equal(q.due, m.HOY, 'un fallo vuelve hoy');
});

test('los ids de ejercicio llevan unidad y clave estable', () => {
  const { m } = cargar();
  m.iniciarProgreso();
  m.fijarSel({ modos: ['hueco', 'armar', 'frase'], clase: '0', largo: 0 });
  m.construir();
  const ids = m.cola().map((q) => q.id);
  assert.ok(ids.length > 0);
  for (const id of ids) {
    assert.match(id, /^[haf]:8:[fha]8-\d{2}$/, id);
  }
  assert.equal(new Set(ids).size, ids.length, 'ids repetidos');
});

/* ── la salida compilada ───────────────────────────────────────── */

test('alert y confirm ya no aparecen en dist', { skip: !existsSync(join(RAIZ, 'dist', 'dojo-marugoto.html')) }, () => {
  for (const rel of [['dist', 'dojo-marugoto.html'], ['dist', 'pwa', 'app.js']]) {
    const t = readFileSync(join(RAIZ, ...rel), 'utf8');
    assert.equal(/(^|[^.\w])alert\s*\(/.test(t), false, 'alert en ' + rel.join('/'));
    assert.equal(/(^|[^.\w])confirm\s*\(/.test(t), false, 'confirm en ' + rel.join('/'));
  }
});

test('el puente exporta el almacén del Tema 8 sin tocar el motor congelado', () => {
  const ruta = join(RAIZ, 'puente-t8.html');
  assert.ok(existsSync(ruta), 'falta puente-t8.html');
  const puente = readFileSync(ruta, 'utf8').replace(/\r\n/g, '\n');
  const congelado = readFileSync(join(RAIZ, 'fuentes-oficiales', 'congelado-t8.html'), 'utf8').replace(/\r\n/g, '\n');

  /* El puente es el archivo congelado más un agregado al final: todo lo que
     había antes tiene que seguir ahí, byte a byte (plano 5.1). */
  const corte = congelado.lastIndexOf('</script>');
  assert.ok(puente.startsWith(congelado.slice(0, corte)), 'el puente alteró el archivo congelado');

  /* y el agregado tiene que producir un JSON de esquema 1 */
  const bloques = [...puente.matchAll(/<script>\n([\s\S]*?)<\/script>/g)].map((x) => x[1]);
  const agregado = bloques[bloques.length - 1];
  assert.match(agregado, /esquema\s*:\s*1/);
  assert.match(agregado, /dojo-marugoto-t8/);

  /* se corre el volcado con un almacén de prueba y se importa en la app */
  const t8 = almacenT8();
  const almacen = almacenFalso({ 'dojo-marugoto-t8': t8, 'dojo-marugoto-t8-cfg': { modos: ['conj'], clase: '1', largo: 40 } });
  const ctx = vm.createContext({ localStorage: almacen, Date });
  /* se corre solo `volcadoT8`; lo que sigue arma la tarjeta y toca el DOM */
  const texto = vm.runInContext(
    agregado.slice(agregado.indexOf('function volcadoT8'), agregado.indexOf('(function(){')) +
      '\n;volcadoT8();',
    ctx, { filename: 'puente' }
  );

  const { m } = cargar();
  const d = m.leerExportacion(texto);
  assert.ok(!d.error, d.error);
  assert.equal(d.esquema, 1);
  assert.deepEqual(plano(d.perdidos), []);
  assert.equal(Object.keys(d.prog).length, Object.keys(t8).length);
  assert.equal(suma(d.prog, 'v'), suma(t8, 'v'));
  assert.equal(d.cfg.largo, 40);
});
