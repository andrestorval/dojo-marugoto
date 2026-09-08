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
    node herramientas/claves.mjs --unidad=8    asigna las claves `k` que falten
    node herramientas/puente.mjs               regenera puente-t8.html
    node herramientas/vector.mjs               regenera el vector desde el archivo congelado
    node herramientas/servir.mjs --base=/dojo   sirve dist/pwa/ en local bajo subruta

Compila antes de correr las pruebas: una de ellas comprueba que `alert` y
`confirm` no aparecen en `dist/`, y sin `dist/` se salta.

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

M0 y M1 cerrados. El progreso vive en `dojo-marugoto-v2` con fechas por ítem, el
historial del Tema 8 se migra por las dos vías, y exportar e importar funcionan
con fusión y con deshacer. Lo que sigue es M2: el programador de repaso
espaciado y la pantalla de inicio con "Practicar hoy".

Cada módulo deja su informe (`INFORME-M0.md`, `INFORME-M1.md`). Lo que ya se
zanjó y no se reabre está en `DECISIONES.md`; léelo antes de proponer nada.

`puente-t8.html`, en la raíz, es la vía B de la migración: el archivo congelado
del Tema 8 con un botón de exportar. Se abre desde el mismo lugar desde el que
se abre la app antigua.
