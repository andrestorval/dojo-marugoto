# Decisiones cerradas

Lo que el plano dejaba abierto y ya está resuelto, con la fecha y el efecto que
tiene sobre los módulos siguientes. No se vuelve a discutir salvo que cambie el
hecho que lo sostiene.

## 2026-09-08

**Migración: las dos vías, con la B como camino seguro.** Andrés abre hoy la app
del Tema 8 desde un archivo guardado (Descargas / WhatsApp / gestor de
archivos), no desde una dirección web. Resuelve el dato (c) de la sección 0 del
plano.

*Corregido el 2026-09-08, durante M1.* Este apartado decía que la vía A quedaba
descartada y no se construía. Era una inferencia demasiado corta: de que Andrés
abra un archivo guardado no se sigue que la app nueva nunca comparta origen con
la antigua. Si guarda el archivo único nuevo en la misma carpeta y lo abre de la
misma forma, el origen es el mismo y la app lee sola `dojo-marugoto-t8`. Está
comprobado en el navegador. Como la vía A cuesta unas quince líneas dentro de
una función que la vía B necesita igual, se construyeron las dos.

Al arrancar, si existe el almacén antiguo y no el nuevo, la app migra sola y lo
avisa una vez; la clave antigua queda intacta como respaldo. Si no lo encuentra,
la vía es `puente-t8.html`: el archivo congelado con un botón "Exportar
progreso" que vuelca el almacén y su configuración como JSON de esquema 1.
Andrés lo abre **de la misma forma y desde la misma carpeta** en que abre hoy la
app —eso es lo que hace que comparta origen y vea el historial—, exporta, e
importa el archivo en la app nueva.

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

**Hosting: GitHub Pages.** M4 publica `dist/pwa/` desde una rama `gh-pages` o
desde `docs/` del repositorio, que a esa altura habrá que subir a GitHub. Da
HTTPS, publica con un push y admite repositorio privado con página pública, así
que el material del libro no queda expuesto en el código aunque la página sí sea
accesible por enlace. Resuelve la tensión 2 (plano 8.2). Como el repositorio
pasa a estar en GitHub aunque sea privado, en M4 hay que revisar el
`.gitignore` con la decisión de uso personal ya tomada.

**El curso está terminado o en pausa.** No hay unidad en curso que empuje el
orden. Los módulos de contenido siguen el orden del plano, 1, 2, 3, 4, 5, 6, 7
y 9, y `unidadActual` no tiene un valor por defecto obvio: lo fija Andrés en la
pantalla de primer uso (Anexo B). En M2, con una sola unidad lista, el valor por
defecto es 8 y la pregunta de primer uso muestra solo las unidades con
`estado: "lista"`. Deja sin efecto, por ahora, la vía de utilidad temprana de
8.6 que consistía en adelantar la unidad de la clase en curso.

**El filtro de sesión es por unidad, con la clase conservada un nivel más
abajo.** Confirma lo que el plano ya definía y responde a una pregunta expresa
de Andrés, que echaba de menos el selector de clase de la app del Tema 8. El
menú "Elegir qué practicar" queda: modos, unidades (chips múltiples, solo las
que tengan `estado: "lista"`), clase (todas / 1 / 2), largo, nuevos por sesión.
La selección de unidades es un conjunto, no una unidad sola: se pueden pedir
varias a la vez. La clase deja de ser el filtro principal porque con nueve
unidades "clase 1" mezcla la primera mitad de nueve unidades distintas, pero
sigue disponible para repasar media unidad. El campo `c` de cada ítem se
mantiene en el contenido en cualquier caso: lo usan las páginas del libro y el
orden de entrada de ítems nuevos de 2.5.

**"Practicar hoy" ignora la selección de unidades y mezcla todo lo vencido.**
También confirma el plano (Anexo B). Es lo que hace que el repaso espaciado
funcione: un ítem de la unidad 2 que toca repasar hoy vuelve hoy, aunque Andrés
esté enfocado en la 7. El menú manual queda para la sesión dirigida, y esa
sesión también pasa por el programador y también registra progreso. Se descartó
convertir la selección de unidades en un ajuste permanente que mandara sobre
"Practicar hoy", y se descartó preguntar al empezar cada sesión.

## 2026-09-10

**El repositorio es público en GitHub, con el material del libro dentro.**
`github.com/andrestorval/dojo-marugoto`. Pages con plan gratuito solo funciona
en repositorios públicos, y Andrés prefirió eso a pagar o a mover el
alojamiento.

Corrige la parte de la tensión 3 que decía que con repositorio público
`contenido/` y `fuentes-oficiales/` van al `.gitignore` (plano 8.3). Se quedan
versionados, a propósito: el historial del contenido es lo que protege la
revisión humana, que es donde está el trabajo caro, y las claves estables de M1
existen justamente para que ese historial sobreviva a las correcciones. Se
asume a cambio que el vocabulario, las frases y el archivo congelado quedan
visibles.

La decisión se tomó sabiendo que ya estaba en el historial de git y que
deshacerla más tarde exige reescribir el historial y forzar el push. No se
reabre salvo que aparezca una razón nueva.

**La página publicada es pública aunque el repositorio no lo fuera.** Vale la
pena tenerlo presente: el enlace no se difunde más allá del curso, pero
cualquiera que lo tenga entra.

## Abierto todavía

Nada que bloquee. Lo que queda son decisiones que nacen dentro de un módulo y se
resuelven ahí.
