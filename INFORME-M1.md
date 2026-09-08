# Informe M1 — ids estables, progreso v2, migración, exportar e importar

Fecha: 2026-09-08. Plano: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`, secciones 1.3, 2.1, 3.3, 4 y 5, y la fila M1 de la tabla 9.1.

Objetivo del módulo: claves estables en frases, huecos y armar; ids nuevos;
almacén `dojo-marugoto-v2` con el registro de 2.1; migración desde el Tema 8;
exportar e importar con fusión y respaldo; diálogos propios en vez de `alert`
y `confirm`.

## Corrección a una decisión que registré mal

`DECISIONES.md` decía que la vía A de migración quedaba "descartada, no
construida". La construí, y la decisión corregida está en ese archivo.

El razonamiento anterior era demasiado corto. Andrés abre la app desde un
archivo guardado, de lo que deduje que la app nueva nunca compartiría origen
con la antigua. No es así: si guarda el archivo único nuevo en la misma carpeta
y lo abre de la misma forma, el origen es el mismo y la app lee sola el
historial. Lo comprobé en el navegador. La vía A cuesta unas quince líneas
dentro de una función que la vía B necesita de todos modos, así que están las
dos: si al arrancar encuentra el almacén antiguo, migra sola y avisa; si no lo
encuentra, el puente sigue siendo el camino.

## Qué se hizo

### Claves estables

`herramientas/claves.mjs` asigna la clave `k` a cada frase, hueco y ejercicio
de armar: `f8-01`, `h8-01`, `a8-01`. Trabaja sobre el texto del archivo, no
sobre el objeto, con un recorrido que cuenta llaves respetando cadenas y
comentarios; así conserva comentarios, comas y formato tal como los escribió
quien autoró la unidad. La regla que hace que el historial sobreviva a la
revisión humana es que solo rellena vacíos: nunca renumera, nunca toca una
clave existente, y el siguiente número parte del máximo ya usado y no de la
cantidad de entradas, de modo que borrar un ejercicio no recicla su número.
Correrlo dos veces seguidas asigna 0 la segunda vez.

Se asignaron 68 claves: 28 frases, 25 huecos y 15 de armar. El contenido no
cambió en nada más, comprobado comparando cada entrada contra el archivo
congelado sin el campo `k`.

### Tabla de migración

`contenido/migracion-t8.json` traduce el índice posicional antiguo (`h:7`) a la
clave estable (`h:8:h8-08`). Se generó con `claves.mjs --tabla` sobre `u8.js`
en el orden congelado, que es la única condición que la hace correcta, y el
script se niega a regenerarla si ya existe: rehacerla exige borrarla a mano y
volver a comprobarla. El build la inyecta en `CONTENIDO.migracion` para que el
runtime pueda traducir.

### Ids

| Tipo | Antes | Ahora |
|---|---|---|
| vocabulario, escribir | `v:<jp>:es` | igual |
| vocabulario, reconocer | `v:<jp>:jp` | igual |
| conjugación | `c:<kana>:<forma>` | igual |
| hueco | `h:<índice>` | `h:8:h8-01` |
| armar | `a:<índice>` | `a:8:a8-01` |
| frase | `f:<índice>` | `f:8:f8-01` |

`etiqueta` deja de mostrar "hueco 12" y muestra el `es` del ejercicio recortado
a 42 caracteres, que es lo único que se reconoce de un vistazo en el historial.

### Almacén v2

Clave `dojo-marugoto-v2`, registro `{ b, v, f, due, int, man, last }`. El día se
calcula una vez por sesión como número de días desde 1970 en hora local, de modo
que una sesión que cruza la medianoche se cierra con el día en que empezó.
`marcar` ya escribe `due`, `int` y `last`; la escalera de intervalos existe en
`40-programador.js` pero la selección de sesión sigue siendo la del archivo
congelado, tal como pide M1 ("`due` se calcula pero no se usa"). La escalera
completa hasta el paso 7, el `casi` que no castiga, el marcado manual y la
corrección de "La tenía bien" son de M2, según el Anexo A del plano.

`sel` gana `cupoNuevos`, `unidadActual` y `unidades` desde ya, para que una
exportación hecha con M1 sea legible por la versión de M2 sin conversión.

### Migración

`migrarT8(progT8, cfgT8, dia)` es la misma función en las dos vías; lo que
cambia es de dónde sale el almacén de origen. Los ítems migrados llevan
`last: 0`, que significa desconocido y pierde en la fusión contra cualquier
registro con historial real. Un ítem en caja 0 queda con `due` = hoy, así que la
primera sesión lo ve como vencido; el tope por atraso que evita la avalancha es
de M2.

`puente-t8.html` lo genera `herramientas/puente.mjs` desde el archivo congelado.
El agregado va después del último `</script>` y no toca el marcado: arma su
propia tarjeta y la inserta en la pantalla de inicio, de modo que el motor
congelado sigue siendo byte a byte el mismo. Exporta con las mismas tres vías
que la app: compartir el archivo, descarga directa y cuadro de texto.

### Exportar, importar, fusionar

Formato de la sección 4.1, esquema 2, con `hoy` incluido para detectar un reloj
corrido (se avisa, no se bloquea). La importación acepta también el esquema 1,
que es lo que produce el puente. La fusión elige un registro completo por
`last`, luego `v`, luego `b`, y ante empate se queda el local; nunca suma
campos, porque sumar `v` y `f` de dos dispositivos que registraron la misma
sesión duplicaría el historial. Antes de aplicar cualquier importación el
almacén se copia a `dojo-marugoto-v2-respaldo`, y "Deshacer la importación"
aparece mientras ese respaldo exista.

### Diálogos propios

`dialogo({ titulo, texto, campo, botones })` devuelve una promesa. Cuatro usos y
no se generaliza más: el aviso de combinación vacía, el borrado de progreso, la
importación y el aviso de migración. Escape cancela, y en el diálogo de borrar
el botón primario es "Cancelar", no "Borrar".

## Criterios de aceptación

| Criterio | Resultado |
|---|---|
| Migración con un almacén t8 de muestra: `perdidos` vacío y suma de `v` y `f` idéntica | Con un almacén que incluye un registro por cada uno de los 68 ids posicionales que la app antigua podía producir, más vocabulario y conjugación: 0 perdidos, y las sumas de `v`, `f` y `b` coinciden a los dos lados |
| Exportar → importar sobre almacén vacío es idéntico | Sí, comprobado sobre el almacén migrado completo |
| La fusión cumple la regla de 4.3 en seis casos de prueba | Los seis, más el caso del registro migrado (`last: 0`) que pierde contra historial real, y la comprobación de que las vistas no se suman |
| La clave antigua queda intacta | Sí. Tras la migración automática, `dojo-marugoto-t8` sigue con sus 71 ítems |
| `alert` y `confirm` ya no aparecen en `dist/` | 0 en `dist/dojo-marugoto.html` y en `dist/pwa/app.js` |

`node --test "pruebas/*.test.mjs"`: 33 pruebas, 32 en verde, 0 fallos, 1 marcada
`todo` (la de M5). Las 19 nuevas están en `pruebas/progreso.test.mjs`.

Prueba en el navegador, sobre la salida PWA servida en local:

- Vía A: con un historial del Tema 8 de 71 ítems y 282 respuestas sembrado en el
  almacén antiguo, la app arranca, migra sola, avisa "71 ítems, nada se perdió",
  y el historial muestra las mismas 282 respuestas y 28 ítems firmes. La clave
  antigua queda intacta y la configuración (modos, clase, largo) se conserva.
- Vía B: el puente carga sobre el motor congelado sin romperlo (`conjugar`
  sigue devolviendo `のって`), muestra "Tienes 70 ítems guardados aquí" y produce
  un JSON de esquema 1. Pegado en la app nueva y fusionado: 70 ítems, 280
  respuestas, 68 ids en el formato nuevo.
- Ciclo completo exportar → pegar → fusionar → deshacer: devuelve el estado
  exacto en ambos sentidos, y el botón de deshacer aparece y desaparece cuando
  corresponde.
- Los cuatro diálogos funcionan, Escape cancela, y una sesión de 15 se completa
  en los seis modos con los ids nuevos.

No pude tomar capturas de pantalla: el panel del navegador las devolvía en
negro pese a que el DOM estaba correcto. La verificación se hizo leyendo el DOM.

## Desviaciones del plano

**`herramientas/puente.mjs`.** El plano describe el puente como un archivo, no
como un generador. Generarlo desde el archivo congelado es lo que garantiza que
el motor no se altera, y permite rehacerlo si el agregado cambia. El agregado
son 84 líneas y no las veinte que estima el plano, porque incluye las tres vías
de exportación en vez de una sola.

**El almacén se inicia en `70-arranque.js`, no al cargar `30-progreso.js`.** En
el archivo congelado la lectura del `localStorage` ocurría al evaluar el
archivo. Ahora es una llamada explícita a `iniciarProgreso()`, porque la
migración tiene que correr antes del primer render y porque así las pruebas
pueden fijar el estado de partida.

## Lo que queda pendiente

Sigue en pie lo de M0: `FRASES[0]` no tiene variante en kana, y se corrige en
M5 con el validador.

`sel.unidades` se guarda pero no se usa: el filtro por unidad y el chip múltiple
del menú son de M2, cuando `construir` reciba el filtro completo.

## Para aprobar

Migra tu historial real por la vía que corresponda y comprueba que el historial
de la app nueva muestra las mismas cifras de respuestas y de ítems firmes que la
antigua.

Como abres la app desde un archivo guardado, prueba primero **la vía A, que es
gratis**: guarda `2026-09-08 Dojo Marugoto M1 - archivo unico.html` en la misma
carpeta donde tienes la app antigua y ábrelo igual que la abres a ella. Si
comparten origen, aparece el aviso "Tu historial del Tema 8 se trajo a la
versión nueva" y no hay nada más que hacer.

Si ese aviso no aparece, el historial vive en otro origen y toca la vía B: abre
`2026-09-08 Dojo Marugoto M1 - puente.html` de la misma forma en que abres la
app antigua, toca "Exportar progreso", y en la app nueva usa "Importar de
archivo" o "Pegar progreso".
