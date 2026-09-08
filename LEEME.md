# Dōjō Marugoto

App de práctica para Marugoto A2/B1 Parte 2, nueve unidades. Sin dependencias,
sin llamadas de red, sin cuentas. El progreso vive en el dispositivo.

Plano maestro: `Japones\Outputs\2026-09-08 Plano maestro - Dojo Marugoto 9 unidades v3.md`.

## Requisitos

Node 18 o superior, nada más. No hay `package.json`, no hay `npm install`.

## Comandos

    node herramientas/build.mjs              compila las dos salidas a dist/
    node herramientas/build.mjs --unidades=8 compila solo las unidades pedidas
    node --test "pruebas/*.test.mjs"         corre las pruebas
    node herramientas/vector.mjs             regenera el vector desde el archivo congelado
    node herramientas/servir.mjs --base=/dojo  sirve dist/pwa/ en local bajo subruta

Salidas:

- `dist/pwa/` — carpeta lista para subir a cualquier hosting estático con
  HTTPS. Rutas relativas: sirve en la raíz o bajo `/loquesea/`.
- `dist/dojo-marugoto.html` — archivo único autocontenido, para compartir.
- `dist/contenido.json` — el contenido suelto, para la build sin contenido (M4).

## Estructura

    src/           motor y estilos; JavaScript clásico, concatenado por orden numérico
    contenido/     una unidad por archivo; se autorea como JS, el runtime consume JSON
    herramientas/  build, generador del vector de pruebas (validador: M5)
    pruebas/       node --test, sin paquetes
    fuentes-oficiales/  copia del archivo congelado y los índices del libro

## Estado

Módulo M0 cerrado: el archivo congelado del Tema 8 partido en fuentes, sin
cambio de comportamiento. Lo que sigue es M1 (ids estables, progreso v2,
migración, exportar e importar).
