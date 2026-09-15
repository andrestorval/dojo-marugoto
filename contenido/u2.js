/* Dojo Marugoto - unidad 2, 家をさがす
   Marugoto A2/B1 Parte 2 - clase 1 = libro p34-39 - clase 2 = p40-43

   Escrita leyendo las paginas del libro escaneado y cruzandolas con los
   indices oficiales, igual que las unidades 9 y 1.

   De donde salen los huecos:
     h2-01 a h2-05  p35, ejercicio 2   (el vocabulario de la casa y el barrio)
     h2-06 a h2-10  p35, ejercicio 3   (los contrarios)
     h2-11 a h2-14  p36, ejercicio 2   (como se termina una frase: けど, なくて)
     h2-15 a h2-19  p38 y p39          (から y けど)
     h2-20 a h2-23  p41, 文2           (〜ても)
     h2-24 a h2-28  p41, 文3 (1)       (〜ば con adjetivos y ある)
     h2-29 a h2-32  p42, (2)           (〜ば con verbos)
     h2-33 a h2-36  p42, (4)           (ば y ても juntos)
     h2-37 a h2-40  los dialogos y el texto de くの (p37, p38, p40, p43)

   El corte entre clases es el del libro: la mitad de hablar (p34-39: donde
   vivo, que casa busco, por que me decidi) y la de leer (p40-43: los dos
   cuadros de gramatica y los textos de la web). */

CONTENIDO.unidades.push({
  n: 2,
  titulo: "家をさがす",
  es: "Buscar casa",
  paginas: { 1: "34-39", 2: "40-43" },
  estado: "lista",

  /* Dos formas nuevas: la condicional ば (p41, 文3, con su tabla じょうけんけい)
     y 〜ても (p41, 文2). Las dos se ensenan en el libro sobre adjetivos tanto
     como sobre verbos; el conjugador solo hace verbos, y los adjetivos van en
     los huecos. */
  formas: {
    1: ["masu", "masen", "nai", "ta", "te", "tara", "pot", "tai"],
    2: ["masu", "nai", "ta", "te", "ba", "temo", "pot", "tai"]
  },

  patrones: [
    { pat:"〜けど。／〜なくて。", tipo:"gramatica",
      oficial:"～けど／なくて",
      lectura:"kedo / nakute",
      es:"…, pero… / …, y es que no…",
      formula:"forma simple + けど。 · forma ない sin la い + くて。 La frase se deja ahí, sin terminar",
      uso:"Dos maneras de terminar una frase dejándola en el aire: いろいろさがしてるんですけど… («estoy buscando, pero…»), いいところがあまりなくて… («es que no hay mucho…»). Lo que falta lo pone el otro.",
      ejemplo:"いいえ、まだなんです。いろいろさがして（い）るんですけど。" },

    { pat:"〜から（りゆう）", tipo:"gramatica",
      oficial:"～から",
      lectura:"kara",
      es:"porque…, como…",
      formula:"forma simple + から、+ lo que se decidió. Adjetivo な y sustantivo llevan だ: 安全だから",
      uso:"La razón de una decisión, en primera persona. Va antes de la consecuencia: primero el motivo, luego lo que hice.",
      ejemplo:"広くていい家があったから、決めました。" },

    { pat:"〜けど、〜から", tipo:"gramatica",
      oficial:"～けど、～から",
      lectura:"kedo, kara",
      es:"aunque…, como…",
      formula:"forma simple + けど、+ forma simple + から、+ la decisión",
      uso:"El pero y el porqué en la misma frase: lo malo primero con けど, lo bueno que pesó más con から, y al final lo que decidí. Es la fórmula para explicar por qué se eligió una casa.",
      ejemplo:"会社まで少し遠いけど、広くていい家があったから、そこに決めました。" },

    { pat:"〜ても", tipo:"gramatica",
      oficial:"～ても",
      lectura:"temo",
      es:"aunque…, incluso si…",
      formula:"adjetivo い sin la い + くても (高くても); adjetivo な o sustantivo + でも (不便でも); negativo: 〜なくても / 〜じゃなくても; verbo: forma て + も",
      uso:"Concede algo y sigue adelante: aunque sea caro, aunque no tenga baño, da igual. Es la manera de decir con qué se puede transigir.",
      ejemplo:"せまくてもがまんしています。不便でもここに住みたいです。" },

    { pat:"〜ば／〜なければ", tipo:"gramatica",
      oficial:"～ば／なければ",
      lectura:"ba / nakereba",
      es:"si…, si no…",
      formula:"verbo: grupo 1 última sílaba a la fila え + ば (住む → 住めば), grupo 2 quita る + れば (食べれば), する → すれば; adjetivo い sin la い + ければ (広ければ); negativo: 〜なければ; adjetivo な y sustantivo: 〜なら",
      uso:"La condición hipotética: si hubiera una habitación más grande, me mudaría. Es la じょうけんけい de la tabla de p41; la trampa es que な y los sustantivos no llevan ば, llevan なら.",
      ejemplo:"もっと広いへやがあれば、ひっこしたいです。" },

    { pat:"〜がいいんですが", tipo:"expresion",
      lectura:"〜がいいんですが · ga ii n desu ga",
      es:"preferiría…",
      formula:"lo que se quiere + がいいんですが。 El が final deja la frase abierta",
      uso:"Decir qué se prefiere sin sonar exigente: «una cosa cerca de la estación estaría bien…». Se usa con la inmobiliaria, con el jefe, con quien te ayuda a buscar.",
      ejemplo:"駅から近いところがいいんですが。" },

    { pat:"〜がいいです。〜から。", tipo:"expresion",
      lectura:"〜がいいです。〜から。· ga ii desu. ~ kara.",
      es:"prefiero… Es que…",
      formula:"lo que se quiere + がいいです。+ la razón + から。",
      uso:"La preferencia y su motivo en dos frases: primero lo que quiero, después el porqué, con から al final como remate.",
      ejemplo:"安全なところがいいです。小さい子どもがいますから。" },

    { pat:"〜し、〜し", tipo:"gramatica",
      lectura:"shi",
      es:"…, y además…",
      formula:"forma simple + し、+ forma simple + し. Con も en los sustantivos: スーパーもあるし、かんきょうもいいです",
      uso:"Enumera razones o ventajas sin cerrar la lista: hay supermercado, y además el ambiente es bueno, y además… Suma argumentos.",
      ejemplo:"家はいっこだてで、庭があります。近くにスーパーもあるし、かんきょうもいいです。" },

    { pat:"〜というところ", tipo:"expresion",
      lectura:"〜というところ · to iu tokoro",
      es:"un sitio que se llama…",
      formula:"nombre + というところ",
      uso:"Para nombrar un lugar que el otro seguramente no conoce. Sin el という suena a que debería conocerlo.",
      ejemplo:"キングズベイというところです。" },

    { pat:"〜たら", tipo:"gramatica",
      lectura:"tara",
      es:"cuando…",
      formula:"forma た + ら",
      uso:"El momento futuro: cuando ya estemos instalados. Aquí es el «cuando» de una invitación.",
      ejemplo:"おちついたら、みんなを招待しますから、ぜひあそびに来てください。" },

    { pat:"〜すぎて", tipo:"gramatica",
      lectura:"sugite",
      es:"por demasiado…",
      formula:"adjetivo い sin la い + すぎて (忙しすぎて); raíz de ます + すぎて (働きすぎて). Es 〜すぎる en forma て, dando la causa",
      uso:"Un exceso que trae una consecuencia: de tan ocupado, caí enfermo. すぎる siempre es «demasiado», nunca «muy».",
      ejemplo:"忙しすぎて病気になってしまいました。" },

    { pat:"〜てしまいました", tipo:"gramatica",
      lectura:"te shimaimashita",
      es:"acabé por…, se me…",
      formula:"forma て + しまいました",
      uso:"Algo que pasó del todo y sin quererlo, con un punto de lamento: caí enfermo, se me rompió. No es el pasado normal: lleva la sensación de «y ya está».",
      ejemplo:"病気になってしまいました。" },

    { pat:"〜のに便利", tipo:"gramatica",
      lectura:"〜のにべんり · no ni benri",
      es:"cómodo para…",
      formula:"forma diccionario + のに + 便利／不便",
      uso:"Para decir para qué es cómodo un sitio: para ir a eventos, para las compras. Este のに no es el de «aunque»: es «para».",
      ejemplo:"ここは駅に近くて、イベントに行くのに便利だから、せまくてもがまんしています。" },

    { pat:"〜以上／〜以下", tipo:"gramatica",
      lectura:"〜いじょう／〜いか · ijō / ika",
      es:"… o más / … o menos",
      formula:"cantidad + 以上 (2時間以上) · cantidad + 以下 (6万円以下). Los dos incluyen la cifra dicha",
      uso:"Los límites de una cifra: dos horas o más, sesenta mil yenes o menos. Son las dos palabras del recuadro de kanji que llevan número delante.",
      ejemplo:"家賃が6万円以下のもっと広い部屋があれば、ひっこしたいです。" },

    { pat:"〜かもしれません", tipo:"gramatica",
      lectura:"kamo shiremasen",
      es:"puede que…, a lo mejor…",
      formula:"forma simple + かもしれません. Adjetivo な y sustantivo pelados: 不便かもしれません",
      uso:"Una posibilidad que uno señala con cuidado, sin afirmar. Aquí lo usa quien mira el anuncio y ve una pega.",
      ejemplo:"この家、いいですが、毎日の買い物に不便かもしれませんね。" },

    { pat:"〜ば、〜なくても", tipo:"gramatica",
      lectura:"ba, nakutemo",
      es:"si…, no hace falta…",
      formula:"forma ば + 、+ forma ない sin la い + くても + lo que sí se puede",
      uso:"La condición y la concesión juntas: si hay internet, aunque no vaya a Tokio, puedo trabajar. Es la frase que resume el texto de くの.",
      ejemplo:"インターネットがあれば、東京に行かなくても仕事ができます。" },

    { pat:"気に入っています", tipo:"expresion",
      lectura:"きにいっています · ki ni itte imasu",
      es:"me gusta, estoy contento con…",
      formula:"lo que gusta + が + 気に入っています. Se lee きにいって, no きにはいって",
      uso:"«Me gusta» dicho de algo que uno ya tiene: la casa, el barrio. Distinto de 好き, que es un gusto en general.",
      ejemplo:"私も家族も、今の家がとても気に入っています。" },

    { pat:"楽しみにしています", tipo:"expresion",
      lectura:"たのしみにしています · tanoshimi ni shite imasu",
      es:"lo espero con ganas",
      formula:"（〜を）楽しみにしています",
      uso:"Lo que se contesta a una invitación: lo espero con ilusión. Es fórmula, y se dice entera.",
      ejemplo:"じゃあ、楽しみにしています。" },

    { pat:"もう〜ましたか", tipo:"expresion",
      lectura:"mō ~ mashita ka",
      es:"¿ya…?",
      formula:"もう + forma ました + か. Se responde はい、〜ました o いいえ、まだなんです",
      uso:"Preguntar si algo que se esperaba ya ocurrió. La respuesta negativa no es いいえ、〜ませんでした, es まだ.",
      ejemplo:"家はもう見つかりましたか。" },

    { pat:"まだなんです", tipo:"expresion",
      lectura:"mada nan desu",
      es:"todavía no",
      formula:"いいえ、まだなんです。 Sin repetir el verbo",
      uso:"La respuesta a «¿ya…?» cuando la respuesta es no. El んです le da el tono de explicación: «es que todavía no».",
      ejemplo:"いいえ、まだなんです。" },

    { pat:"はんたいのことば", tipo:"expresion",
      lectura:"はんたいのことば · hantai no kotoba",
      es:"los contrarios",
      formula:"高い⇔安い · せまい⇔広い · 危ない⇔安全 · うるさい⇔静か · 不便⇔便利 · 遠い⇔近い",
      uso:"Los pares de adjetivos con los que se describe una casa, tal como los enfrenta el ejercicio 3 de p35. Con estos seis pares se dice casi todo lo que importa de una vivienda.",
      ejemplo:"やちんが高い ⇔ やちんが安い。へやがせまい ⇔ へやが広い。" }
  ],

  /* --- VERBOS ---------------------------------------------------
     Los del indice del Tema 2 que estas paginas usan. Fuera los que ya
     estan en otra unidad (おく, 買う, 聞く, つくる, 勤める, 手伝う, 乗る,
     できる). 飼う se queda fuera del conjugador porque su kana es el mismo
     que 買う, ya en la unidad 1, y el id del verbo va por kana. */
  verbos: [
    /* grupo 1 — clase 1 */
    { kana:"すむ", kanji:"住む", g:1, es:"vivir (en un sitio)", c:1 },
    { kana:"さがす", kanji:"さがす", g:1, es:"buscar", c:1 },
    { kana:"みつかる", kanji:"見つかる", g:1, es:"encontrarse, aparecer", c:1, nota:"Intransitivo: la casa «se encuentra». La pareja es 見つける" },
    { kana:"ひっこす", kanji:"ひっこす", g:1, es:"mudarse", c:1 },
    { kana:"あそぶ", kanji:"あそぶ", g:1, es:"jugar, pasar el rato", c:1 },
    { kana:"おちつく", kanji:"おちつく", g:1, es:"instalarse, calmarse", c:1 },
    { kana:"かかる", kanji:"かかる", g:1, es:"tardar, llevar (tiempo)", c:1 },
    { kana:"こまる", kanji:"こまる", g:1, es:"estar en apuros, ser un problema", c:1 },
    { kana:"しる", kanji:"知る", g:1, es:"saber, conocer", c:1 },
    { kana:"よろこぶ", kanji:"喜ぶ", g:1, es:"alegrarse", c:1 },
    /* grupo 1 — clase 2 */
    { kana:"かえる", kanji:"帰る", g:1, es:"volver a casa", c:2, nota:"Grupo 1, aunque termine en 〜える" },
    { kana:"つかう", kanji:"使う", g:1, es:"usar", c:2 },
    { kana:"へる", kanji:"へる", g:1, es:"disminuir", c:2, nota:"Grupo 1, aunque termine en 〜える" },

    /* grupo 2 — clase 1 */
    { kana:"きめる", kanji:"決める", g:2, es:"decidir", c:1 },
    { kana:"かんがえる", kanji:"考える", g:2, es:"pensar, considerar", c:1 },
    { kana:"かりる", kanji:"借りる", g:2, es:"alquilar, tomar prestado", c:1 },
    /* grupo 2 — clase 2 */
    { kana:"たべる", kanji:"食べる", g:2, es:"comer", c:2 },
    { kana:"でかける", kanji:"出かける", g:2, es:"salir (de casa)", c:2 },
    { kana:"ふえる", kanji:"ふえる", g:2, es:"aumentar", c:2 },
    { kana:"はなれる", kanji:"はなれる", g:2, es:"estar lejos, alejarse", c:2 },
    { kana:"やめる", kanji:"やめる", g:2, es:"dejar (un trabajo)", c:2 },
    { kana:"ならべる", kanji:"ならべる", g:2, es:"poner en fila, ordenar", c:2 },

    /* grupo 3 — clase 1 */
    { kana:"てんきんする", kanji:"てんきんする", g:3, es:"ser trasladado (en el trabajo)", c:1 },
    { kana:"ひっこしする", kanji:"ひっこしする", g:3, es:"hacer la mudanza", c:1 },
    { kana:"しょうたいする", kanji:"招待する", g:3, es:"invitar", c:1 },
    { kana:"つうきんする", kanji:"通勤する", g:3, es:"ir al trabajo", c:1 },
    /* grupo 3 — clase 2 */
    { kana:"がまんする", kanji:"がまんする", g:3, es:"aguantarse", c:2 },
    { kana:"せいかつする", kanji:"生活する", g:3, es:"vivir, llevar una vida", c:2 },
    { kana:"のんびりする", kanji:"のんびりする", g:3, es:"relajarse, tomárselo con calma", c:2 },
    /* del recuadro de kanji de p35; tambien esta en la unidad 9, y las dos
       unidades suman sus formas sobre la misma tarjeta */
    { kana:"つとめる", kanji:"勤める", g:2, es:"estar empleado en", c:2, nota:"Grupo 2, aunque termine en 〜める" },
    { kana:"かえってくる", kanji:"帰ってくる", g:3, es:"volver (a donde uno estaba)", c:2, nota:"Es 帰って + くる: se conjuga el くる del final" }
  ],

  /* --- VOCABULARIO ---------------------------------------------- */
  vocab: [
    /* la casa y lo que tiene (p34, p35) */
    { jp:"家", kana:"いえ", es:"casa", c:1, cat:"casa" },
    { jp:"アパート", kana:"アパート", es:"apartamento (edificio bajo)", c:1, cat:"casa" },
    { jp:"マンション", kana:"マンション", es:"piso (en bloque)", c:1, cat:"casa" },
    { jp:"一戸建て", kana:"いっこだて", es:"casa unifamiliar", c:1, cat:"casa" },
    { jp:"部屋", kana:"へや", es:"habitación", c:1, cat:"casa" },
    { jp:"庭", kana:"にわ", es:"jardín", c:1, cat:"casa" },
    { jp:"おふろ", kana:"おふろ", es:"baño (bañera)", c:2, cat:"casa" },
    { jp:"シャワー", kana:"シャワー", es:"ducha", c:2, cat:"casa" },
    { jp:"駐車場", kana:"ちゅうしゃじょう", es:"aparcamiento", c:1, cat:"casa" },
    { jp:"家賃", kana:"やちん", es:"alquiler (lo que se paga)", c:1, cat:"casa" },
    { jp:"ペット", kana:"ペット", es:"mascota", c:1, cat:"casa" },
    { jp:"ひっこし", kana:"ひっこし", es:"mudanza", c:1, cat:"casa" },
    { jp:"じょうけん", kana:"じょうけん", es:"condición, requisito", c:1, cat:"abstracto" },
    { jp:"かんきょう", kana:"かんきょう", es:"entorno, ambiente", c:1, cat:"abstracto" },

    /* el barrio y la ciudad (p34, p35, p40) */
    { jp:"駅", kana:"えき", es:"estación", c:1, cat:"lugar" },
    { jp:"学校", kana:"がっこう", es:"escuela", c:1, cat:"lugar" },
    { jp:"小学校", kana:"しょうがっこう", es:"escuela primaria", c:1, cat:"lugar" },
    { jp:"会社", kana:"かいしゃ", es:"empresa, oficina", c:1, cat:"lugar" },
    { jp:"病院", kana:"びょういん", es:"hospital", c:1, cat:"lugar" },
    { jp:"スーパー", kana:"スーパー", es:"supermercado", c:1, cat:"lugar" },
    { jp:"店", kana:"みせ", es:"tienda", c:1, cat:"lugar" },
    { jp:"公園", kana:"こうえん", es:"parque", c:1, cat:"lugar" },
    { jp:"レストラン", kana:"レストラン", es:"restaurante", c:2, cat:"lugar" },
    { jp:"都心", kana:"としん", es:"centro de la ciudad", c:1, cat:"lugar" },
    { jp:"郊外", kana:"こうがい", es:"afueras", c:1, cat:"lugar" },
    { jp:"市内", kana:"しない", es:"dentro de la ciudad", c:2, cat:"lugar" },
    { jp:"場所", kana:"ばしょ", es:"lugar, sitio", c:1, cat:"lugar" },
    { jp:"ところ", kana:"ところ", es:"sitio", c:1, cat:"lugar" },
    { jp:"近く", kana:"ちかく", es:"cerca, los alrededores", c:1, cat:"lugar" },
    { jp:"まわり", kana:"まわり", es:"alrededor", c:1, cat:"lugar" },
    { jp:"あたり", kana:"あたり", es:"por la zona", c:1, cat:"lugar" },
    { jp:"ふるさと", kana:"ふるさと", es:"tierra natal", c:2, cat:"lugar" },
    { jp:"自然", kana:"しぜん", es:"naturaleza", c:2, cat:"lugar" },
    { jp:"温泉", kana:"おんせん", es:"aguas termales", c:2, cat:"lugar" },

    /* moverse (p35, p40, p43) */
    { jp:"交通", kana:"こうつう", es:"transporte, comunicaciones", c:1, cat:"viaje" },
    { jp:"通勤", kana:"つうきん", es:"el trayecto al trabajo", c:1, cat:"viaje" },
    { jp:"電車", kana:"でんしゃ", es:"tren", c:1, cat:"viaje" },
    { jp:"バス", kana:"バス", es:"autobús", c:1, cat:"viaje" },
    { jp:"車", kana:"くるま", es:"coche", c:1, cat:"viaje" },
    { jp:"買い物", kana:"かいもの", es:"las compras", c:1, cat:"abstracto" },
    { jp:"イベント", kana:"イベント", es:"evento", c:2, cat:"abstracto" },

    /* como es la casa: los adjetivos (p35, p36, p41) */
    { jp:"広い", kana:"ひろい", es:"amplio, espacioso", c:1, cat:"cualidad" },
    { jp:"せまい", kana:"せまい", es:"pequeño, estrecho (un espacio)", c:1, cat:"cualidad" },
    { jp:"高い", kana:"たかい", es:"caro", c:1, cat:"cualidad" },
    { jp:"安い", kana:"やすい", es:"barato", c:1, cat:"cualidad" },
    { jp:"近い", kana:"ちかい", es:"cercano", c:1, cat:"cualidad" },
    { jp:"遠い", kana:"とおい", es:"lejano", c:1, cat:"cualidad" },
    { jp:"静か", kana:"しずか", es:"tranquilo, silencioso", c:1, cat:"cualidad" },
    { jp:"うるさい", kana:"うるさい", es:"ruidoso", c:1, cat:"cualidad" },
    { jp:"安全", kana:"あんぜん", es:"seguro (sin peligro)", c:1, cat:"cualidad" },
    { jp:"危ない", kana:"あぶない", es:"peligroso", c:1, cat:"cualidad" },
    { jp:"便利", kana:"べんり", es:"cómodo, práctico", c:1, cat:"cualidad" },
    { jp:"不便", kana:"ふべん", es:"incómodo, mal comunicado", c:1, cat:"cualidad" },
    { jp:"明るい", kana:"あかるい", es:"luminoso", c:2, cat:"cualidad" },
    { jp:"古い", kana:"ふるい", es:"viejo, antiguo", c:1, cat:"cualidad" },
    { jp:"新しい", kana:"あたらしい", es:"nuevo", c:1, cat:"cualidad" },
    { jp:"おしゃれ", kana:"おしゃれ", es:"con estilo, elegante", c:2, cat:"cualidad" },
    { jp:"きれい", kana:"きれい", es:"bonito, limpio", c:1, cat:"cualidad" },
    { jp:"ゆたか", kana:"ゆたか", es:"rico, abundante", c:2, cat:"cualidad" },
    { jp:"むり", kana:"むり", es:"imposible, insostenible", c:2, cat:"cualidad" },
    { jp:"たいへん", kana:"たいへん", es:"duro, difícil", c:1, cat:"cualidad" },
    { jp:"多い", kana:"おおい", es:"muchos, abundante", c:2, cat:"cualidad" },
    { jp:"少ない", kana:"すくない", es:"pocos, escaso", c:1, cat:"cualidad" },

    /* la gente y la vida (p37, p40, p43) */
    { jp:"家族", kana:"かぞく", es:"familia", c:1, cat:"persona" },
    { jp:"子ども", kana:"こども", es:"niño, hijo", c:1, cat:"persona" },
    { jp:"両親", kana:"りょうしん", es:"los padres", c:2, cat:"persona" },
    { jp:"兄", kana:"あに", es:"mi hermano mayor", c:2, cat:"persona" },
    { jp:"母", kana:"はは", es:"mi madre", c:2, cat:"persona" },
    { jp:"お客さん", kana:"おきゃくさん", es:"visita, cliente", c:2, cat:"persona" },
    { jp:"生活", kana:"せいかつ", es:"la vida (diaria)", c:2, cat:"abstracto" },
    { jp:"給料", kana:"きゅうりょう", es:"sueldo", c:2, cat:"trabajo" },
    { jp:"ざんぎょう", kana:"ざんぎょう", es:"horas extra", c:2, cat:"trabajo" },
    { jp:"平日", kana:"へいじつ", es:"día de diario", c:2, cat:"tiempo" },
    { jp:"毎日", kana:"まいにち", es:"todos los días", c:1, cat:"tiempo" },
    { jp:"去年", kana:"きょねん", es:"el año pasado", c:2, cat:"tiempo" },
    { jp:"夜", kana:"よる", es:"la noche", c:1, cat:"tiempo" },
    { jp:"昼", kana:"ひる", es:"el día, el mediodía", c:2, cat:"tiempo" },
    { jp:"病気", kana:"びょうき", es:"enfermedad", c:2, cat:"problema" },
    { jp:"ストレス", kana:"ストレス", es:"estrés", c:2, cat:"problema" },
    { jp:"問題", kana:"もんだい", es:"problema", c:2, cat:"problema" },
    { jp:"お金", kana:"おかね", es:"dinero", c:1, cat:"objetos" },
    { jp:"〜以上", kana:"〜いじょう", es:"… o más", c:2, cat:"conector" },
    { jp:"〜以下", kana:"〜いか", es:"… o menos", c:2, cat:"conector" },
    { jp:"インターネット", kana:"インターネット", es:"internet", c:2, cat:"objetos" },
    { jp:"野菜", kana:"やさい", es:"verdura", c:2, cat:"objetos" },
    { jp:"バーベキュー", kana:"バーベキュー", es:"barbacoa", c:2, cat:"objetos" },

    /* adverbios y muletillas */
    { jp:"やっと", kana:"やっと", es:"por fin", c:1, cat:"conector" },
    { jp:"まだ", kana:"まだ", es:"todavía", c:1, cat:"conector" },
    { jp:"もし", kana:"もし", es:"si (acaso)", c:2, cat:"conector" },
    { jp:"だんだん", kana:"だんだん", es:"poco a poco", c:2, cat:"conector" },
    { jp:"どんどん", kana:"どんどん", es:"sin parar, cada vez más", c:2, cat:"conector" },
    { jp:"それで", kana:"それで", es:"y por eso", c:2, cat:"conector" },
    { jp:"ずっと", kana:"ずっと", es:"todo el tiempo, para siempre", c:2, cat:"conector" },
    { jp:"少し", kana:"すこし", es:"un poco", c:1, cat:"conector" },
    { jp:"ちょっと", kana:"ちょっと", es:"un poco, algo", c:2, cat:"conector" },
    { jp:"とても", kana:"とても", es:"muy", c:1, cat:"conector" }
  ],

  frases: [
    { k:"f2-01", es:"No, todavía no. Estoy mirando varias cosas, pero…", c:1, pat:"〜けど。／〜なくて。",
      ok:["いいえ、まだなんです。いろいろさがして（い）るんですけど。","いいえ、まだなんです。いろいろさがしてるんですけど。","いいえ、まだなんです。いろいろさがしているんですけど。"] },
    { k:"f2-02", es:"Sí. Pero es que no hay mucho bueno…", c:1, pat:"〜けど。／〜なくて。",
      ok:["ええ。でも、いいところがあまりなくて。"] },
    { k:"f2-03", es:"Había una casa grande y buena, así que me decidí.", c:1, pat:"〜から（りゆう）",
      ok:["広くていい家があったから、決めました。","ひろくていいいえがあったから、きめました。"] },
    { k:"f2-04", es:"Cuando estemos instalados os invito a todos, así que venid sin falta.", c:1, pat:"〜たら",
      ok:["おちついたら、みんなを招待しますから、ぜひあそびに来てください。","おちついたら、みんなをしょうたいしますから、ぜひあそびにきてください。"] },
    { k:"f2-05", es:"Como el jardín es grande y se puede jugar, los niños están encantados.", c:1, pat:"〜から（りゆう）",
      ok:["庭が広くてあそべるから、子どもも喜んでます。","にわがひろくてあそべるから、こどももよろこんでます。","庭が広くてあそべるから、子どもも喜んでいます。"] },
    { k:"f2-06", es:"Está un poco lejos de la oficina, pero había una casa grande y buena, así que me decidí por esa.", c:1, pat:"〜けど、〜から",
      ok:["会社まで少し遠いけど、広くていい家があったから、そこに決めました。","かいしゃまですこしとおいけど、ひろくていいいえがあったから、そこにきめました。"] },
    { k:"f2-07", es:"Es pequeño, pero la estación está cerca y es cómodo, así que elegí ese piso.", c:1, pat:"〜けど、〜から",
      ok:["せまいけど、駅が近くて便利だから、そのマンションにしました。","せまいけど、えきがちかくてべんりだから、そのマンションにしました。"] },
    { k:"f2-08", es:"Preferiría un sitio cerca de la estación…", c:1, pat:"〜がいいんですが",
      ok:["駅から近いところがいいんですが。","えきからちかいところがいいんですが。"] },
    { k:"f2-09", es:"Prefiero un sitio seguro. Es que tengo niños pequeños.", c:1, pat:"〜がいいです。〜から。",
      ok:["安全なところがいいです。小さい子どもがいますから。","あんぜんなところがいいです。ちいさいこどもがいますから。"] },
    { k:"f2-10", es:"Es una casa unifamiliar con jardín. Cerca hay un súper, y además el entorno es bueno.", c:1, pat:"〜し、〜し",
      ok:["家はいっこだてで、庭があります。近くにスーパーもあるし、かんきょうもいいです。","いえはいっこだてで、にわがあります。ちかくにスーパーもあるし、かんきょうもいいです。"] },
    { k:"f2-11", es:"Es un sitio que se llama Kings Bay.", c:1, pat:"〜というところ",
      ok:["キングズベイというところです。"] },
    { k:"f2-12", es:"A mí y a mi familia nos gusta mucho la casa de ahora.", c:1, pat:"気に入っています",
      ok:["私も家族も、今の家がとても気に入っています。","わたしもかぞくも、いまのいえがとてもきにいっています。"] },
    { k:"f2-13", es:"Pues lo espero con ganas.", c:1, pat:"楽しみにしています",
      ok:["じゃあ、楽しみにしています。","じゃあ、たのしみにしています。"] },
    { k:"f2-14", es:"¿Ya has encontrado casa?", c:1, pat:"もう〜ましたか",
      ok:["家はもう見つかりましたか。","いえはもうみつかりましたか。"] },
    { k:"f2-15", es:"No, todavía no.", c:1, pat:"まだなんです",
      ok:["いいえ、まだなんです。"] },
    { k:"f2-16", es:"El alquiler es caro ⇔ el alquiler es barato.", c:1, pat:"はんたいのことば",
      ok:["やちんが高い ⇔ やちんが安い。へやがせまい ⇔ へやが広い。","やちんが高い⇔やちんが安い。","やちんがたかい ⇔ やちんがやすい。"] },
    { k:"f2-17", es:"Aunque es pequeño, me aguanto. Aunque sea incómodo, quiero vivir aquí.", c:2, pat:"〜ても",
      ok:["せまくてもがまんしています。不便でもここに住みたいです。","せまくてもがまんしています。ふべんでもここにすみたいです。"] },
    { k:"f2-18", es:"Solo uso la ducha, así que aunque no haya bañera me vale.", c:2, pat:"〜ても",
      ok:["シャワーしか使わないので、おふろがなくてもいいです。","シャワーしかつかわないので、おふろがなくてもいいです。"] },
    { k:"f2-19", es:"Si hubiera una habitación más grande, me mudaría.", c:2, pat:"〜ば／〜なければ",
      ok:["もっと広いへやがあれば、ひっこしたいです。","もっとひろいへやがあれば、ひっこしたいです。"] },
    { k:"f2-20", es:"Como viene mucha gente, si es amplia quiero alquilar esa casa.", c:2, pat:"〜ば／〜なければ",
      ok:["お客さんがたくさん来るので、ひろければ、その家を借りたいです。","おきゃくさんがたくさんくるので、ひろければ、そのいえをかりたいです。"] },
    { k:"f2-21", es:"Si no hay un restaurante cerca, es un problema.", c:2, pat:"〜ば／〜なければ",
      ok:["料理ができないから、近くにレストランがなければ、こまります。","りょうりができないから、ちかくにレストランがなければ、こまります。"] },
    { k:"f2-22", es:"Pero si el fin de semana compro mucho en el súper, no pasa nada.", c:2, pat:"〜ば／〜なければ",
      ok:["でも、週末スーパーでたくさんかえば、だいじょうぶですよ。","でも、しゅうまつスーパーでたくさんかえば、だいじょうぶですよ。"] },
    { k:"f2-23", es:"Está cerca de la estación y es cómodo para ir a eventos, así que aunque sea pequeño me aguanto.", c:2, pat:"〜のに便利",
      ok:["ここは駅に近くて、イベントに行くのに便利だから、せまくてもがまんしています。","ここはえきにちかくて、イベントにいくのにべんりだから、せまくてもがまんしています。"] },
    { k:"f2-24", es:"Si hubiera una habitación más grande por sesenta mil yenes o menos, me mudaría.", c:2, pat:"〜以上／〜以下",
      ok:["家賃が6万円以下のもっと広い部屋があれば、ひっこしたいです。","やちんが6まんえんいかのもっとひろいへやがあれば、ひっこしたいです。"] },
    { k:"f2-25", es:"Esta casa está bien, pero puede que sea incómoda para la compra diaria.", c:2, pat:"〜かもしれません",
      ok:["この家、いいですが、毎日の買い物に不便かもしれませんね。","このいえ、いいですが、まいにちのかいものにふべんかもしれませんね。"] },
    { k:"f2-26", es:"De tan ocupado, caí enfermo.", c:2, pat:"〜すぎて",
      ok:["忙しすぎて病気になってしまいました。","いそがしすぎてびょうきになってしまいました。"] },
    { k:"f2-27", es:"Caí enfermo.", c:2, pat:"〜てしまいました",
      ok:["病気になってしまいました。","びょうきになってしまいました。"] },
    { k:"f2-28", es:"Si hay internet, puedo trabajar aunque no vaya a Tokio.", c:2, pat:"〜ば、〜なくても",
      ok:["インターネットがあれば、東京に行かなくても仕事ができます。","インターネットがあれば、とうきょうにいかなくてもしごとができます。"] },
    { k:"f2-29", es:"Si el colegio de los niños está cerca, aunque sea incómodo para ir al trabajo me vale.", c:2, pat:"〜ば、〜なくても",
      ok:["子どもの学校がちかければ、通勤にふべんでもいいです。","こどものがっこうがちかければ、つうきんにふべんでもいいです。"] }
  ],

  huecos: [
    /* p35, ejercicio 2 */
    { k:"h2-01", pat:"はんたいのことば", pre:"木山さんの家の近くには、公園や学校があって、（", post:"）がいいです。", hint:"entorno, ambiente", ok:["かんきょう","環境"], c:1, es:"Cerca de la casa de Kiyama hay parques y escuelas, y el entorno es bueno." },
    { k:"h2-02", pat:"はんたいのことば", pre:"家は（", post:"）にあるので、としんまで時間がかかります。", hint:"las afueras", ok:["こうがい","郊外"], c:1, es:"Como la casa está en las afueras, se tarda en llegar al centro." },
    { k:"h2-03", pat:"はんたいのことば", pre:"このあたりは電車やバスなどが少なくて、（", post:"）が不便です。", hint:"el transporte", ok:["交通","こうつう"], c:1, es:"Por la zona hay pocos trenes y autobuses y el transporte es incómodo." },
    { k:"h2-04", pat:"はんたいのことば", pre:"木山さんは、毎日車で（", post:"）しています。", hint:"ir al trabajo → 名詞", ok:["通勤","つうきん"], c:1, es:"Kiyama va todos los días al trabajo en coche." },
    { k:"h2-05", pat:"はんたいのことば", pre:"これから新しい家をさがします。どんなところがいいか、（", post:"）を考えます。", hint:"condiciones, requisitos", ok:["じょうけん"], c:1, es:"Va a buscar casa nueva. Piensa qué condiciones quiere." },

    /* p35, ejercicio 3: los contrarios */
    { k:"h2-06", pat:"はんたいのことば", pre:"へやがせまい ⇔ へやが（", post:"）。", hint:"el contrario de せまい", ok:["広い","ひろい"], c:1, es:"La habitación es pequeña ⇔ la habitación es amplia." },
    { k:"h2-07", pat:"はんたいのことば", pre:"夜、危ない ⇔ 夜も（", post:"）。", hint:"el contrario de 危ない", ok:["安全","あんぜん"], c:1, es:"De noche es peligroso ⇔ de noche también es seguro." },
    { k:"h2-08", pat:"はんたいのことば", pre:"まわりがうるさい ⇔ まわりが（", post:"）。", hint:"el contrario de うるさい", ok:["静か","しずか"], c:1, es:"Alrededor hay ruido ⇔ alrededor hay tranquilidad." },
    { k:"h2-09", pat:"はんたいのことば", pre:"買い物に不便 ⇔ 買い物に（", post:"）。", hint:"el contrario de 不便", ok:["便利","べんり"], c:1, es:"Incómodo para las compras ⇔ cómodo para las compras." },
    { k:"h2-10", pat:"はんたいのことば", pre:"駅から遠い ⇔ 駅から（", post:"）。", hint:"el contrario de 遠い", ok:["近い","ちかい"], c:1, es:"Lejos de la estación ⇔ cerca de la estación." },

    /* p36, ejercicio 2: como termina la frase */
    { k:"h2-11", pat:"〜けど。／〜なくて。", pre:"いいえ、まだなんです。いろいろ（", post:"）。", hint:"さがしています → 〜んですけど", ok:["さがしてるんですけど","さがしているんですけど","さがして（い）るんですけど"], c:1, es:"No, todavía no. Estoy mirando varias cosas, pero…" },
    { k:"h2-12", pat:"〜けど。／〜なくて。", pre:"ええ。でも、いいところが（", post:"）。", hint:"あまりありません → 〜なくて", ok:["あまりなくて"], c:1, es:"Sí. Pero es que no hay mucho bueno…" },
    { k:"h2-13", pat:"〜がいいんですが", pre:"駅に近くて、買い物に便利なところが（", post:"）。", hint:"me gustaría… (abierto)", ok:["いいんですが"], c:1, es:"Algo cerca de la estación y cómodo para las compras estaría bien…" },
    { k:"h2-14", pat:"もう〜ましたか", pre:"家はもう（", post:"）か。", hint:"見つかります → forma ました", ok:["見つかりました","みつかりました"], c:1, es:"¿Ya has encontrado casa?" },

    /* p38 y p39: から y けど */
    { k:"h2-15", pat:"〜から（りゆう）", pre:"庭が広くて（", post:"）から、子どもも喜んで（い）ます。", hint:"あそべます → forma simple", ok:["あそべる"], c:1, es:"Como el jardín es grande y se puede jugar, los niños están encantados." },
    { k:"h2-16", pat:"〜から（りゆう）", pre:"夜も（", post:"）から、そのマンションにしました。", hint:"安全です → forma simple (adjetivo な: だ)", ok:["安全だ","あんぜんだ"], c:1, es:"Como de noche también es seguro, elegí ese piso." },
    { k:"h2-17", pat:"〜から（りゆう）", pre:"かんきょうがよくて、会社も（", post:"）から、決めました。", hint:"近いです → forma simple", ok:["近い","ちかい"], c:1, es:"El entorno es bueno y la oficina está cerca, así que me decidí." },
    { k:"h2-18", pat:"〜けど、〜から", pre:"駅から（", post:"）けど、まわりが（", post2:"）から、そこに決めました。", hint:"遠い / 静かだ", ok:["遠い","とおい"], ok2:["静かだ","しずかだ"], c:1, es:"Está lejos de la estación, pero alrededor es tranquilo, así que me decidí por ahí." },
    { k:"h2-19", pat:"〜けど、〜から", pre:"かんきょうは（", post:"）けど、家が（", post2:"）から、ひっこしました。", hint:"いい / 古くなった", ok:["いい"], ok2:["古くなった","ふるくなった"], c:1, es:"El entorno era bueno, pero la casa se había hecho vieja, así que me mudé." },

    /* p41, 文2: 〜ても */
    { k:"h2-20", pat:"〜ても", pre:"シャワーしか使わないので、おふろが（", post:"）いいです。", hint:"ありません → 〜なくても", ok:["なくても"], c:2, es:"Solo uso la ducha, así que aunque no haya bañera me vale." },
    { k:"h2-21", pat:"〜ても", pre:"兄といっしょに住むから、やちんが少し（", post:"）だいじょうぶです。", hint:"高いです → 〜くても", ok:["高くても","たかくても"], c:2, es:"Como vivo con mi hermano, aunque el alquiler sea algo caro no pasa nada." },
    { k:"h2-22", pat:"〜ても", pre:"車があるから、交通が（", post:"）問題ありません。", hint:"不便です → 〜でも", ok:["不便でも","ふべんでも"], c:2, es:"Como tengo coche, aunque el transporte sea malo no hay problema." },
    { k:"h2-23", pat:"〜ても", pre:"昼は家にいないので、へやが（", post:"）いいです。", hint:"明るくないです → 〜なくても", ok:["明るくなくても","あかるくなくても"], c:2, es:"De día no estoy en casa, así que aunque la habitación no sea luminosa me vale." },

    /* p41, 文3 (1): 〜ば con adjetivos y ある */
    { k:"h2-24", pat:"〜ば／〜なければ", pre:"お客さんがたくさん来るので、（", post:"）、その家を借りたいです。", hint:"広いです → 〜ければ", ok:["ひろければ","広ければ"], c:2, es:"Como viene mucha gente, si es amplia quiero alquilar esa casa." },
    { k:"h2-25", pat:"〜ば／〜なければ", pre:"1人で住みますから、へやは1つ（", post:"）、だいじょうぶです。", hint:"あります → 〜ば", ok:["あれば"], c:2, es:"Como vivo solo, si hay una habitación es suficiente." },
    { k:"h2-26", pat:"〜ば／〜なければ", pre:"料理ができないから、近くにレストランが（", post:"）、こまります。", hint:"ありません → 〜なければ", ok:["なければ"], c:2, es:"Como no sé cocinar, si no hay un restaurante cerca es un problema." },
    { k:"h2-27", pat:"〜ば／〜なければ", pre:"きゅうりょうが安いので、やちんが（", post:"）、そのへやを借ります。", hint:"高くないです → 〜なければ", ok:["高くなければ","たかくなければ"], c:2, es:"Como mi sueldo es bajo, si el alquiler no es caro cojo esa habitación." },
    { k:"h2-28", pat:"〜ば／〜なければ", pre:"ざんぎょうが多いから、夜も（", post:"）、そのマンションにします。", hint:"安全です → adjetivo な: 〜なら", ok:["安全なら","あんぜんなら"], c:2, es:"Como hago muchas horas extra, si de noche también es seguro elijo ese piso." },

    /* p42, (2): 〜ば con verbos */
    { k:"h2-29", pat:"〜ば／〜なければ", pre:"でも、週末スーパーでたくさん（", post:"）、だいじょうぶですよ。", hint:"買います → 〜ば", ok:["かえば","買えば"], c:2, es:"Pero si el fin de semana compro mucho en el súper, no pasa nada." },
    { k:"h2-30", pat:"〜ば／〜なければ", pre:"だれかといっしょに（", post:"）、借りられますよ。", hint:"住みます → 〜ば", ok:["住めば","すめば"], c:2, es:"Si vivo con alguien, lo puedo alquilar." },
    { k:"h2-31", pat:"〜ば／〜なければ", pre:"でも、会社の近くで（", post:"）いいから、問題ありません。", hint:"食べます → 〜ば", ok:["食べれば","たべれば"], c:2, es:"Pero si como cerca de la oficina no hay problema." },
    { k:"h2-32", pat:"〜ば／〜なければ", pre:"でも、早く（", post:"）、だいじょうぶですよ。", hint:"帰ります → 〜ば", ok:["帰れば","かえれば"], c:2, es:"Pero si vuelvo temprano, no pasa nada." },

    /* p42, (4): ば y ても juntos */
    { k:"h2-33", pat:"〜ば、〜なくても", pre:"子どもの学校が（", post:"）、通勤に（", post2:"）いいです。", hint:"近いです → 〜ければ / 不便です → 〜でも", ok:["ちかければ","近ければ"], ok2:["ふべんでも","不便でも"], c:2, es:"Si el colegio de los niños está cerca, aunque sea incómodo para ir al trabajo me vale." },
    { k:"h2-34", pat:"〜ば、〜なくても", pre:"交通が（", post:"）、（", post2:"）だいじょうぶです。", hint:"便利です → 〜なら / 広くないです → 〜なくても", ok:["便利なら","べんりなら"], ok2:["広くなくても","ひろくなくても"], c:2, es:"Si el transporte es bueno, aunque no sea amplio no pasa nada." },
    { k:"h2-35", pat:"〜ば／〜なければ", pre:"母のために病院が（", post:"）こまります。", hint:"近くないです → 〜なければ", ok:["近くなければ","ちかくなければ"], c:2, es:"Por mi madre, si el hospital no está cerca es un problema." },
    { k:"h2-36", pat:"〜ば、〜なくても", pre:"おしゃれな（", post:"）、やちんが（", post2:"）借りたいです。", hint:"ところです → 〜なら / 高いです → 〜くても", ok:["ところなら"], ok2:["高くても","たかくても"], c:2, es:"Si es un sitio con estilo, aunque el alquiler sea caro quiero alquilarlo." },

    /* dialogos y el texto de くの */
    { k:"h2-37", pat:"〜たら", pre:"（", post:"）、みんなを招待しますから、ぜひあそびに来てください。", hint:"おちつきます → 〜たら", ok:["おちついたら"], c:1, es:"Cuando estemos instalados os invito a todos, así que venid sin falta." },
    { k:"h2-38", pat:"〜すぎて", pre:"仕事はおもしろかったのですが、（", post:"）病気になってしまいました。", hint:"忙しいです → 〜すぎて", ok:["忙しすぎて","いそがしすぎて"], c:2, es:"El trabajo era interesante, pero de tan ocupado caí enfermo." },
    { k:"h2-39", pat:"〜ば、〜なくても", pre:"インターネットが（", post:"）、東京に（", post2:"）仕事ができます。", hint:"あります → 〜ば / 行きません → 〜なくても", ok:["あれば"], ok2:["行かなくても","いかなくても"], c:2, es:"Si hay internet, puedo trabajar aunque no vaya a Tokio." },
    { k:"h2-40", pat:"〜かもしれません", pre:"この家、いいですが、毎日の買い物に（", post:"）ね。", hint:"不便です → 〜かもしれません", ok:["不便かもしれません","ふべんかもしれません"], c:2, es:"Esta casa está bien, pero puede que sea incómoda para la compra diaria." }
  ],

  armar: [
    { k:"a2-01", es:"¿Ya has encontrado casa?", c:1, chips:["家は","もう","見つかりました","か"] },
    { k:"a2-02", es:"No, todavía no. Estoy mirando varias cosas, pero…", c:1, chips:["いいえ、","まだなんです。","いろいろ","さがしてるんですけど"] },
    { k:"a2-03", es:"Preferiría un sitio cerca de la estación…", c:1, chips:["駅から","近い","ところが","いいんですが"] },
    { k:"a2-04", es:"Prefiero un sitio seguro. Es que tengo niños pequeños.", c:1, chips:["安全なところが","いいです。","小さい子どもが","いますから"] },
    { k:"a2-05", es:"Había una casa grande y buena, así que me decidí.", c:1, chips:["広くて","いい家が","あったから、","決めました"] },
    { k:"a2-06", es:"Está un poco lejos de la oficina, pero había una casa grande y buena, así que me decidí por esa.", c:1, chips:["会社まで少し遠いけど、","広くていい家が","あったから、","そこに決めました"] },
    { k:"a2-07", es:"Como el jardín es grande y se puede jugar, los niños están encantados.", c:1, chips:["庭が広くて","あそべるから、","子どもも","喜んでます"] },
    { k:"a2-08", es:"Cuando estemos instalados os invito a todos, así que venid sin falta.", c:1, chips:["おちついたら、","みんなを招待しますから、","ぜひ","あそびに来てください"] },
    { k:"a2-09", es:"Cerca hay un súper, y además el entorno es bueno.", c:1, chips:["近くに","スーパーもあるし、","かんきょうも","いいです"] },
    { k:"a2-10", es:"A mí y a mi familia nos gusta mucho la casa de ahora.", c:1, chips:["私も家族も、","今の家が","とても","気に入っています"] },
    { k:"a2-11", es:"Aunque es pequeño, me aguanto.", c:2, chips:["せまくても","がまん","して","います"] },
    { k:"a2-12", es:"Si hubiera una habitación más grande, me mudaría.", c:2, chips:["もっと広い","へやが","あれば、","ひっこしたいです"] },
    { k:"a2-13", es:"Como no sé cocinar, si no hay un restaurante cerca es un problema.", c:2, chips:["料理ができないから、","近くに","レストランがなければ、","こまります"] },
    { k:"a2-14", es:"Pero si el fin de semana compro mucho en el súper, no pasa nada.", c:2, chips:["でも、","週末スーパーで","たくさんかえば、","だいじょうぶですよ"] },
    { k:"a2-15", es:"Si hay internet, puedo trabajar aunque no vaya a Tokio.", c:2, chips:["インターネットが","あれば、","東京に行かなくても","仕事ができます"] },
    { k:"a2-16", es:"De tan ocupado, caí enfermo.", c:2, chips:["忙し","すぎて","病気に","なってしまいました"] },
    { k:"a2-17", es:"Aunque sea un poco incómodo, quiero vivir aquí para siempre.", c:2, chips:["少しぐらい","不便でも、","ずっとここに","住みたいと思っています"] },
    { k:"a2-18", es:"Esta casa está bien, pero puede que sea incómoda para la compra diaria.", c:2, chips:["この家、","いいですが、","毎日の買い物に","不便かもしれませんね"] }
  ]
});
