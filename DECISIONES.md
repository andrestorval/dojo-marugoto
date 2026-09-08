# Decisiones cerradas

Lo que el plano dejaba abierto y ya está resuelto, con la fecha y el efecto que
tiene sobre los módulos siguientes. No se vuelve a discutir salvo que cambie el
hecho que lo sostiene.

## 2026-09-08

**Migración: vía B, el puente.** Andrés abre hoy la app del Tema 8 desde un
archivo guardado (Descargas / WhatsApp / gestor de archivos), no desde una
dirección web. El `localStorage` es por origen, así que la app nueva no puede
leer `dojo-marugoto-t8` sola. M1 entrega `puente-t8.html`: el archivo congelado
con un botón "Exportar progreso" que vuelca el almacén y su configuración como
JSON de esquema 1. Andrés lo abre **de la misma forma y desde la misma carpeta**
en que abre hoy la app (eso es lo que hace que comparta origen y vea el
historial), exporta, e importa el archivo en la app nueva. La vía A queda
descartada, no construida. Resuelve el dato (c) de la sección 0 del plano.

**El material del libro no se consulta; el uso es personal.** La app se reparte
por mano entre compañeros del curso, sin URL pública difundida. M4 publica la
PWA **con** el contenido incluido; el modo `--sin-contenido` se construye igual
porque cuesta poco y deja la puerta abierta, pero no es el modo por defecto.
Resuelve la tensión 3 (plano 8.3).

**Repositorio git local, sin GitHub por ahora.** `git init` en
`Japones\dojo-marugoto\`, un commit por módulo con su informe. La decisión de
subirlo se toma en M4, cuando toque elegir hosting. Como el repositorio es
privado, `contenido/` y `fuentes-oficiales/` se versionan; el `.gitignore`
lleva escrito qué hay que cambiar si algún día se publica.

**La copia de `Japones\App\` se reemplazó por la de `Outputs`.** Estaba
desactualizada (sin el campo `cat` ni las funciones de distractores por
categoría). Las tres copias del archivo congelado —`App\`, `Outputs\` y
`dojo-marugoto\fuentes-oficiales\congelado-t8.html`— tienen ahora el mismo
hash. La de `fuentes-oficiales/` es la autoridad: de ella salen el vector de
pruebas y la comprobación de la tabla de migración de M5.

## Abierto todavía

**Hosting de la PWA (M4).** GitHub Pages, Netlify Drop o Cloudflare Pages. El
artefacto `dist/pwa/` no tiene rutas absolutas ni supone dominio, así que la
decisión no condiciona nada del código y se puede cambiar después sin costo.
Se decide en M4.
