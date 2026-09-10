/* Dojo Marugoto - unidad 9, 仕事をさがす
   Marugoto A2/B1 Parte 2 - clase 1 = libro p106-111 - clase 2 = p112-115

   A diferencia de la unidad 8, esta no viene de un archivo congelado: se
   escribio leyendo las paginas del libro escaneado (`Marugoto A2B1.pdf`,
   herramientas/paginas.mjs) y cruzandolas con los indices oficiales.

   De donde sale cada cosa:
     vocabulario, verbos y kanji  del indice oficial del Tema 9, mas las
                                  palabras de temas anteriores que estas
                                  paginas usan sin parar (人間関係, 職場,
                                  給料, 情報, 通訳...). El validador las
                                  reporta como informe, no como problema.
     huecos                       son los ejercicios reales del libro:
                                  p107-3 (5), p110-2 (3), p113-2 (6),
                                  p114-3 (4), mas frases de los dialogos.
     frases                       ya no son ejercicio; quedan como los
                                  ejemplos que la ficha de cada patron y la
                                  seccion de materia muestran bajo "En el
                                  libro" (ver la nota en 60-ui.js).

   El corte entre clases es el del libro: la mitad de hablar (recepcion y
   contar donde trabajas, p106-111) y la de leer (los tres patrones de
   gramatica y los correos, p112-115). */

CONTENIDO.unidades.push({
  n: 9,
  titulo: "仕事をさがす",
  es: "Buscar trabajo",
  paginas: { 1: "106-111", 2: "112-115" },
  estado: "lista",

  /* Cuatro formas se estrenan aqui y hubo que agregarlas al conjugador:
     たら y たい en la clase 1 (p110), やすい en el dialogo de パク (p110) y
     ことができます en la clase 2 (p113). La potencial ya existia desde la
     unidad 8 y vuelve porque 文3 la necesita (話せる, 働ける, 選べる). */
  formas: {
    1: ["masu", "masen", "te", "ta", "nai", "tara", "tai", "yasui", "pot"],
    2: ["masu", "ta", "te", "nai", "tara", "tai", "koto", "pot", "tari"]
  },

  /* --- PATRONES DE LA UNIDAD ------------------------------------
     Los tres que el indice oficial marca como 初中級 del Tema 9 son
     〜たら〜たいと思っている, 〜ことができる y 〜より〜方が〜. Los demas
     salen de los dialogos y de los correos: aparecen en las frases y en los
     huecos, asi que tienen que existir aqui.

     Las lineas `uso` y `formula` las redacte yo y las revisa Patricio con el
     libro al lado, igual que en la unidad 8.
  --------------------------------------------------------------- */
  patrones: [
    { pat:"〜たら、〜たいと思っています", tipo:"gramatica",
      oficial:"～たら、～たいと思って（い）る",
      lectura:"〜たら、〜たいとおもっています · tara, ~tai to omotte imasu",
      es:"cuando… quiero…",
      formula:"forma た + ら、… + raíz de ます, sin el ます + たいと思っています",
      uso:"El plan a futuro completo: primero que pase esto, y entonces quiero aquello. と思っています ablanda el deseo, que en japonés no se suelta a secas.",
      ejemplo:"留学が終わったら、日本の会社で働きたいと思っています。" },

    { pat:"〜たら", tipo:"gramatica",
      lectura:"tara",
      es:"cuando… / si…",
      formula:"forma た + ら. Se saca de la forma た, no de la ます",
      uso:"Pone la condición o el momento: cuando eso haya ocurrido. Sirve tanto para lo seguro («cuando termine») como para lo hipotético («si hubiera»).",
      ejemplo:"あと2、3年したら、海外の支社に行きたいと思ってるんです。" },

    { pat:"〜ことができます", tipo:"gramatica",
      oficial:"～ことができる",
      lectura:"〜ことができます · koto ga dekimasu",
      es:"poder…, ser capaz de…",
      formula:"forma diccionario + ことができます",
      uso:"Decir que uno es capaz de algo. Significa lo mismo que la forma potencial, pero suena más formal y el verbo no cambia: es la que se usa en una entrevista.",
      ejemplo:"ヨーロッパの情報を集めることができます。" },

    { pat:"〜より〜方が〜", tipo:"gramatica",
      lectura:"〜より〜ほうが · yori ~ hō ga",
      es:"más que…, … es más…",
      formula:"V1 forma diccionario + より + V2 forma diccionario + 方が + adjetivo. 方 se lee ほう",
      uso:"Compara dos cosas y dice cuál gana. Lo que se descarta lleva より; lo que gana lleva 方が. El orden es al revés que en español.",
      ejemplo:"外国語が話せるよりほかの人と協力して働ける方がだいじです。" },

    { pat:"〜たことがあります", tipo:"gramatica",
      lectura:"〜たことがあります · ta koto ga arimasu",
      es:"he llegado a…, alguna vez…",
      formula:"forma た + ことがあります",
      uso:"Una experiencia vivida alguna vez, sin decir cuándo. No vale para lo que pasó ayer: eso es pasado normal.",
      ejemplo:"アルバイトで観光客の通訳をしたこともあります。" },

    { pat:"〜やすいです", tipo:"gramatica",
      lectura:"〜やすいです · yasui",
      es:"es fácil de…, se … a gusto",
      formula:"raíz de ます, sin el ます + やすいです",
      uso:"Dice que algo se hace sin esfuerzo. Se comporta como un adjetivo い: 働きやすい, 働きやすかった, 働きやすくない.",
      ejemplo:"人間関係がよくて、上司が信頼できる人なんです。だから、働きやすいですよ。" },

    { pat:"〜んです", tipo:"gramatica",
      lectura:"〜んです · n desu",
      es:"es que…",
      formula:"forma simple + んです. El sustantivo y el adjetivo な llevan な delante: 〜なんです",
      uso:"Explica o da el porqué de lo que se acaba de decir. Sin él la frase suena a informe; con él, a conversación.",
      ejemplo:"世界中に支社があるんですよ。" },

    { pat:"〜てもう〜になります", tipo:"gramatica",
      lectura:"〜てもう〜になります · te mō ~ ni narimasu",
      es:"llevo ya… (tanto tiempo)",
      formula:"forma て + もう + cantidad de tiempo + になります",
      uso:"Cuánto tiempo se lleva haciendo algo. Literalmente: «desde que empecé, ya se hace tanto».",
      ejemplo:"勤めてもう3年になります。" },

    { pat:"〜と思います", tipo:"gramatica",
      lectura:"〜とおもいます · to omoimasu",
      es:"creo que…",
      formula:"forma simple + と思います. Nunca en ます antes de と",
      uso:"La opinión propia. Lo que va antes de と siempre va en forma simple, aunque el resto de la frase sea cortés.",
      ejemplo:"通訳や翻訳をすることができると思います。" },

    { pat:"〜ないで", tipo:"gramatica",
      lectura:"〜ないで · naide",
      es:"sin…",
      formula:"forma ない + で",
      uso:"Hacer una cosa sin hacer la otra: sin rendirse, sin dormir. No confundir con 〜なくて, que da una causa.",
      ejemplo:"難しい仕事でも、最後まであきらめないでがんばることができます。" },

    { pat:"〜がもとめられています", tipo:"gramatica",
      lectura:"〜がもとめられています · ga motomerarete imasu",
      es:"se busca…, se pide…",
      formula:"sustantivo + が + もとめられています. Es la pasiva de もとめる (もとめます → もとめられます)",
      uso:"Lo que la empresa busca, dicho sin nombrar a quién lo busca. En japonés la pasiva es la manera normal de hablar en general.",
      ejemplo:"上司にきちんと報告ができる人、同僚と助け合うことができる人がもとめられています。" },

    { pat:"〜だけじゃだめです", tipo:"gramatica",
      lectura:"〜だけじゃだめです · dake ja dame desu",
      es:"con solo… no basta",
      formula:"sustantivo o forma diccionario + だけじゃだめです",
      uso:"Algo hace falta, pero no alcanza. だけ es «solo»; じゃだめ, «no vale». En registro formal: だけではだめです.",
      ejemplo:"日本語や外国語ができるだけじゃだめですよ。" },

    { pat:"名詞＋します", tipo:"gramatica",
      lectura:"めいし＋します · meishi + shimasu",
      es:"sustantivo que se vuelve verbo",
      formula:"sustantivo de acción + します. La partícula を puede ir en medio: 輸入をたんとうする",
      uso:"Media docena de palabras clave de esta unidad son sustantivos que se hacen verbo con します: 報告, 連絡, 相談, 募集, 担当, 協力, 質問, 輸出, 輸入.",
      ejemplo:"私は会社で食品の輸入をたんとうしています。" },

    { pat:"〜をとおして", tipo:"gramatica",
      lectura:"〜をとおして · o tōshite",
      es:"a través de…, por medio de…",
      formula:"sustantivo, o forma diccionario + こと, + をとおして",
      uso:"Por medio de una cosa se llega a otra: a través del trabajo, entender a la gente.",
      ejemplo:"働くことをとおして、人や文化についてもっとよくわかるようになると思います。" },

    { pat:"〜ようになります", tipo:"gramatica",
      lectura:"〜ようになります · yō ni narimasu",
      es:"llegar a…, pasar a…",
      formula:"forma diccionario o potencial + ようになります",
      uso:"Un cambio que ocurre con el tiempo: antes no, ahora sí. No es una decisión, es una evolución.",
      ejemplo:"人や文化についてもっとよくわかるようになると思います。" },

    { pat:"ともうします", tipo:"expresion",
      lectura:"ともうします · to mōshimasu",
      es:"me llamo… (humilde)",
      formula:"nombre + ともうします. もうします es el humilde de 言います",
      uso:"Presentarse ante alguien de fuera de tu empresa. Rebaja al que habla; nunca se usa para el otro.",
      ejemplo:"すみません。エドワードともうします。" },

    { pat:"お〜したいんですが", tipo:"expresion",
      lectura:"お〜したいんですが · o ~ shitai n desu ga",
      es:"quisiera…",
      formula:"お + raíz de ます + したいんですが",
      uso:"Pedir algo con humildad y dejar la frase abierta: el が del final ablanda y espera la respuesta del otro.",
      ejemplo:"総務課の村田さん、お願いしたいんですが。" },

    { pat:"いらっしゃいますか", tipo:"expresion",
      lectura:"いらっしゃいますか · irasshaimasu ka",
      es:"¿se encuentra…?",
      formula:"persona + 、+ いらっしゃいますか. いらっしゃる es el honorífico de いる",
      uso:"Preguntar por alguien con respeto en una recepción. Jamás para uno mismo ni para un compañero de tu propia empresa.",
      ejemplo:"村田さん、いらっしゃいますか。" },

    { pat:"少々お待ちください", tipo:"expresion",
      lectura:"しょうしょうおまちください · shōshō omachi kudasai",
      es:"espere un momento, por favor",
      formula:"少々 + お + raíz de ます + ください",
      uso:"La fórmula de recepción para pedir que esperen. 少々 es «un poco» en registro formal; en la calle sería ちょっと.",
      ejemplo:"村田は、ただいままいります。少々お待ちください。" },

    { pat:"ただいま〜します", tipo:"expresion",
      lectura:"ただいま · tadaima",
      es:"ahora mismo…",
      formula:"ただいま + verbo humilde en ます: およびします, まいります",
      uso:"Aquí ただいま es «ahora mismo», no el «ya llegué» de la casa. Es lo que dice quien atiende: voy a por él en este momento.",
      ejemplo:"ただいまおよびします。" },

    { pat:"もうしわけございません", tipo:"expresion",
      lectura:"もうしわけございません · mōshiwake gozaimasen",
      es:"lo lamento mucho",
      formula:"fija. Un escalón menos formal: もうしわけありません",
      uso:"La disculpa del trabajo, bastante más pesada que すみません. Se dice antes de dar una mala noticia.",
      ejemplo:"もうしわけございません。村田は、ただいま電話中です。" },

    { pat:"〜中です", tipo:"expresion",
      lectura:"〜ちゅうです · chū desu",
      es:"está en medio de…",
      formula:"sustantivo + 中です. El 中 se lee ちゅう, no なか",
      uso:"Alguien está ocupado en algo justo ahora: 電話中, 会議中, 就活中.",
      ejemplo:"村田は、ただいま会議中です。こちらでお待ちください。" }
  ],

  /* --- VERBOS ---------------------------------------------------
     Los 22 del indice del Tema 9, mas los de temas anteriores que estas
     paginas usan a cada linea (働く, 勤める, 作る, 集める...). Se dejan
     fuera los que ya estan en la unidad 8 (する, くる, ねる) para no
     repetir la misma tarjeta dos veces si se estudian las dos unidades.
  --------------------------------------------------------------- */
  verbos: [
    /* grupo 1 */
    { kana:"はたらく", kanji:"働く", g:1, es:"trabajar", c:1 },
    { kana:"おわる", kanji:"終わる", g:1, es:"terminar (algo termina)", c:1 },
    { kana:"つくる", kanji:"作る", g:1, es:"fabricar, hacer", c:1 },
    { kana:"はなしあう", kanji:"話し合う", g:1, es:"hablar entre varios, deliberar", c:1 },
    { kana:"とりつぐ", kanji:"とりつぐ", g:1, es:"pasar la llamada o la visita", c:1 },
    { kana:"まいる", kanji:"まいる", g:1, es:"ir, venir (humilde)", c:1, nota:"Humilde de 行く y 来る: solo para uno mismo" },
    { kana:"いらっしゃる", kanji:"いらっしゃる", g:1, es:"estar, ir, venir (honorífico)", c:1, nota:"Honorífico: la forma ます es いらっしゃいます, no いらっしゃります" },
    { kana:"ひく", kanji:"ひく", g:1, es:"coger (un resfriado)", c:1 },
    { kana:"なる", kanji:"なる", g:1, es:"llegar a ser, convertirse en", c:1 },
    { kana:"きく", kanji:"聞く", g:1, es:"escuchar, preguntar", c:1 },
    { kana:"あう", kanji:"会う", g:1, es:"encontrarse con, ver a alguien", c:2 },
    { kana:"はなす", kanji:"話す", g:1, es:"hablar", c:2 },
    { kana:"かく", kanji:"書く", g:1, es:"escribir", c:2 },
    { kana:"うる", kanji:"売る", g:1, es:"vender", c:2 },
    { kana:"えらぶ", kanji:"選ぶ", g:1, es:"elegir", c:2 },
    { kana:"たすけあう", kanji:"助け合う", g:1, es:"ayudarse mutuamente", c:2 },
    { kana:"あらわす", kanji:"あらわす", g:1, es:"expresar, mostrar", c:2 },
    { kana:"たのしむ", kanji:"楽しむ", g:1, es:"disfrutar", c:2 },
    { kana:"がんばる", kanji:"がんばる", g:1, es:"esforzarse, aguantar", c:2 },
    { kana:"とおす", kanji:"通す", g:1, es:"hacer pasar", c:2, nota:"Casi siempre en 〜をとおして" },

    /* grupo 2 */
    { kana:"つとめる", kanji:"勤める", g:2, es:"estar empleado en", c:1, nota:"Grupo 2, aunque termine en 〜める" },
    { kana:"おしえる", kanji:"教える", g:2, es:"enseñar, avisar", c:1 },
    { kana:"あつめる", kanji:"集める", g:2, es:"reunir, juntar", c:2 },
    { kana:"くらべる", kanji:"くらべる", g:2, es:"comparar", c:2 },
    { kana:"もとめる", kanji:"もとめる", g:2, es:"pedir, buscar (en una empresa)", c:2 },
    { kana:"みつける", kanji:"見つける", g:2, es:"encontrar", c:2 },
    { kana:"できる", kanji:"できる", g:2, es:"poder, saber hacer", c:2 },
    { kana:"あきらめる", kanji:"あきらめる", g:2, es:"rendirse, desistir", c:2 },
    { kana:"かんじる", kanji:"感じる", g:2, es:"sentir, percibir", c:2 },
    { kana:"しらべる", kanji:"しらべる", g:2, es:"averiguar, investigar", c:2 },

    /* grupo 3: los sustantivos que se vuelven verbo con する */
    { kana:"ほうこくする", kanji:"報告する", g:3, es:"informar, dar parte", c:1 },
    { kana:"れんらくする", kanji:"連絡する", g:3, es:"avisar, ponerse en contacto", c:1 },
    { kana:"そうだんする", kanji:"相談する", g:3, es:"consultar, pedir consejo", c:1 },
    { kana:"たんとうする", kanji:"担当する", g:3, es:"encargarse de", c:1 },
    { kana:"しんらいする", kanji:"信頼する", g:3, es:"confiar en", c:1 },
    { kana:"ゆしゅつする", kanji:"輸出する", g:3, es:"exportar", c:1 },
    { kana:"ゆにゅうする", kanji:"輸入する", g:3, es:"importar", c:1 },
    { kana:"そつぎょうする", kanji:"卒業する", g:3, es:"graduarse", c:1 },
    { kana:"きょうりょくする", kanji:"協力する", g:3, es:"colaborar, cooperar", c:2 },
    { kana:"しつもんする", kanji:"質問する", g:3, es:"preguntar", c:2 },
    { kana:"ぼしゅうする", kanji:"募集する", g:3, es:"convocar, buscar personal", c:2 },
    { kana:"ほんやくする", kanji:"翻訳する", g:3, es:"traducir", c:2 }
  ],

  /* --- VOCABULARIO ---------------------------------------------- */
  vocab: [
    /* tipos de empresa y departamentos (p106, p109) */
    { jp:"機械", kana:"きかい", es:"máquina, aparato", c:1, cat:"empresa" },
    { jp:"金融", kana:"きんゆう", es:"finanzas", c:1, cat:"empresa" },
    { jp:"建設", kana:"けんせつ", es:"construcción", c:1, cat:"empresa" },
    { jp:"食品", kana:"しょくひん", es:"alimentación", c:1, cat:"empresa" },
    { jp:"物流", kana:"ぶつりゅう", es:"logística, distribución", c:1, cat:"empresa" },
    { jp:"〜会社", kana:"〜がいしゃ", es:"empresa de…", c:1, cat:"empresa" },
    { jp:"支社", kana:"ししゃ", es:"sucursal", c:1, cat:"empresa" },
    { jp:"営業", kana:"えいぎょう", es:"ventas, comercial", c:1, cat:"empresa" },
    { jp:"企画", kana:"きかく", es:"planificación, proyectos", c:1, cat:"empresa" },
    { jp:"経理", kana:"けいり", es:"contabilidad", c:1, cat:"empresa" },
    { jp:"広報", kana:"こうほう", es:"comunicación, prensa", c:1, cat:"empresa" },
    { jp:"総務", kana:"そうむ", es:"administración general", c:1, cat:"empresa" },
    { jp:"総務課", kana:"そうむか", es:"sección de administración general", c:1, cat:"empresa" },
    { jp:"海外事業", kana:"かいがいじぎょう", es:"negocio internacional", c:1, cat:"empresa" },
    { jp:"〜部", kana:"〜ぶ", es:"departamento", c:1, cat:"empresa" },
    { jp:"〜課", kana:"〜か", es:"sección", c:1, cat:"empresa" },
    { jp:"世界", kana:"せかい", es:"mundo", c:1, cat:"empresa" },

    /* el trabajo y el sitio donde se trabaja (p107, p110) */
    { jp:"仕事", kana:"しごと", es:"trabajo", c:1, cat:"trabajo" },
    { jp:"職場", kana:"しょくば", es:"lugar de trabajo", c:1, cat:"trabajo" },
    { jp:"会議", kana:"かいぎ", es:"reunión", c:1, cat:"trabajo" },
    { jp:"休み", kana:"やすみ", es:"descanso, días libres", c:1, cat:"trabajo" },
    { jp:"給料", kana:"きゅうりょう", es:"sueldo", c:1, cat:"trabajo" },
    { jp:"ざんぎょう", kana:"ざんぎょう", es:"horas extra", c:1, cat:"trabajo" },
    { jp:"体力", kana:"たいりょく", es:"fuerza física, aguante", c:1, cat:"trabajo" },
    /* el recuadro 漢字のことば de p107, que el libro ensena como palabras */
    { jp:"協力", kana:"きょうりょく", es:"colaboración", c:1, cat:"trabajo" },
    { jp:"担当", kana:"たんとう", es:"cargo, cometido del que uno se ocupa", c:1, cat:"trabajo" },
    { jp:"報告", kana:"ほうこく", es:"informe, parte", c:1, cat:"trabajo" },
    { jp:"連絡", kana:"れんらく", es:"aviso, contacto", c:1, cat:"trabajo" },
    { jp:"輸出", kana:"ゆしゅつ", es:"exportación", c:1, cat:"trabajo" },
    { jp:"輸入", kana:"ゆにゅう", es:"importación", c:1, cat:"trabajo" },
    { jp:"働き方", kana:"はたらきかた", es:"manera de trabajar", c:2, cat:"trabajo" },
    { jp:"就活", kana:"しゅうかつ", es:"búsqueda de trabajo", c:2, cat:"trabajo" },
    { jp:"就職", kana:"しゅうしょく", es:"colocación, conseguir empleo", c:2, cat:"trabajo" },
    { jp:"就職活動", kana:"しゅうしょくかつどう", es:"proceso de búsqueda de empleo", c:2, cat:"trabajo" },
    { jp:"活動", kana:"かつどう", es:"actividad", c:2, cat:"trabajo" },
    { jp:"募集", kana:"ぼしゅう", es:"convocatoria, oferta de empleo", c:2, cat:"trabajo" },
    { jp:"つごう", kana:"つごう", es:"disponibilidad, lo que a uno le viene bien", c:2, cat:"trabajo" },
    { jp:"しりょう", kana:"しりょう", es:"documento, material", c:2, cat:"objetos" },
    { jp:"パートタイム", kana:"パートタイム", es:"jornada parcial", c:2, cat:"trabajo" },
    { jp:"フリーランス", kana:"フリーランス", es:"autónomo, freelance", c:2, cat:"trabajo" },
    { jp:"アルバイト", kana:"アルバイト", es:"trabajo temporal", c:2, cat:"trabajo" },
    { jp:"ラグビー部", kana:"ラグビーぶ", es:"club de rugby", c:2, cat:"trabajo" },

    /* la gente (p107, p110, p112) */
    { jp:"社員", kana:"しゃいん", es:"empleado", c:1, cat:"persona" },
    { jp:"上司", kana:"じょうし", es:"jefe, superior", c:1, cat:"persona" },
    { jp:"ひしょ", kana:"ひしょ", es:"secretario, secretaria", c:1, cat:"persona" },
    { jp:"同僚", kana:"どうりょう", es:"compañero de trabajo", c:2, cat:"persona" },
    { jp:"観光客", kana:"かんこうきゃく", es:"turista", c:2, cat:"persona" },
    { jp:"通訳", kana:"つうやく", es:"intérprete", c:2, cat:"persona" },
    { jp:"キャプテン", kana:"キャプテン", es:"capitán", c:2, cat:"persona" },
    { jp:"スタッフ", kana:"スタッフ", es:"personal, plantilla", c:2, cat:"persona" },

    /* como es el ambiente y como es uno (p107, p109, p112) */
    { jp:"人間関係", kana:"にんげんかんけい", es:"relaciones personales", c:1, cat:"abstracto" },
    { jp:"ふんいき", kana:"ふんいき", es:"ambiente", c:1, cat:"abstracto" },
    { jp:"こうどう", kana:"こうどう", es:"conducta, manera de actuar", c:1, cat:"abstracto" },
    { jp:"服そう", kana:"ふくそう", es:"vestimenta", c:1, cat:"objetos" },
    { jp:"ていねい", kana:"ていねい", es:"cortés, cuidado", c:1, cat:"abstracto" },
    { jp:"とくい", kana:"とくい", es:"lo que a uno se le da bien", c:2, cat:"abstracto" },
    { jp:"たしか", kana:"たしか", es:"seguro, cierto", c:2, cat:"abstracto" },
    { jp:"チームワーク", kana:"チームワーク", es:"trabajo en equipo", c:2, cat:"abstracto" },
    { jp:"情報", kana:"じょうほう", es:"información", c:2, cat:"abstracto" },
    { jp:"翻訳", kana:"ほんやく", es:"traducción", c:2, cat:"abstracto" },
    { jp:"かぜ", kana:"かぜ", es:"resfriado", c:1, cat:"problema" },

    /* adverbios y muletillas (p109, p110, p112, p115) */
    { jp:"おもに", kana:"おもに", es:"principalmente", c:1, cat:"conector" },
    { jp:"はじめに", kana:"はじめに", es:"para empezar", c:1, cat:"conector" },
    { jp:"少々", kana:"しょうしょう", es:"un momento, un poco (formal)", c:1, cat:"conector" },
    { jp:"ただいま", kana:"ただいま", es:"ahora mismo", c:1, cat:"tiempo" },
    { jp:"今まで", kana:"いままで", es:"hasta ahora", c:2, cat:"tiempo" },
    { jp:"きちんと", kana:"きちんと", es:"como es debido", c:2, cat:"conector" },
    { jp:"おやくそく", kana:"おやくそく", es:"cita concertada (formal)", c:1, cat:"trabajo" },
    { jp:"いらっしゃいませ", kana:"いらっしゃいませ", es:"bienvenido", c:1, cat:"reaccion" },
    { jp:"いえいえ", kana:"いえいえ", es:"no, para nada", c:1, cat:"reaccion" },
    { jp:"どうも", kana:"どうも", es:"gracias / disculpe", c:1, cat:"reaccion" },
    { jp:"よろしく", kana:"よろしく", es:"encantado, quedo a su disposición", c:1, cat:"reaccion" }
  ],

  /* --- FRASES DEL LIBRO -----------------------------------------
     Ya no son un ejercicio. Son los ejemplos que la ficha de cada patron
     muestra bajo "En el libro", asi que todas salen del libro tal cual.
     `ok` conserva la forma del archivo: la primera es la que se muestra.
  --------------------------------------------------------------- */
  frases: [
    { k:"f9-01", es:"Cuando termine el intercambio, quiero trabajar en una empresa japonesa.", c:1, pat:"〜たら、〜たいと思っています",
      ok:["留学が終わったら、日本の会社で働きたいと思っています。","りゅうがくがおわったら、にほんのかいしゃではたらきたいとおもっています。"] },
    { k:"f9-02", es:"Cuando me gradúe, quiero ser intérprete.", c:1, pat:"〜たら、〜たいと思っています",
      ok:["大学を卒業したら、つうやくになりたいと思っています。","だいがくをそつぎょうしたら、つうやくになりたいとおもっています。"] },
    { k:"f9-03", es:"Después de unos cinco años en una empresa, quiero montar la mía.", c:1, pat:"〜たら、〜たいと思っています",
      ok:["5年ぐらい会社で働いたら、自分で会社を作りたいと思っています。","5ねんぐらいかいしゃではたらいたら、じぶんでかいしゃをつくりたいとおもっています。"] },
    { k:"f9-04", es:"Dentro de dos o tres años quiero irme a una sucursal en el extranjero.", c:1, pat:"〜たら",
      ok:["あと2、3年したら、海外の支社に行きたいと思ってるんです。","あと2、3ねんしたら、かいがいのししゃにいきたいとおもってるんです。"] },
    { k:"f9-05", es:"Si en tu empresa convocan plazas para personal extranjero, avísame.", c:2, pat:"〜たら",
      ok:["木山さんの会社で外国人スタッフの募集があったら教えてください。","きやまさんのかいしゃでがいこくじんスタッフのぼしゅうがあったらおしえてください。"] },
    { k:"f9-06", es:"Nuestra empresa fabrica máquinas de todo tipo y las exporta.", c:1, pat:"〜んです",
      ok:["うちの会社は、いろいろな機械をつくって輸出してます。","うちのかいしゃは、いろいろなきかいをつくってゆしゅつしてます。"] },
    { k:"f9-07", es:"Es que tenemos sucursales por todo el mundo.", c:1, pat:"〜んです",
      ok:["世界中に支社があるんですよ。","せかいじゅうにししゃがあるんですよ。"] },
    { k:"f9-08", es:"Llevo ya tres años trabajando aquí.", c:1, pat:"〜てもう〜になります",
      ok:["勤めてもう3年になります。","つとめてもう3ねんになります。"] },
    { k:"f9-09", es:"Me encargo sobre todo del contacto con las sucursales de Asia.", c:1, pat:"名詞＋します",
      ok:["ぼくは、おもにアジアの支社との連絡を担当してます。","ぼくは、おもにアジアのししゃとのれんらくをたんとうしてます。"] },
    { k:"f9-10", es:"Las relaciones son buenas y el jefe es de fiar. Por eso se trabaja a gusto.", c:1, pat:"〜やすいです",
      ok:["人間関係がよくて、上司が信頼できる人なんです。だから、働きやすいですよ。","にんげんかんけいがよくて、じょうしがしんらいできるひとなんです。だから、はたらきやすいですよ。"] },
    { k:"f9-11", es:"Al terminar la reunión informé al jefe de lo que habíamos hablado.", c:1, pat:"名詞＋します",
      ok:["会議が終わって、話し合ったことをじょうしにほうこくしました。","かいぎがおわって、はなしあったことをじょうしにほうこくしました。"] },
    { k:"f9-12", es:"Avisé a la empresa: «me he resfriado, hoy no voy».", c:1, pat:"名詞＋します",
      ok:["「かぜをひいたので、今日は休みます」と、会社にれんらくしました。","「かぜをひいたので、きょうはやすみます」と、かいしゃにれんらくしました。"] },
    { k:"f9-13", es:"Me encargo de la importación de alimentos en mi empresa.", c:1, pat:"名詞＋します",
      ok:["私は会社で食品の輸入をたんとうしています。","わたしはかいしゃでしょくひんのゆにゅうをたんとうしています。"] },
    { k:"f9-14", es:"Disculpe, me llamo Edward.", c:1, pat:"ともうします",
      ok:["すみません。エドワードともうします。","すみません、エドワードともうします。"] },
    { k:"f9-15", es:"Quisiera ver al señor Murata, de la sección de administración general.", c:1, pat:"お〜したいんですが",
      ok:["総務課の村田さん、お願いしたいんですが。","そうむかのむらたさん、おねがいしたいんですが。"] },
    { k:"f9-16", es:"¿Se encuentra el señor Murata?", c:1, pat:"いらっしゃいますか",
      ok:["村田さん、いらっしゃいますか。","むらたさん、いらっしゃいますか。"] },
    { k:"f9-17", es:"Murata viene ahora mismo. Espere un momento, por favor.", c:1, pat:"少々お待ちください",
      ok:["村田は、ただいままいります。少々お待ちください。","むらたは、ただいままいります。しょうしょうおまちください。"] },
    { k:"f9-18", es:"Ahora mismo lo llamo.", c:1, pat:"ただいま〜します",
      ok:["ただいまおよびします。"] },
    { k:"f9-19", es:"Lo lamento mucho. Murata está ahora mismo al teléfono.", c:1, pat:"もうしわけございません",
      ok:["もうしわけございません。村田は、ただいま電話中です。","もうしわけございません。むらたは、ただいまでんわちゅうです。"] },
    { k:"f9-20", es:"Murata está ahora mismo reunido. Espere aquí, por favor.", c:1, pat:"〜中です",
      ok:["村田は、ただいま会議中です。こちらでお待ちください。","むらたは、ただいまかいぎちゅうです。こちらでおまちください。"] },
    { k:"f9-21", es:"Puedo reunir información sobre Europa.", c:2, pat:"〜ことができます",
      ok:["ヨーロッパの情報を集めることができます。","ヨーロッパのじょうほうをあつめることができます。","ヨーロッパの情報を集めることもできます。"] },
    { k:"f9-22", es:"Creo que puedo hacer de intérprete y traducir.", c:2, pat:"〜と思います",
      ok:["通訳や翻訳をすることができると思います。","つうやくやほんやくをすることができるとおもいます。"] },
    { k:"f9-23", es:"Puedo trabajar colaborando con gente de todo tipo.", c:2, pat:"〜ことができます",
      ok:["いろいろな人と協力して仕事をすることができます。","いろいろなひとときょうりょくしてしごとをすることができます。"] },
    { k:"f9-24", es:"Aunque el trabajo sea difícil, puedo aguantar hasta el final sin rendirme.", c:2, pat:"〜ないで",
      ok:["難しい仕事でも、最後まであきらめないでがんばることができます。","むずかしいしごとでも、さいごまであきらめないでがんばることができます。"] },
    { k:"f9-25", es:"Como tengo aguante, puedo trabajar varios días sin dormir.", c:2, pat:"〜ないで",
      ok:["体力に自信があるので、何日も寝ないで働くことができます。","たいりょくにじしんがあるので、なんにちもねないではたらくことができます。"] },
    { k:"f9-26", es:"También he hecho de intérprete para turistas en un trabajo temporal.", c:2, pat:"〜たことがあります",
      ok:["アルバイトで観光客の通訳をしたこともあります。","アルバイトでかんこうきゃくのつうやくをしたこともあります。"] },
    { k:"f9-27", es:"Más que hablar idiomas, lo importante es poder trabajar con los demás.", c:2, pat:"〜より〜方が〜",
      ok:["外国語が話せるよりほかの人と協力して働ける方がだいじです。","がいこくごがはなせるよりほかのひとときょうりょくしてはたらけるほうがだいじです。"] },
    { k:"f9-28", es:"Se me da mejor escribir un informe que hablar delante de la gente.", c:2, pat:"〜より〜方が〜",
      ok:["人の前で話すよりレポートを書く方がとくいです。","ひとのまえではなすよりレポートをかくほうがとくいです。"] },
    { k:"f9-29", es:"Prefiero trabajar en casa a trabajar en una oficina.", c:2, pat:"〜より〜方が〜",
      ok:["私は、会社で働くより家で仕事をする方がいいです。","わたしは、かいしゃではたらくよりいえでしごとをするほうがいいです。"] },
    { k:"f9-30", es:"Con solo saber japonés u otros idiomas no basta.", c:2, pat:"〜だけじゃだめです",
      ok:["日本語や外国語ができるだけじゃだめですよ。","にほんごやがいこくごができるだけじゃだめですよ。"] },
    { k:"f9-31", es:"Se busca gente capaz de informar bien al jefe y de ayudarse con los compañeros.", c:2, pat:"〜がもとめられています",
      ok:["上司にきちんと報告ができる人、同僚と助け合うことができる人がもとめられています。","じょうしにきちんとほうこくができるひと、どうりょうとたすけあうことができるひとがもとめられています。"] },
    { k:"f9-32", es:"Creo que trabajando llegaré a entender mucho mejor a la gente y su cultura.", c:2, pat:"〜をとおして",
      ok:["働くことをとおして、人や文化についてもっとよくわかるようになると思います。","はたらくことをとおして、ひとやぶんかについてもっとよくわかるようになるとおもいます。"] },
    { k:"f9-33", es:"Llegaré a entender mucho mejor a la gente y su cultura.", c:2, pat:"〜ようになります",
      ok:["人や文化についてもっとよくわかるようになると思います。","ひとやぶんかについてもっとよくわかるようになるとおもいます。"] }
  ],

  /* --- FRASES CON HUECO ----------------------------------------
     h9-01 a h9-05  p107, ejercicio 3   (los sustantivos con します)
     h9-06 a h9-08  p110, ejercicio 2   (〜たら、〜たいと思っています)
     h9-09 a h9-16  dialogos de p109 y p110
     h9-17 a h9-22  p113, ejercicio 2   (〜ことができます)
     h9-23 a h9-27  p114, ejercicio 3   (〜より〜方が〜)
     h9-28 a h9-34  correos de p112 y p115
  --------------------------------------------------------------- */
  huecos: [
    { k:"h9-01", pat:"名詞＋します", pre:"会議が終わって、話し合ったことをじょうしに（", post:"）しました。", hint:"informar, dar parte → 名詞", ok:["ほうこく","報告"], c:1, es:"Al terminar la reunión informé al jefe de lo que habíamos hablado." },
    { k:"h9-02", pat:"名詞＋します", pre:"「かぜをひいたので、今日は休みます」と、会社に（", post:"）しました。", hint:"avisar, contactar → 名詞", ok:["れんらく","連絡"], c:1, es:"Avisé a la empresa: «me he resfriado, hoy no voy»." },
    { k:"h9-03", pat:"名詞＋します", pre:"いつつぎの会議をするか、じょうしに（", post:"）して決めます。", hint:"consultar → 名詞", ok:["そうだん","相談"], c:1, es:"Lo decido consultando al jefe cuándo será la próxima reunión." },
    { k:"h9-04", pat:"名詞＋します", pre:"うちの会社は今、ひしょを（", post:"）しています。", hint:"convocar plazas → 名詞", ok:["ぼしゅう","募集"], c:1, es:"Mi empresa está buscando secretario ahora mismo." },
    { k:"h9-05", pat:"名詞＋します", pre:"私は会社で食品の輸入を（", post:"）しています。", hint:"encargarse de → 名詞", ok:["たんとう","担当"], c:1, es:"Me encargo de la importación de alimentos en mi empresa." },

    { k:"h9-06", pat:"〜たら、〜たいと思っています", pre:"留学が（", post:"）、日本の会社で（", post2:"）と思っています。", hint:"終わります → 〜たら / 働きます → 〜たい", ok:["終わったら","おわったら"], ok2:["働きたい","はたらきたい"], c:1, es:"Cuando termine el intercambio, quiero trabajar en una empresa japonesa." },
    { k:"h9-07", pat:"〜たら、〜たいと思っています", pre:"大学を（", post:"）、つうやくに（", post2:"）と思っています。", hint:"卒業します → 〜たら / なります → 〜たい", ok:["卒業したら","そつぎょうしたら"], ok2:["なりたい"], c:1, es:"Cuando me gradúe, quiero ser intérprete." },
    { k:"h9-08", pat:"〜たら、〜たいと思っています", pre:"5年ぐらい会社で（", post:"）、自分で会社を（", post2:"）と思っています。", hint:"働きます → 〜たら / 作ります → 〜たい", ok:["働いたら","はたらいたら"], ok2:["作りたい","つくりたい"], c:1, es:"Después de unos cinco años en una empresa, quiero montar la mía." },

    { k:"h9-09", pat:"〜たら", pre:"あと2、3年（", post:"）、海外の支社に行きたいと思ってるんです。", hint:"します → 〜たら", ok:["したら"], c:1, es:"Dentro de dos o tres años quiero irme a una sucursal en el extranjero." },
    { k:"h9-10", pat:"〜てもう〜になります", pre:"この会社に（", post:"）もう3年になります。", hint:"勤めます → forma て", ok:["勤めて","つとめて"], c:1, es:"Llevo ya tres años trabajando en esta empresa." },
    { k:"h9-11", pat:"〜やすいです", pre:"人間関係がよくて、上司が信頼できる人なんです。だから、（", post:"）ですよ。", hint:"働きます → 〜やすい", ok:["働きやすい","はたらきやすい"], c:1, es:"Las relaciones son buenas y el jefe es de fiar. Por eso se trabaja a gusto." },
    { k:"h9-12", pat:"〜んです", pre:"世界中に支社が（", post:"）よ。", hint:"あります → 〜んです", ok:["あるんです"], c:1, es:"Es que tenemos sucursales por todo el mundo." },
    { k:"h9-13", pat:"ともうします", pre:"すみません。エドワード（", post:"）。", hint:"presentarse en registro humilde", ok:["ともうします"], c:1, es:"Disculpe, me llamo Edward." },
    { k:"h9-14", pat:"いらっしゃいますか", pre:"村田さん、（", post:"）。", hint:"¿está?, con respeto (いる → 敬語)", ok:["いらっしゃいますか"], c:1, es:"¿Se encuentra el señor Murata?" },
    { k:"h9-15", pat:"ただいま〜します", pre:"村田は、ただいま（", post:"）。少々お待ちください。", hint:"まいります = venir, en humilde", ok:["まいります"], c:1, es:"Murata viene ahora mismo. Espere un momento, por favor." },
    { k:"h9-16", pat:"〜中です", pre:"もうしわけございません。村田は、ただいま（", post:"）です。", hint:"está al teléfono → 名詞 + 中", ok:["電話中","でんわちゅう"], c:1, es:"Lo lamento mucho. Murata está ahora mismo al teléfono." },

    { k:"h9-17", pat:"〜ことができます", pre:"いろいろな人と協力して仕事を（", post:"）ことができます。", hint:"します → forma diccionario", ok:["する"], c:2, es:"Puedo trabajar colaborando con gente de todo tipo." },
    { k:"h9-18", pat:"〜ことができます", pre:"難しい仕事でも、最後まであきらめないで（", post:"）ことができます。", hint:"がんばります → forma diccionario", ok:["がんばる"], c:2, es:"Aunque el trabajo sea difícil, puedo aguantar hasta el final sin rendirme." },
    { k:"h9-19", pat:"〜ことができます", pre:"体力に自信があるので、何日も寝ないで（", post:"）ことができます。", hint:"働きます → forma diccionario", ok:["働く","はたらく"], c:2, es:"Como tengo aguante, puedo trabajar varios días sin dormir." },
    { k:"h9-20", pat:"〜ことができます", pre:"ていねいな外国語で書いたり（", post:"）することができますか。", hint:"話します → 〜たり", ok:["話したり","はなしたり"], c:2, es:"¿Puedes escribir y hablar en un idioma extranjero de forma cuidada?" },
    { k:"h9-21", pat:"〜ことができます", pre:"コンピューターを使ってわかりやすいしりょうを（", post:"）ことができますか。", hint:"作ります → forma diccionario", ok:["作る","つくる"], c:2, es:"¿Puedes preparar con el ordenador documentos que se entiendan bien?" },
    { k:"h9-22", pat:"〜ことができます", pre:"どこに行っても、その国の生活や文化を（", post:"）ことができますか。", hint:"楽しみます → forma diccionario", ok:["楽しむ","たのしむ"], c:2, es:"Vayas donde vayas, ¿eres capaz de disfrutar de la vida y la cultura del país?" },

    { k:"h9-23", pat:"〜より〜方が〜", pre:"1人で働くよりいろいろな人に（", post:"）方が好きです。", hint:"会います → forma diccionario", ok:["会う","あう"], c:2, es:"Más que trabajar solo, me gusta ver a gente de todo tipo." },
    { k:"h9-24", pat:"〜より〜方が〜", pre:"会社に入って（", post:"）より自分で仕事が（", post2:"）方がいいです。", hint:"働きます / 選べます → forma diccionario", ok:["働く","はたらく"], ok2:["選べる","えらべる"], c:2, es:"Antes que entrar en una empresa, prefiero poder elegir yo el trabajo." },
    { k:"h9-25", pat:"〜より〜方が〜", pre:"つごうがいい時間だけ（", post:"）方がいいです。", hint:"働きに行きます → forma diccionario", ok:["働きに行く","はたらきにいく"], c:2, es:"Prefiero ir a trabajar solo en las horas que me vienen bien." },
    { k:"h9-26", pat:"〜より〜方が〜", pre:"物を（", post:"）より（", post2:"）方がとくいです。", hint:"作ります / 売ります → forma diccionario", ok:["作る","つくる"], ok2:["売る","うる"], c:2, es:"Se me da mejor vender cosas que fabricarlas." },
    { k:"h9-27", pat:"〜より〜方が〜", pre:"外国語が話せるよりほかの人と協力して（", post:"）方がだいじです。", hint:"働けます → forma diccionario (potencial)", ok:["働ける","はたらける"], c:2, es:"Más que hablar idiomas, lo importante es poder trabajar con los demás." },

    { k:"h9-28", pat:"〜たことがあります", pre:"アルバイトで観光客の通訳を（", post:"）こともあります。", hint:"します → forma た", ok:["した"], c:2, es:"También he hecho de intérprete para turistas en un trabajo temporal." },
    { k:"h9-29", pat:"〜と思います", pre:"通訳や翻訳をすることが（", post:"）と思います。", hint:"できます → forma simple", ok:["できる"], c:2, es:"Creo que puedo hacer de intérprete y traducir." },
    { k:"h9-30", pat:"〜がもとめられています", pre:"同僚と助け合うことができる人が（", post:"）。", hint:"もとめます → pasiva + ています", ok:["もとめられています"], c:2, es:"Se busca gente capaz de ayudarse con los compañeros." },
    { k:"h9-31", pat:"〜だけじゃだめです", pre:"日本語や外国語ができる（", post:"）よ。", hint:"con solo eso no basta", ok:["だけじゃだめです"], c:2, es:"Con solo saber japonés u otros idiomas no basta." },
    { k:"h9-32", pat:"〜ないで", pre:"難しい仕事でも、最後まで（", post:"）がんばることができます。", hint:"あきらめます → 〜ないで", ok:["あきらめないで"], c:2, es:"Aunque el trabajo sea difícil, aguanto hasta el final sin rendirme." },
    { k:"h9-33", pat:"〜をとおして", pre:"（", post:"）ことをとおして、人や文化についてもっとよくわかると思います。", hint:"働きます → forma diccionario", ok:["働く","はたらく"], c:2, es:"Creo que trabajando se entiende mucho mejor a la gente y su cultura." },
    { k:"h9-34", pat:"〜ようになります", pre:"人や文化についてもっとよく（", post:"）と思います。", hint:"わかります → 〜ようになります", ok:["わかるようになる"], c:2, es:"Llegaré a entender mucho mejor a la gente y su cultura." }
  ],

  /* --- ARMAR LA FRASE (piezas desordenadas) ---------------------- */
  armar: [
    { k:"a9-01", es:"Cuando termine el intercambio, quiero trabajar en una empresa japonesa.", c:1, chips:["留学が","終わったら、","日本の会社で","働きたいと思っています"] },
    { k:"a9-02", es:"Dentro de dos o tres años quiero irme a una sucursal en el extranjero.", c:1, chips:["あと2、3年したら、","海外の支社に","行きたいと","思ってるんです"] },
    { k:"a9-03", es:"Nuestra empresa fabrica máquinas de todo tipo y las exporta.", c:1, chips:["うちの会社は、","いろいろな機械を","つくって","輸出してます"] },
    { k:"a9-04", es:"Llevo ya tres años trabajando en esta empresa.", c:1, chips:["この会社に","勤めて","もう3年に","なります"] },
    { k:"a9-05", es:"Me encargo sobre todo del contacto con las sucursales de Asia.", c:1, chips:["ぼくは、","おもにアジアの","支社との連絡を","担当してます"] },
    { k:"a9-06", es:"Las relaciones son buenas y el jefe es de fiar. Por eso se trabaja a gusto.", c:1, chips:["人間関係がよくて、","上司が信頼できる人なんです。","だから、","働きやすいですよ"] },
    { k:"a9-07", es:"Disculpe, me llamo Edward. Quisiera ver al señor Murata, de administración general.", c:1, chips:["すみません。","エドワードともうします。","総務課の村田さん、","お願いしたいんですが"] },
    { k:"a9-08", es:"Murata viene ahora mismo. Espere un momento, por favor.", c:1, chips:["村田は、","ただいま","まいります。","少々お待ちください"] },
    { k:"a9-09", es:"Lo lamento mucho. Murata está ahora mismo al teléfono.", c:1, chips:["もうしわけございません。","村田は、","ただいま","電話中です"] },
    { k:"a9-10", es:"Al terminar la reunión informé al jefe de lo que habíamos hablado.", c:1, chips:["会議が終わって、","話し合ったことを","じょうしに","ほうこくしました"] },
    { k:"a9-11", es:"Puedo reunir información sobre Europa.", c:2, chips:["ヨーロッパの","情報を","集める","ことができます"] },
    { k:"a9-12", es:"Creo que puedo hacer de intérprete y traducir.", c:2, chips:["通訳や翻訳を","することが","できると","思います"] },
    { k:"a9-13", es:"También he hecho de intérprete para turistas en un trabajo temporal.", c:2, chips:["アルバイトで","観光客の通訳を","した","こともあります"] },
    { k:"a9-14", es:"Más que hablar idiomas, lo importante es poder trabajar con los demás.", c:2, chips:["外国語が話せるより","ほかの人と協力して","働ける方が","だいじです"] },
    { k:"a9-15", es:"Se busca gente capaz de informar bien al jefe.", c:2, chips:["上司に","きちんと報告が","できる人が","もとめられています"] },
    { k:"a9-16", es:"Con solo saber japonés u otros idiomas no basta.", c:2, chips:["日本語や","外国語が","できるだけじゃ","だめですよ"] },
    { k:"a9-17", es:"Prefiero trabajar en casa a trabajar en una oficina.", c:2, chips:["私は、","会社で働くより","家で仕事をする","方がいいです"] },
    { k:"a9-18", es:"Creo que trabajando llegaré a entender mejor a la gente y su cultura.", c:2, chips:["働くことをとおして、","人や文化について","もっとよくわかる","ようになると思います"] }
  ]
});
