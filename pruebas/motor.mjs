/* motor.mjs — carga el motor de src/ en un contexto sin DOM.
 *
 * Los archivos de src/js son JavaScript clásico que el build concatena; aquí
 * se concatenan igual, en el mismo orden, y se corren en un vm. Se cargan solo
 * los que no tocan el DOM. Los que sí necesitan almacenamiento reciben un
 * `localStorage` de mentira, con el que las pruebas pueden fijar el estado de
 * partida y leer lo que quedó escrito.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const leer = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

export const SIN_DOM = ['00-tablas.js', '05-contenido.js', '10-conjugador.js', '20-normalizador.js'];
export const CON_PROGRESO = SIN_DOM.concat(['30-progreso.js', '40-programador.js', '55-material.js', '50-preguntas.js']);

/* localStorage de mentira: la interfaz mínima que usa la app. `datos` deja ver
   desde la prueba lo que quedó escrito, sin volver a parsear. */
export function almacenFalso(inicial = {}) {
  const datos = new Map(Object.entries(inicial).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)]));
  return {
    datos,
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
    removeItem: (k) => datos.delete(k),
    clear: () => datos.clear(),
    leer: (k) => { try { return JSON.parse(datos.get(k)); } catch (e) { return null; } },
  };
}

export function cargarMotor({ unidades = null, archivos = SIN_DOM, almacen = null } = {}) {
  const cont = join(RAIZ, 'contenido');
  const deContenido = ['catalogo.js'].concat(
    readdirSync(cont)
      .filter((f) => /^u\d+\.js$/.test(f))
      .filter((f) => !unidades || unidades.includes(Number(f.slice(1, -3))))
      .sort((a, b) => Number(a.slice(1, -3)) - Number(b.slice(1, -3)))
  );

  /* La tabla de migración viaja dentro de CONTENIDO, igual que en el build */
  const tabla = join(cont, 'migracion-t8.json');
  const conTabla = existsSync(tabla) ? '\nCONTENIDO.migracion = ' + leer(tabla) + ';' : '';

  const conProgreso = archivos.includes('30-progreso.js');

  const fuente =
    deContenido.map((f) => leer(join(cont, f))).join('\n') + conTabla + '\n' +
    archivos.map((f) => leer(join(RAIZ, 'src', 'js', f))).join('\n') +
    `\n;({
      CONTENIDO, UNIDADES, FORMAS, CATEGORIAS,
      /* TEMA y compania ya no son del motor: eran los nombres del archivo
         congelado y se retiraron en M6. Las pruebas que vienen de aquella
         epoca hablan de la unidad 8, asi que se los damos apuntando a ella. */
      TEMA: (UNIDADES.find(u => u.n === 8) || UNIDADES[0] || null),
      get VERBOS(){ return this.TEMA ? this.TEMA.verbos : []; },
      get VOCAB (){ return this.TEMA ? this.TEMA.vocab  : []; },
      get FRASES(){ return this.TEMA ? this.TEMA.frases : []; },
      get HUECOS(){ return this.TEMA ? this.TEMA.huecos : []; },
      get ARMAR (){ return this.TEMA ? this.TEMA.armar  : []; },
      conjugar, conKanji, aceptadasDeConjugacion, reglaDe,
      romajiAKana, kataAHira, expandirChoon, quitarLargas,
      normEstricta, normSuelta, revisar` +
    (conProgreso
      ? `,
      HOY, ESCALERA, LS, LS_CFG, LS_RESP, LS_T8,
      diaDe, box, marcar, save, saveCfg,
      migrarT8, exportar, leerExportacion, desfase, fusionar,
      respaldar, hayRespaldo, aplicarImportacion, deshacerImportacion,
      iniciarProgreso, nombreExportacion,
      copiaDe, restaurar, marcarAprendido, desmarcarAprendido, jubilado,
      unidadPorDefecto, unidadActual, registroNuevo,
      transicion, transicionManual, transicionDesmarcar, esJubilado,
      ordenUnidades, ordenEntrada, seleccionar, panorama, baraja,
      armarPool, distractores, construir, panoramaHoy, TODOS_LOS_MODOS,
      moras, esqueleto, distractoresConjugacion, distractoresPatron,
      aplicarEtapa, pistaDe, segundoEjemplo, usoDelPatron,
      conPresentaciones, tarjetaPara, esPregunta, yaVistaForma, yaVistoPatron,
      fichaForma, fichaPatron, materiaDe, verboEjemplo,
      dependenciaCumplida, sinTildes, chocan,
      /* prog y sel se reasignan; hay que leerlos por función */
      estado: () => ({ prog, sel, avisoMigracion }),
      fijarProg: (p) => { prog = p; },
      fijarSel: (s) => { sel = Object.assign({}, sel, s); },
      cola: () => cola`
      : '') +
    `
    });`;

  const contexto = Object.create(null);
  if (almacen) contexto.localStorage = almacen;
  return vm.runInContext(fuente, vm.createContext(contexto), {
    filename: 'motor',
    timeout: 10000,
  });
}

export const vector = () =>
  JSON.parse(leer(join(RAIZ, 'pruebas', 'vector-conjugacion.json')));

export const tablaMigracion = () =>
  JSON.parse(leer(join(RAIZ, 'contenido', 'migracion-t8.json')));
