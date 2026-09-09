# Informe M4 — PWA e instalación

Fecha: 2026-09-09. Plano: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`, secciones 6.3 a 6.5, 8.2 y la fila M4 de la tabla 9.1.

Objetivo del módulo: manifest, service worker, iconos, aviso de versión nueva,
build `--sin-contenido` con "Cargar contenido", y publicación en el hosting
elegido.

**Estado: el código está terminado y verificado hasta donde este entorno
permite. Falta publicar**, que depende de que Patricio cree la cuenta de GitHub.

## Los iconos, sin dependencias

`herramientas/iconos.mjs` escribe los PNG de 192 y 512 px. Un PNG es una firma,
tres bloques y un CRC por bloque, y `zlib` viene con Node: escribirlo a mano
cuesta unas sesenta líneas y evita la primera dependencia del proyecto, que es
el criterio de la sección 6.1.

El dibujo es un torii blanco sobre el azul de la marca, hecho solo con
rectángulos en fracciones del lado, de modo que los dos tamaños salen idénticos.
No lleva 道場 porque dibujar un glifo exigiría una tipografía, y eso sí sería una
dependencia. Se corre una vez; los PNG quedan versionados.

## Manifest y service worker

El manifest usa los valores de 6.3, todos relativos: `start_url` y `scope` en
`./`, nada que dependa del dominio. Eso es lo que permite servir la misma carpeta
en la raíz de un dominio o bajo `/dojo/`.

El service worker es una plantilla que el build rellena con el sello y con la
lista exacta de archivos. Precarga completa en `install`, borrado de toda caché
que no sea el sello vigente en `activate` más `clients.claim()`, y en `fetch`,
caché con red de respaldo para GET del mismo origen y paso directo para
cualquier otra petición.

El registro se dispara solo si existe `<link rel="manifest">`. Esa condición hace
de bandera: la salida de archivo único no lo lleva, así que el mismo código de
registro viaja en las dos salidas y queda inerte donde no corresponde, sin que el
build tenga que marcar nada.

El aviso de versión nueva es el diálogo propio de la app, no el del navegador:
en una PWA instalada el diálogo del sistema muestra el origen y rompe la ilusión
de app. Al aceptar manda `skipWaiting` y recarga en `controllerchange`.

## Un fallo que el propio entorno destapó

`String.prototype.replace` con una cadena sustituye **solo la primera
aparición**. La plantilla del service worker nombraba sus dos marcadores en el
comentario de cabecera ("el build sustituye {{SELLO}} y {{ARCHIVOS}}"), así que
el build sustituía el comentario y dejaba intactos los de verdad. Resultado:
`const CACHE = 'dojo-{{SELLO}}'` literal —la caché nunca se habría invalidado en
una actualización— y `const ARCHIVOS = {{ARCHIVOS}}`, que ni siquiera es
JavaScript válido, de modo que el service worker no habría llegado a instalarse
nunca.

Lo encontré porque el registro fallaba en el navegador y fui a mirar el archivo
emitido. Se arregla con `replaceAll` y quitando los marcadores de la prosa. Dos
pruebas nuevas lo cierran: una comprueba que en `dist/pwa/sw.js` no queda ningún
marcador, que la caché lleva el sello y que el archivo parsea; otra, que todo lo
que precarga existe de verdad en `dist/pwa/`.

## La app sin contenido

`--sin-contenido` deja `contenido.js` reducido a los tres arreglos vacíos y emite
el contenido como archivo suelto. La app arranca con la pantalla de inicio
sirviendo de cargador: el botón principal queda deshabilitado con la línea
"Todavía no hay contenido", el menú y la materia se esconden, y aparece "Cargar
contenido". Al elegir el JSON se guarda en `localStorage` y la app se reinicia.

`05-contenido.js` fusiona lo guardado antes de que nadie lea las constantes, y
`TEMA` cae en una unidad vacía con la forma correcta cuando no hay nada: la app
tiene que poder pintar el inicio sin reventar.

## Criterios de aceptación

| Criterio | Resultado |
|---|---|
| Sirve bajo `/sub/` sin cambios | Sí. Servida en `http://localhost:8147/dojo/`, el manifest carga desde la subruta y las rutas del icono y del contenido resuelven |
| El manifest no supone dominio y trae los dos iconos | `start_url` y `scope` en `./`, `display` standalone, `theme_color` `#17516B`, los dos PNG existentes en `dist/pwa/icons/`. Con prueba |
| El service worker precarga la lista que el build escribe | Los ocho archivos, todos comprobados contra `dist/pwa/`. Con prueba |
| La build sin contenido carga `contenido.json` y persiste tras cerrar | Verificado en el navegador: app con 0 unidades, se carga el JSON, se guarda, y tras recargar hay 56 verbos, 64 palabras, las 12 formas, la tabla de migración y el conjugador respondiendo `のって` |
| El archivo único sigue siendo autocontenido | Sin manifest, sin CSS externo, sin `<script src>`. Con prueba |
| Instalable en Chrome Android | **Sin verificar aquí.** El panel del navegador de este entorno rechaza el registro de cualquier service worker con "an unknown error occurred when fetching the script", incluso con el archivo servido correctamente y ya válido. Lo verifica Patricio en su celular |
| Funciona en modo avión tras instalar | **Sin verificar aquí**, por lo mismo |
| Tras un rebuild aparece el aviso de versión y al aceptar corre el sello nuevo | **Sin verificar aquí**, por lo mismo. El código y el sello sí están comprobados |

`node --test "pruebas/*.test.mjs"`: 86 pruebas, 85 en verde, 0 fallos, 1 marcada
`todo` (la de M5). Las 4 nuevas están en `pruebas/interfaz.test.mjs`.

Lo que no pude verificar es exactamente lo que el criterio de aprobación pone en
manos de Patricio: instalar la PWA en el celular desde la URL y hacer una sesión
sin conexión. No hay forma de adelantarlo desde aquí.

## Lo que falta para cerrar M4

Publicar. Requiere que Patricio cree la cuenta de GitHub, y el registro de una
cuenta es suyo, no mío. Después:

1. Crear un repositorio, privado si quiere.
2. `git remote add origin` y `git push`.
3. Revisar el `.gitignore` con la decisión de uso personal ya tomada. Hoy
   `contenido/` y `fuentes-oficiales/` se versionan porque el repositorio es
   local; con repositorio privado en GitHub la decisión de 8.3 dice que pueden
   seguir versionados.
4. Publicar `dist/pwa/` en GitHub Pages, desde una rama `gh-pages` o desde
   `docs/`. `dist/` está en el `.gitignore`, así que hay que decidir cuál de las
   dos vías y ajustarlo.

## Lo que queda pendiente

Sigue en pie lo de M0: `FRASES[0]` no tiene variante en kana, y se corrige en M5.

La revisión humana del contenido de M3 sigue sin hacerse.

## Para aprobar

Instala la PWA en el celular desde la URL y haz una sesión en modo avión.
