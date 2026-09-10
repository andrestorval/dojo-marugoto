# Dōjō Marugoto

App de práctica para Marugoto A2/B1 Parte 2, nueve unidades. Sin dependencias,
sin llamadas de red, sin cuentas. El progreso vive en el dispositivo.

Plano maestro: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`.

## Requisitos

Node 18 o superior, nada más. No hay `package.json`, no hay `npm install`.

## Comandos

    node herramientas/build.mjs                compila las dos salidas a dist/
    node herramientas/build.mjs --unidades=8   compila solo las unidades pedidas
    node --test "pruebas/*.test.mjs"           corre las pruebas
    node herramientas/build.mjs --sin-contenido publica la app sin el contenido dentro
    node herramientas/claves.mjs --unidad=8    asigna las claves `k` que falten
    node herramientas/iconos.mjs               regenera los iconos de la PWA
    node herramientas/puente.mjs               regenera puente-t8.html
    node herramientas/vector.mjs               regenera el vector desde el archivo congelado
    node herramientas/servir.mjs --base=/dojo   sirve dist/pwa/ en local bajo subruta
    node herramientas/publicar.mjs             copia dist/pwa/ a docs/, que es lo que publica GitHub Pages
    node herramientas/indices.mjs              lee los cuatro xlsx y escribe indices.json (una vez)
    node herramientas/corpus.mjs               extrae el corpus del libro del PDF (una vez)
    node herramientas/validar.mjs --unidad=8   valida una unidad y escribe dist/validacion-uN.md

Compila antes de correr las pruebas: una de ellas comprueba que `alert` y
`confirm` no aparecen en `dist/`, y sin `dist/` se salta.

En PowerShell, no filtres la salida del build con `Select-Object -First N`: cierra
la tubería y mata el proceso a medio escribir. `dist/` queda incompleto y el
error aparece después, en el navegador.

Salidas:

- `dist/pwa/` — carpeta lista para subir a cualquier hosting estático con
  HTTPS, que es el único requisito del service worker. Rutas relativas: sirve
  en la raíz o bajo `/loquesea/`. Lleva el manifest, el service worker y los
  iconos.
- `dist/dojo-marugoto.html` — archivo único autocontenido, para compartir.
- `dist/contenido.json` — el contenido suelto, para la build sin contenido.
- `docs/` — copia de `dist/pwa/` que sí se versiona: es lo que GitHub Pages
  sirve. Se regenera con `publicar.mjs` y se sube con un commit.

## Estructura

    src/           motor y estilos; JavaScript clásico, concatenado por orden numérico
                   (55-material.js: fichas de forma y patrón, e índice de materia)
    contenido/     una unidad por archivo; se autorea como JS, el runtime consume JSON
    herramientas/  build, validador, vector de pruebas, extractor de páginas del libro
    pruebas/       node --test, sin paquetes
    fuentes-oficiales/  copia del archivo congelado y los índices del libro

## Estado

M0 a M5 cerrados (M4 a falta de que apruebes la instalacion, M5 de que revises las advertencias). El progreso vive en `dojo-marugoto-v2` con fechas por ítem,
el historial del Tema 8 se migra por las dos vías, el programador de repaso
espaciado decide qué entra en cada sesión, y al fallar aparece una pista antes
que la respuesta. La exigencia de cada ítem sube con su caja: reconocer, después
producir con apoyo, después producir solo. La salida PWA ya trae manifest,
service worker e iconos y esta publicada en GitHub Pages. El validador de
contenido ya corre: los Temas 1, 8 y 9 pasan con 0 errores.

**M13 y M6 cerrados: están escritas las unidades 9 y 1.** La 9 se adelantó
porque pediste dejar la 8 y la 9 como versión final; después se retomó el orden
del plano por la 1. Quedan seis: 2, 3, 4, 5, 6 y 7.

La unidad 9 es la primera escrita con el libro escaneado delante:
`herramientas/paginas.mjs` saca las páginas de `Marugoto A2B1.pdf` como imagen
y sus huecos son los ejercicios reales del libro, no una reconstrucción desde
los índices. El PDF vive fuera del repositorio y las páginas van a `dist/`, que
no se versiona.

Cada módulo deja su informe (`INFORME-M0.md` a `INFORME-M5.md`,
`INFORME-M6.md` y `INFORME-M13.md`). Lo que ya se
zanjó y no se reabre está en `DECISIONES.md`; léelo antes de proponer nada.

`puente-t8.html`, en la raíz, es la vía B de la migración: el archivo congelado
del Tema 8 con un botón de exportar. Se abre desde el mismo lugar desde el que
se abre la app antigua.
