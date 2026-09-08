# Informe M0 — repositorio y compilación equivalente

Fecha: 2026-09-08. Plano: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`, sección 9.1.

Objetivo del módulo: partir el archivo congelado del Tema 8 en `src/` y
`contenido/u8.js` sin cambiar comportamiento, y producir las dos salidas con
`build.mjs`.

## Hallazgos previos

**La copia de `App` no es idéntica a la de `Outputs`.** El archivo de traspaso
del 7 de septiembre decía que sí. `App\...html` tiene 1.158 líneas y le faltan
dos cosas que la de `Outputs` (1.191 líneas) sí trae: el campo `cat` en las 64
palabras de `VOCAB`, y las funciones `sinTildes`, `clavesDe`, `chocan` y
`distractores`. La de `App` genera distractores tomando cualquier palabra al
azar; la de `Outputs` los toma de la misma categoría y descarta los que se
pisan en español. El contrato del plano supone `cat` y `distractores`, así que
la copia de `Outputs` es la congelada y es la que se partió. La copia de `App`
quedó como está: no la toqué porque no sé si es la que abres en el celular, y
eso es justo el dato pendiente de la sección 0 del plano.

**No había Node en el equipo.** Se instaló Node 24.19.0 LTS con winget, con tu
autorización. Es la única dependencia del proyecto; no hay `package.json` ni
`node_modules`.

## Qué se hizo

El archivo congelado se partió por rangos de línea verificados. Ninguna línea
de motor se reescribió: se movieron de archivo tal cual. La comprobación
mecánica de la partición (comparar cada línea no vacía del original contra el
conjunto de archivos producidos) da 24 líneas del original ausentes, y son
exactamente las 24 que se reemplazaron a propósito: los tres banners de
comentario, los seis `const X = [` que ahora son claves de un objeto, el
`const TEMA = {…}` que ahora son campos de la unidad, y sus cierres.

```
dojo-marugoto/
  src/index.html          plantilla con {{CSS}} {{JS}} {{CONTENIDO}} {{PWA_HEAD}} {{SELLO}}
  src/css/app.css         150 líneas
  src/js/00-tablas.js     U2I U2A U2E TE1 SURU KURU EXC RK VOCAL_DE FILA CHOON BASURA
  src/js/05-contenido.js  puente (ver más abajo)
  src/js/10-conjugador.js conjugar conKanji aceptadasDeConjugacion reglaDe
  src/js/20-normalizador.js romajiAKana kataAHira expandirChoon quitarLargas normEstricta normSuelta revisar
  src/js/30-progreso.js   almacén t8 y configuración
  src/js/40-programador.js pesado enClase          (M2 los reemplaza)
  src/js/50-preguntas.js  baraja distractores construir
  src/js/60-ui.js         MODOS, estado de sesión, render y corrección
  src/js/70-arranque.js   empezar, cableado, primer render
  contenido/catalogo.js   CONTENIDO, FORMAS, CATEGORIAS
  contenido/u8.js         la unidad 8, en el orden congelado
  herramientas/build.mjs  una fuente, dos salidas
  herramientas/vector.mjs genera el vector de conjugación desde el archivo congelado
  herramientas/servir.mjs servidor estático local (adelanto de M4)
  pruebas/                node --test, sin paquetes
  fuentes-oficiales/congelado-t8.html   la copia congelada, para el vector y para M5
```

## Desviaciones del plano, con su motivo

**`src/js/05-contenido.js` no está en la lista de archivos del plano.** Son
once líneas que dan a las funciones del motor los mismos nombres globales que
tenían cuando los datos vivían dentro del HTML (`TEMA`, `VERBOS`, `VOCAB`,
`FRASES`, `HUECOS`, `ARMAR`, `FORMAS`). Sin ese puente, sacar los datos a
`contenido/` obligaba a editar `construir`, `distractores` y todo el render en
M0, que es exactamente lo que M0 no debe hacer. M2 lo reemplaza por acceso por
unidad.

**El sello de versión aparece en el pie.** Lo pide el paso 6 de la sección 6.2
del plano ("se muestra en el pie de la app para que un reporte de error diga
qué versión corre"). Es la única diferencia visible respecto del archivo
congelado, además de la tipografía: una línea gris de ocho caracteres bajo
"Tu progreso se guarda solo en este dispositivo".

**`herramientas/servir.mjs` es de M4.** Lo adelanté porque el criterio de
aceptación de M0 exige completar una sesión en *ambas* salidas, y la salida
PWA carga `app.css`, `app.js` y `contenido.js` por rutas relativas: desde
`file://` no se puede probar. Con él la salida PWA se probó además bajo
subruta (`/dojo/`), que es la comprobación que M4 necesitaba de todos modos.

**`FORMAS` conserva el campo `c`.** El Anexo A del plano asigna a M2 el traslado
de la aplicabilidad por clase a `UNIDADES[].formas`. En M0 se copia tal cual.

## Correcciones aplicadas (las dos que el plano autoriza)

- `<title>` estaba después de `</head>`, dentro del `<body>`. Ahora está en el
  `<head>`, junto a un `<meta name="dojo-build">` con el sello.
- Google Fonts fuera. Se quitaron los tres `<link>` y las dos variables CSS
  cambiaron a la pila del plano 6.6: `system-ui, -apple-system, "Segoe UI",
  Roboto, sans-serif` para el texto general y `"Hiragino Sans", "Noto Sans CJK
  JP", "Noto Sans JP", "Yu Gothic", Meiryo, sans-serif` para el japonés. Se
  pierde el Mincho de los títulos, como el plano anticipa. La app ya no hace
  ninguna petición de red: `grep` de `https?://` sobre `dist/` da 0.

## Criterios de aceptación

| Criterio | Resultado |
|---|---|
| `node --test` pasa con el vector de 472 conjugaciones generado desde el archivo congelado | 13 pruebas en verde, 0 fallos, 1 marcada `todo` (ver abajo). El vector tiene 472 casos: 56 verbos × las formas de su clase, el número exacto que anticipa la sección 0 del plano |
| …y con 40 pares ok / casi / mal | 41 pares. Los 41 se verificaron primero contra el motor del archivo congelado y después contra el de `src/`: mismo resultado |
| `grep -c "https\?://" dist/*` da 0 | 0. También 0 caracteres U+FFFD |
| Una sesión de 15 en cada uno de los seis modos se completa en ambas salidas | 15/15 en `vocabES`, `vocabJP`, `conj`, `hueco`, `armar` y `frase`, en `dist/dojo-marugoto.html` y en `dist/pwa/` servida bajo `/dojo/`. Incluye un hueco doble, que se corrigió bien |
| El progreso previo se sigue leyendo | Sí. Con un almacén `dojo-marugoto-t8` de muestra ({b,v,f} en los tres formatos de id), la app lee el progreso, la caja de cada ítem, el historial ("14 respuestas · 1 ítems ya firmes") y la configuración guardada (modos, clase y largo aparecen marcados) |

Equivalencia con el archivo congelado, comprobada en el navegador comparando
huellas de las salidas completas:

- Conjugación: las 472 salidas de `conjugar`, más `conKanji`, más
  `aceptadasDeConjugacion`, más `reglaDe`, dan la misma huella
  (`a4da0ad7-46582fc9`) en el archivo congelado y en las dos salidas nuevas.
- Datos: `VERBOS`, `VOCAB`, `FRASES`, `HUECOS`, `ARMAR` y `FORMAS` serializados
  dan la misma huella (`e76e0c89-2185a9b1`). El contenido sobrevivió la
  partición sin un solo carácter de diferencia.

## Lo que queda pendiente y por qué

**`FRASES[0]` no tiene ninguna variante en kana.** Sus tres respuestas
aceptadas llevan kanji (`あと20分ほどで、手続きが始まるそうです。` y dos más).
Quien escriba en rōmaji produce kana y va a recibir "mal" con la respuesta
correcta, que es la objeción del usuario secundario del Anexo C. Es el único
caso en las 28 frases y los 25 huecos. No lo corregí porque M0 copia el
contenido sin tocarlo y la corrección de contenido es de M5, con el validador
y tu revisión. La prueba que lo detecta ya está escrita en
`pruebas/normalizador.test.mjs`, marcada `todo`: informa sin bloquear, y pasa a
exigir en cuanto se corrija.

**El dato de la sección 0 del plano sigue abierto**: desde qué origen abres hoy
la app del Tema 8 en el celular. Condiciona si la migración de M1 usa la vía A
(automática, mismo origen) o la vía B (el puente con botón de exportar). M1
construye las dos de todos modos, pero saberlo evita probar la equivocada.

## Para aprobar

`Japones\Outputs\2026-09-08 Dojo Marugoto M0 - archivo unico.html` es la salida
de archivo único. Ábrela en el celular junto a la antigua y confirma que se ve
y responde igual, con la tipografía del sistema. El sello `77427ed0` en el pie
identifica esta compilación.
