module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},50001,(a,b,c)=>{b.exports=a.r(18622)},79847,a=>{a.n(a.i(3343))},9185,a=>{a.n(a.i(29432))},72842,a=>{a.n(a.i(75164))},54897,a=>{a.n(a.i(30106))},56157,a=>{a.n(a.i(18970))},94331,a=>{a.n(a.i(60644))},15988,a=>{a.n(a.i(56952))},25766,a=>{a.n(a.i(77341))},29725,a=>{a.n(a.i(94290))},5785,a=>{a.n(a.i(90588))},74793,a=>{a.n(a.i(33169))},85826,a=>{a.n(a.i(37111))},21565,a=>{a.n(a.i(41763))},65911,a=>{a.n(a.i(8950))},25128,a=>{a.n(a.i(91562))},40781,a=>{a.n(a.i(49670))},69411,a=>{a.n(a.i(75700))},63081,a=>{a.n(a.i(276))},75230,a=>{a.n(a.i(40795))},34607,a=>{a.n(a.i(11614))},96338,a=>{a.n(a.i(21751))},50642,a=>{a.n(a.i(12213))},32242,a=>{a.n(a.i(22693))},88530,a=>{a.n(a.i(10531))},8583,a=>{a.n(a.i(1082))},38534,a=>{a.n(a.i(98175))},70408,a=>{a.n(a.i(9095))},22922,a=>{a.n(a.i(96772))},78294,a=>{a.n(a.i(71717))},16625,a=>{a.n(a.i(85034))},88648,a=>{a.n(a.i(68113))},51914,a=>{a.n(a.i(66482))},25466,a=>{a.n(a.i(91505))},71029,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},16426,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"warnOnce",{enumerable:!0,get:function(){return d}});let d=a=>{}},29945,(a,b,c)=>{"use strict";let d;Object.defineProperty(c,"__esModule",{value:!0});var e={getAssetToken:function(){return i},getAssetTokenQuery:function(){return j},getDeploymentId:function(){return g},getDeploymentIdQuery:function(){return h}};for(var f in e)Object.defineProperty(c,f,{enumerable:!0,get:e[f]});function g(){return d}function h(a=!1){return d?`${a?"&":"?"}dpl=${d}`:""}function i(){return!1}function j(a=!1){return""}d=void 0},1359,(a,b,c)=>{"use strict";function d({widthInt:a,heightInt:b,blurWidth:c,blurHeight:e,blurDataURL:f,objectFit:g}){let h=c?40*c:a,i=e?40*e:b,j=h&&i?`viewBox='0 0 ${h} ${i}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${j}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${j?"none":"contain"===g?"xMidYMid":"cover"===g?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${f}'/%3E%3C/svg%3E`}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"getImageBlurSvg",{enumerable:!0,get:function(){return d}})},53549,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={VALID_LOADERS:function(){return f},imageConfigDefault:function(){return g}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=["default","imgix","cloudinary","akamai","custom"],g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumDiskCacheSize:void 0,maximumRedirects:3,maximumResponseBody:5e7,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1,customCacheHandler:!1}},87713,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"getImgProps",{enumerable:!0,get:function(){return j}}),a.r(16426);let d=a.r(29945),e=a.r(1359),f=a.r(53549),g=["-moz-initial","fill","none","scale-down",void 0];function h(a){return void 0!==a.default}function i(a){return void 0===a?a:"number"==typeof a?Number.isFinite(a)?a:NaN:"string"==typeof a&&/^[0-9]+$/.test(a)?parseInt(a,10):NaN}function j({src:a,sizes:b,unoptimized:c=!1,priority:k=!1,preload:l=!1,loading:m,className:n,quality:o,width:p,height:q,fill:r=!1,style:s,overrideSrc:t,onLoad:u,onLoadingComplete:v,placeholder:w="empty",blurDataURL:x,fetchPriority:y,decoding:z="async",layout:A,objectFit:B,objectPosition:C,lazyBoundary:D,lazyRoot:E,...F},G){var H;let I,J,K,{imgConf:L,showAltText:M,blurComplete:N,defaultLoader:O}=G,P=L||f.imageConfigDefault;if("allSizes"in P)I=P;else{let a=[...P.deviceSizes,...P.imageSizes].sort((a,b)=>a-b),b=P.deviceSizes.sort((a,b)=>a-b),c=P.qualities?.sort((a,b)=>a-b);I={...P,allSizes:a,deviceSizes:b,qualities:c}}if(void 0===O)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let Q=F.loader||O;delete F.loader,delete F.srcSet;let R="__next_img_default"in Q;if(R){if("custom"===I.loader)throw Object.defineProperty(Error(`Image with src "${a}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let a=Q;Q=b=>{let{config:c,...d}=b;return a(d)}}if(A){"fill"===A&&(r=!0);let a={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[A];a&&(s={...s,...a});let c={responsive:"100vw",fill:"100vw"}[A];c&&!b&&(b=c)}let S="",T=i(p),U=i(q);if((H=a)&&"object"==typeof H&&(h(H)||void 0!==H.src)){let b=h(a)?a.default:a;if(!b.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(b)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!b.height||!b.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(b)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(J=b.blurWidth,K=b.blurHeight,x=x||b.blurDataURL,S=b.src,!r)if(T||U){if(T&&!U){let a=T/b.width;U=Math.round(b.height*a)}else if(!T&&U){let a=U/b.height;T=Math.round(b.width*a)}}else T=b.width,U=b.height}let V=!k&&!l&&("lazy"===m||void 0===m);(!(a="string"==typeof a?a:S)||a.startsWith("data:")||a.startsWith("blob:"))&&(c=!0,V=!1),I.unoptimized&&(c=!0),R&&!I.dangerouslyAllowSVG&&a.split("?",1)[0].endsWith(".svg")&&(c=!0);let W=i(o),X=Object.assign(r?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:B,objectPosition:C}:{},M?{}:{color:"transparent"},s),Y=N||"empty"===w?null:"blur"===w?`url("data:image/svg+xml;charset=utf-8,${(0,e.getImageBlurSvg)({widthInt:T,heightInt:U,blurWidth:J,blurHeight:K,blurDataURL:x||"",objectFit:X.objectFit})}")`:`url("${w}")`,Z=g.includes(X.objectFit)?"fill"===X.objectFit?"100% 100%":"cover":X.objectFit,$=Y?{backgroundSize:Z,backgroundPosition:X.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:Y}:{},_=function({config:a,src:b,unoptimized:c,width:e,quality:f,sizes:g,loader:h}){if(c){if(b.startsWith("/")&&!b.startsWith("//")){let a=(0,d.getDeploymentId)();if(a){let c=b.indexOf("?");if(-1!==c){let d=new URLSearchParams(b.slice(c+1));d.get("dpl")||(d.append("dpl",a),b=b.slice(0,c)+"?"+d.toString())}else b+=`?dpl=${a}`}}return{src:b,srcSet:void 0,sizes:void 0}}let{widths:i,kind:j}=function({deviceSizes:a,allSizes:b},c,d){if(d){let c=/(^|\s)(1?\d?\d)vw/g,e=[];for(let a;a=c.exec(d);)e.push(parseInt(a[2]));if(e.length){let c=.01*Math.min(...e);return{widths:b.filter(b=>b>=a[0]*c),kind:"w"}}return{widths:b,kind:"w"}}return"number"!=typeof c?{widths:a,kind:"w"}:{widths:[...new Set([c,2*c].map(a=>b.find(b=>b>=a)||b[b.length-1]))],kind:"x"}}(a,e,g),k=i.length-1;return{sizes:g||"w"!==j?g:"100vw",srcSet:i.map((c,d)=>`${h({config:a,src:b,quality:f,width:c})} ${"w"===j?c:d+1}${j}`).join(", "),src:h({config:a,src:b,quality:f,width:i[k]})}}({config:I,src:a,unoptimized:c,width:T,quality:W,sizes:b,loader:Q}),aa=V?"lazy":m;return{props:{...F,loading:aa,fetchPriority:y,width:T,height:U,decoding:z,className:n,style:{...X,...$},sizes:_.sizes,srcSet:_.srcSet,src:t||_.src},meta:{unoptimized:c,preload:l||k,placeholder:w,fill:r}}}},42377,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(11857);a.n(d("[project]/node_modules/next/dist/client/image-component.js <module evaluation>"))},43489,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(11857);a.n(d("[project]/node_modules/next/dist/client/image-component.js"))},18409,a=>{"use strict";a.i(42377);var b=a.i(43489);a.n(b)},53200,(a,b,c)=>{"use strict";function d(a,b){let c=a||75;return b?.qualities?.length?b.qualities.reduce((a,b)=>Math.abs(b-c)<Math.abs(a-c)?b:a,b.qualities[0]):c}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"findClosestQuality",{enumerable:!0,get:function(){return d}})},37763,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"default",{enumerable:!0,get:function(){return g}});let d=a.r(53200),e=a.r(29945);function f({config:a,src:b,width:c,quality:g}){let h=(0,e.getDeploymentId)();if(b.startsWith("/")&&!b.startsWith("//")){let a=b.indexOf("?");if(-1!==a){let c=new URLSearchParams(b.slice(a+1)),d=c.get("dpl");if(d){h=d,c.delete("dpl");let e=c.toString();b=b.slice(0,a)+(e?"?"+e:"")}}}if(b.startsWith("/")&&b.includes("?")&&a.localPatterns?.length===1&&"**"===a.localPatterns[0].pathname&&""===a.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${b}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let i=(0,d.findClosestQuality)(g,a);return`${a.path}?url=${encodeURIComponent(b)}&w=${c}&q=${i}${b.startsWith("/")&&h?`&dpl=${h}`:""}`}f.__next_img_default=!0;let g=f},50858,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={default:function(){return k},getImageProps:function(){return j}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(71029),g=a.r(87713),h=a.r(18409),i=f._(a.r(37763));function j(a){let{props:b}=(0,g.getImgProps)(a,{defaultLoader:i.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[a,c]of Object.entries(b))void 0===c&&delete b[a];return{props:b}}let k=h.Image},3236,(a,b,c)=>{b.exports=a.r(50858)},80943,a=>{"use strict";let b=[{slug:"como-ir-ao-gp-de-formula-1-em-monaco",title:"Como ir ao GP de Fórmula 1 em Mônaco: guia completo 2026",excerpt:"O GP de Mônaco é o mais glamouroso da Fórmula 1. Saiba como planejar a viagem, onde ficar, quanto custa e o que não pode deixar de fazer nas ruas do Principado.",category:"Automobilismo",categoryColor:"#7c3aed",date:"2026-03-15",readTime:8,imageUrl:"https://images.unsplash.com/photo-1615483585256-a5e24a069ee1?w=1200",tags:["fórmula 1","mônaco","gp monaco","automobilismo","europa"],featured:!0,content:`
<h2>Por que o GP de M\xf4naco \xe9 diferente de todos os outros?</h2>
<p>
  O Grande Pr\xeamio de M\xf4naco \xe9 corrido nas ruas do Principado desde 1929 — antes mesmo da cria\xe7\xe3o do campeonato
  mundial de F\xf3rmula 1. \xc9 a corrida mais lenta do calend\xe1rio em termos de velocidade m\xe9dia, mas a mais dif\xedcil
  de ultrapassar, a mais glamourosa, e a \xfanica onde os pilotos ainda sentem aquela adrenalina bruta de guiar
  a 300 km/h a cent\xedmetros das barreiras de concreto.
</p>
<p>
  O circuito de Monte Carlo percorre os pontos mais ic\xf4nicos do Principado: a curva do Casino, o t\xfanel,
  a chicane do porto com os iates ao fundo. Nenhum outra corrida no mundo tem esse cen\xe1rio.
</p>

<h2>Quando acontece o GP de M\xf4naco 2026?</h2>
<p>
  O GP de M\xf4naco 2026 est\xe1 previsto para o fim de semana de <strong>21 a 24 de maio de 2026</strong>.
  O formato \xe9 o mesmo dos \xfaltimos anos: treinos na quinta e sexta, quali no s\xe1bado, corrida no domingo.
</p>

<h2>Quanto custa ir ao GP de M\xf4naco?</h2>
<p>
  M\xf4naco \xe9, sem d\xfavida, a experi\xeancia mais cara da F1. Os ingressos para a \xe1rea das arquibandadas
  come\xe7am em €300–400 para o fim de semana completo. Su\xedtes e espa\xe7os VIP nos iates no porto
  podem chegar a €50.000 por grupo.
</p>
<p>
  Para o viajante brasileiro m\xe9dio, um roteiro realista inclui:
</p>
<ul>
  <li><strong>Voo Guarulhos → Nice (NCE):</strong> R$ 4.500–7.000 ida e volta em econ\xf4mica</li>
  <li><strong>Hotel 3★ em Nice (transfer para M\xf4naco):</strong> €150–250/noite (4 noites: €600–1.000)</li>
  <li><strong>Ingresso GP + treinos:</strong> €400–600 por pessoa</li>
  <li><strong>Transporte Nice–M\xf4naco (trem):</strong> €10–15 por trajeto</li>
  <li><strong>Alimenta\xe7\xe3o e passeios:</strong> €80–120/dia</li>
</ul>
<p>
  <strong>Estimativa total para 5 dias:</strong> R$ 15.000–22.000 por pessoa, tudo inclu\xeddo.
</p>

<h2>Onde ficar? Nice ou M\xf4naco?</h2>
<p>
  Ficar em <strong>Nice</strong> \xe9 a escolha mais inteligente para a maioria dos viajantes. A cidade
  fica a apenas 30 minutos de trem de M\xf4naco (€4 a passagem), tem muito mais op\xe7\xf5es de hotel e
  restaurantes a pre\xe7os razo\xe1veis. M\xf4naco em si tem poucos hot\xe9is — e os que existem s\xe3o exclusivamente
  de luxo, com di\xe1rias que facilmente passam de €1.000 durante o GP.
</p>
<p>
  Durante o fim de semana do GP, a demanda por hospedagem na regi\xe3o explode. <strong>Reserve com
  pelo menos 6 meses de anteced\xeancia.</strong>
</p>

<h2>O que n\xe3o pode deixar de fazer em M\xf4naco</h2>
<ul>
  <li>Caminhar pelo circuito na quinta-feira de manh\xe3 (antes dos treinos), quando as ruas ainda est\xe3o abertas</li>
  <li>Visitar o Museu de Autom\xf3veis de M\xf4naco (cole\xe7\xe3o do Pr\xedncipe Rainier)</li>
  <li>Subir ao Jardim Ex\xf3tico para a vista mais bonita do porto e do circuito</li>
  <li>Casino de Monte Carlo — mesmo que s\xf3 para ver por fora (entrada \xe9 paga e tem c\xf3digo de vestimenta)</li>
  <li>Jantar na Condamine, o bairro local, longe dos restaurantes tur\xedsticos do porto</li>
</ul>

<h2>Documenta\xe7\xe3o para brasileiros em M\xf4naco</h2>
<p>
  M\xf4naco n\xe3o faz parte da Uni\xe3o Europeia, mas adota o euro e tem fronteiras abertas com a Fran\xe7a.
  Brasileiros precisam de <strong>passaporte v\xe1lido</strong> com pelo menos 6 meses de validade
  al\xe9m da data de retorno. N\xe3o \xe9 necess\xe1rio visto para estadas de at\xe9 90 dias em M\xf4naco/Espa\xe7o Schengen.
</p>
<p>
  Use o <strong>Livoo Prep</strong> para confirmar todos os requisitos de documenta\xe7\xe3o antes de comprar
  sua passagem.
</p>

<h2>Como montar esse pacote com a Go Livoo</h2>
<p>
  Na plataforma da Go Livoo, basta descrever o que quer: "Quero ir ao GP de M\xf4naco em maio de 2026,
  saindo de S\xe3o Paulo, para 5 dias". A IA gera um roteiro completo com voos, sugest\xe3o de hotel,
  dicas do evento e checklist de documenta\xe7\xe3o — tudo em um s\xf3 lugar.
</p>
    `},{slug:"rock-in-rio-2026-guia-completo",title:"Rock in Rio 2026: guia completo para quem vem de fora do Rio",excerpt:"Vai ao Rock in Rio 2026? Saiba como comprar ingresso, onde ficar no Rio, como chegar à Cidade do Rock e o que esperar de cada dia do festival.",category:"Festivais",categoryColor:"#db2777",date:"2026-03-28",readTime:7,imageUrl:"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200",tags:["rock in rio","festival de música","rio de janeiro","shows","brasil"],featured:!0,content:`
<h2>Rock in Rio 2026: o maior festival da Am\xe9rica Latina</h2>
<p>
  O Rock in Rio \xe9 um dos maiores festivais de m\xfasica do mundo — e o maior da Am\xe9rica Latina.
  Com mais de 700 artistas, 9 palcos e mais de 700 mil visitantes por edi\xe7\xe3o, o evento
  transforma o Rio de Janeiro na capital mundial da m\xfasica por dois fins de semana consecutivos.
</p>

<h2>Datas e programa\xe7\xe3o</h2>
<p>
  O Rock in Rio 2026 acontece nos fins de semana de <strong>12–13 e 19–20 de setembro de 2026</strong>,
  na Cidade do Rock, na Barra da Tijuca. O Palco Mundo recebe os headliners internacionais;
  o Palco Sunset tem shows a partir das 15h30.
</p>

<h2>Ingressos: como comprar e quanto custa</h2>
<p>
  Os ingressos do Rock in Rio s\xe3o vendidos exclusivamente pelo site oficial e costumam esgotar
  em horas. O pre\xe7o de um ingresso para um dia gira em torno de <strong>R$ 550–750</strong>
  na primeira leva. Passaportes (4 dias) come\xe7am em R$ 1.800.
</p>
<p>
  Dica: cadastre-se na lista de espera do site oficial e fique de olho nas redes sociais do festival.
  A Go Livoo monitora as datas de abertura de vendas em <a href="/eventos">nossa p\xe1gina de eventos</a>.
</p>

<h2>Onde ficar no Rio de Janeiro</h2>
<p>
  A Cidade do Rock fica na Barra da Tijuca. As melhores op\xe7\xf5es de hospedagem para quem vai ao festival:
</p>
<ul>
  <li><strong>Barra da Tijuca:</strong> mais pr\xf3ximo do evento, transfer direto, pre\xe7os mais altos durante o festival</li>
  <li><strong>Ipanema / Leblon:</strong> melhor localiza\xe7\xe3o para aproveitar o Rio, 30–40 min de t\xe1xi/app at\xe9 a Cidade do Rock</li>
  <li><strong>Centro / Lapa:</strong> mais barato, pr\xf3ximo a bares e vida noturna, 40–50 min at\xe9 a Cidade do Rock</li>
</ul>

<h2>Como chegar \xe0 Cidade do Rock</h2>
<p>
  O Rock in Rio oferece transporte oficial (\xf4nibus fretados) a partir de v\xe1rios pontos da cidade,
  incluindo esta\xe7\xf5es do metr\xf4. O servi\xe7o \xe9 pago \xe0 parte (R$ 40–60 ida e volta) e garante
  acesso seguro sem engarrafamentos. Apps de mobilidade (99, Uber) funcionam bem, mas espere
  filas na sa\xedda do evento.
</p>

<h2>O que levar para o festival</h2>
<ul>
  <li>Ingresso impresso ou digital (app Rock in Rio)</li>
  <li>Documento com foto (RG ou CNH — passaporte para estrangeiros)</li>
  <li>Protetor solar e repelente (setembro ainda \xe9 quente no Rio)</li>
  <li>Roupa leve — dias costumam ser quentes; noites podem esfriar</li>
  <li>N\xe3o pode: cadeira dobr\xe1vel, guarda-chuva grande, profissional fotogr\xe1fico sem credencial</li>
</ul>

<h2>Monte seu roteiro para o Rock in Rio</h2>
<p>
  Use a Go Livoo para montar o pacote completo: voo para o Rio, hotel pr\xf3ximo ao festival e
  orienta\xe7\xf5es sobre a programa\xe7\xe3o. Descreva no campo de roteiro: "Quero ir ao Rock in Rio 2026,
  saindo de [sua cidade], por 4 dias".
</p>
    `},{slug:"viagem-japao-hanami-cerejeiras",title:"Viagem ao Japão para ver o Hanami: quando ir e como se preparar",excerpt:"O Hanami — a floração das cerejeiras — é um dos espetáculos naturais mais impressionantes do mundo. Saiba quando acontece, as melhores cidades para ver e como montar seu roteiro.",category:"Cultura",categoryColor:"#0891b2",date:"2026-02-10",readTime:9,imageUrl:"https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200",tags:["japão","hanami","cerejeiras","tóquio","kyoto","ásia"],content:`
<h2>O que \xe9 o Hanami?</h2>
<p>
  Hanami (花見) significa literalmente "contemplar flores" em japon\xeas. A tradi\xe7\xe3o de apreciar a
  flora\xe7\xe3o das cerejeiras (sakura) existe no Jap\xe3o h\xe1 mais de mil anos. Para os japoneses,
  o sakura representa a transitoriedade da vida — as flores duram apenas 1–2 semanas antes de cair.
</p>
<p>
  Durante o Hanami, parques, rios e templos ficam cobertos de flores cor-de-rosa e brancas.
  As pessoas montam piqueniques sob as \xe1rvores, bebem sak\xea e cerveja, e celebram a chegada da primavera.
  \xc9 uma das experi\xeancias mais \xfanicas que o Jap\xe3o tem a oferecer.
</p>

<h2>Quando acontece o Hanami em 2026?</h2>
<p>
  A flora\xe7\xe3o das cerejeiras varia conforme a latitude e o clima de cada ano. Em geral:
</p>
<ul>
  <li><strong>T\xf3quio:</strong> 20 de mar\xe7o – 10 de abril (pico: final de mar\xe7o)</li>
  <li><strong>Kyoto:</strong> 25 de mar\xe7o – 12 de abril (pico: in\xedcio de abril)</li>
  <li><strong>Osaka:</strong> 25 de mar\xe7o – 8 de abril</li>
  <li><strong>Hokkaido (norte):</strong> late abril – in\xedcio de maio</li>
</ul>
<p>
  Acompanhe o <a href="https://www.jnto.go.jp" target="_blank" rel="noopener">Japan National Tourism Organization</a> para previs\xf5es atualizadas conforme a temporada se aproxima.
</p>

<h2>Melhores lugares para ver o Hanami</h2>
<h3>T\xf3quio</h3>
<ul>
  <li>Parque Shinjuku Gyoen — o mais bonito e organizado (entrada \xa5500)</li>
  <li>Rio Meguro — marginal coberta de cerejeiras, famosa pelos piqueniques</li>
  <li>Parque Ueno — o mais movimentado e festivo</li>
  <li>Chidorigafuchi — canal a poucos metros do Pal\xe1cio Imperial</li>
</ul>
<h3>Kyoto</h3>
<ul>
  <li>Maruyama Park — o mais famoso, com uma cerejeira chor\xe3o iluminada \xe0 noite</li>
  <li>Philosopher's Path — canal cercado de centenas de cerejeiras</li>
  <li>Templo Kiyomizudera — vista da cidade com flora\xe7\xe3o ao fundo</li>
</ul>

<h2>Quanto custa uma viagem ao Jap\xe3o para o Hanami?</h2>
<p>
  O Hanami coincide com o Golden Week japon\xeas (fim de abril), um dos per\xedodos mais movimentados do ano.
  Reserve com anteced\xeancia m\xednima de 6–8 meses.
</p>
<ul>
  <li><strong>Voo S\xe3o Paulo–T\xf3quio:</strong> R$ 5.500–9.000 ida e volta</li>
  <li><strong>Hotel 3★ em T\xf3quio:</strong> R$ 350–600/noite</li>
  <li><strong>Japan Rail Pass (14 dias):</strong> \xa550.000 (~R$ 2.200)</li>
  <li><strong>Alimenta\xe7\xe3o:</strong> \xa52.000–4.000/dia (~R$ 90–175)</li>
</ul>
<p>
  <strong>Estimativa total 10 dias:</strong> R$ 18.000–30.000 por pessoa.
</p>

<h2>Documenta\xe7\xe3o para brasileiros no Jap\xe3o</h2>
<p>
  Brasileiros precisam de visto para entrar no Jap\xe3o. O visto de turista \xe9 gratuito e pode ser
  solicitado no Consulado Geral do Jap\xe3o em S\xe3o Paulo ou via solicitantes autorizados.
  O processo leva 5–10 dias \xfateis. Exige passaporte v\xe1lido, comprovante de reserva, extrato banc\xe1rio
  e comprovante de renda.
</p>
<p>
  Use o <strong>Livoo Prep</strong> para verificar todos os requisitos atualizados antes de solicitar o visto.
</p>
    `},{slug:"documentacao-para-viajar-ao-exterior-checklist-completo",title:"Documentação para viajar ao exterior: checklist completo para brasileiros em 2026",excerpt:"Passaporte, visto, vacinas — não deixe a burocracia estragar sua viagem. Checklist completo de documentação para os destinos mais populares entre os brasileiros.",category:"Dicas de Viagem",categoryColor:"#16a34a",date:"2026-04-01",readTime:10,imageUrl:"https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200",tags:["documentação","passaporte","visto","vacinas","viagem exterior","dicas"],featured:!0,content:`
<h2>O que voc\xea precisa verificar antes de qualquer viagem internacional</h2>
<p>
  Cada destino tem requisitos espec\xedficos. O erro mais comum do viajante brasileiro \xe9 deixar
  a verifica\xe7\xe3o de documenta\xe7\xe3o para a \xfaltima hora — e descobrir que precisa de um visto que
  demora 3 semanas para processar, ou que a vacina de febre amarela precisava ser tomada
  10 dias antes da viagem.
</p>
<p>
  Este checklist cobre os principais documentos e requisitos para os destinos mais buscados
  por brasileiros. Para verifica\xe7\xe3o espec\xedfica e atualizada, use o <a href="/prep">Livoo Prep</a>.
</p>

<h2>1. Passaporte</h2>
<p>
  O passaporte brasileiro \xe9 processado pela Pol\xedcia Federal. Requisitos essenciais:
</p>
<ul>
  <li><strong>Validade:</strong> a maioria dos pa\xedses exige pelo menos 6 meses de validade AL\xc9M da data de retorno. Com 3 meses, voc\xea pode ser negado no embarque.</li>
  <li><strong>Prazo:</strong> tire o passaporte com pelo menos 2 meses de anteced\xeancia. Em per\xedodos de alta demanda pode demorar mais.</li>
  <li><strong>Onde tirar:</strong> Pol\xedcia Federal (agendamento pelo gov.br). Taxa: R$ 257,25.</li>
  <li><strong>E-Passaporte:</strong> recomendado — permite entrar nos EUA sem visto (ESTA) e agiliza imigra\xe7\xe3o em v\xe1rios pa\xedses.</li>
</ul>

<h2>2. Visto: quem precisa de qu\xea</h2>

<h3>Destinos sem visto para brasileiros (principais)</h3>
<ul>
  <li>Uni\xe3o Europeia / Espa\xe7o Schengen — at\xe9 90 dias (Portugal, Fran\xe7a, Espanha, It\xe1lia, Alemanha...)</li>
  <li>Reino Unido — at\xe9 6 meses (sem visto, mas pode ser questionado na imigra\xe7\xe3o sobre fins da viagem)</li>
  <li>Canad\xe1 — at\xe9 6 meses (e-TA obrigat\xf3rio para chegada por avi\xe3o, ~CAD 7)</li>
  <li>Argentina, Chile, Uruguai, Paraguai — sem visto, apenas RG v\xe1lido</li>
  <li>M\xe9xico, Col\xf4mbia, Peru, Equador — sem visto para turismo</li>
</ul>

<h3>Destinos que exigem visto pr\xe9vio</h3>
<ul>
  <li><strong>EUA:</strong> visto B1/B2 ou ESTA (para e-passaporte). ESTA online: US$ 21, v\xe1lido 2 anos.</li>
  <li><strong>Jap\xe3o:</strong> visto de turismo gratuito, solicitar no Consulado. Prazo: 5–10 dias \xfateis.</li>
  <li><strong>China:</strong> visto obrigat\xf3rio, solicitar no Consulado. Em 2026, China implementou vistos eletr\xf4nicos para alguns pa\xedses — verificar.</li>
  <li><strong>Austr\xe1lia:</strong> ETA eletr\xf4nico (AUD 20) ou visto turista. Apenas e-passaporte para ETA.</li>
  <li><strong>\xcdndia:</strong> e-Visa online (USD 25–80 dependendo da dura\xe7\xe3o). Prazo: 4–7 dias.</li>
  <li><strong>R\xfassia:</strong> visto obrigat\xf3rio. Situa\xe7\xe3o geopol\xedtica afeta voos diretos — consultar antes.</li>
</ul>

<h2>3. Vacinas obrigat\xf3rias e recomendadas</h2>

<h3>Febre Amarela</h3>
<p>
  <strong>Obrigat\xf3ria (com certificado internacional):</strong> Tanz\xe2nia, Uganda, Qu\xeania, Gana, Congo,
  Angola, Z\xe2mbia, e outros pa\xedses africanos. Tamb\xe9m exigida ao retornar de algumas regi\xf5es
  para entrar em certos pa\xedses.
</p>
<p>
  <strong>Importante:</strong> a vacina de febre amarela precisa ser tomada pelo menos <strong>10 dias
  antes da viagem</strong>. O certificado \xe9 v\xe1lido para toda a vida (revis\xe3o da OMS de 2016).
</p>

<h3>Outras vacinas recomendadas por destino</h3>
<ul>
  <li><strong>\xc1sia (sudeste):</strong> hepatite A e B, febre tifoide, japonesa B (longa perman\xeancia)</li>
  <li><strong>\xc1frica subsaariana:</strong> meningite, c\xf3lera, raiva (atividades de risco)</li>
  <li><strong>Am\xe9rica do Sul (selva):</strong> febre amarela, hepatite A</li>
  <li><strong>Todo destino:</strong> manter vacinas de rotina (COVID-19, gripe, hepatite A/B) em dia</li>
</ul>

<h2>4. Seguro viagem</h2>
<p>
  N\xe3o \xe9 um documento obrigat\xf3rio para a maioria dos destinos — mas \xe9 altamente recomendado.
  A Uni\xe3o Europeia exige seguro com cobertura m\xednima de €30.000 para o visto Schengen.
</p>
<p>
  Para uma viagem de 10 dias \xe0 Europa, um seguro b\xe1sico custa em torno de R$ 150–300.
  Uma consulta m\xe9dica emergencial na Fran\xe7a pode custar €300–500. A conta \xe9 simples.
</p>

<h2>5. Outros documentos \xfateis</h2>
<ul>
  <li><strong>Permiss\xe3o internacional para dirigir (PID):</strong> obrigat\xf3ria em alguns pa\xedses (EUA, Europa); tirar no DETRAN, custa ~R$ 130</li>
  <li><strong>Comprovante de hospedagem:</strong> alguns pa\xedses pedem na imigra\xe7\xe3o (EUA, UK)</li>
  <li><strong>Passagem de retorno:</strong> muitos pa\xedses verificam se voc\xea tem passagem de volta</li>
  <li><strong>Extrato banc\xe1rio:</strong> comprovante de que tem fundos suficientes para a estadia</li>
</ul>

<h2>Use o Livoo Prep para verifica\xe7\xe3o completa</h2>
<p>
  O <a href="/prep">Livoo Prep</a> \xe9 nossa ferramenta de verifica\xe7\xe3o de documenta\xe7\xe3o.
  Por R$ 39 por viagem, voc\xea recebe um relat\xf3rio completo e atualizado com todos os requisitos
  de visto, passaporte e vacinas para o seu destino espec\xedfico — com base na API Sherpa,
  a mesma tecnologia usada por companhias a\xe9reas internacionais.
</p>
    `}];a.s(["BLOG_POSTS",0,b,"getPost",0,function(a){return b.find(b=>b.slug===a)}])},52519,a=>{"use strict";var b=a.i(7997);a.i(70396);var c=a.i(73727),d=a.i(95936),e=a.i(3236),f=a.i(80943);async function g(){return f.BLOG_POSTS.map(a=>({slug:a.slug}))}async function h({params:a}){let b=(0,f.getPost)(a.slug);return b?{title:`${b.title} | Blog Go Livoo`,description:b.excerpt,openGraph:{title:b.title,description:b.excerpt,images:[{url:b.imageUrl}],type:"article",publishedTime:b.date}}:{}}a.s(["default",0,function({params:a}){let g=(0,f.getPost)(a.slug);g||(0,c.notFound)();let h=f.BLOG_POSTS.filter(a=>a.slug!==g.slug).slice(0,3);return(0,b.jsxs)("div",{style:{background:"#F4F6F9",minHeight:"100vh"},children:[(0,b.jsxs)("div",{style:{position:"relative",height:420,overflow:"hidden"},children:[(0,b.jsx)(e.default,{src:g.imageUrl,alt:g.title,fill:!0,style:{objectFit:"cover"},priority:!0,unoptimized:!0}),(0,b.jsx)("div",{style:{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(13,27,62,0.4) 0%, rgba(13,27,62,0.85) 100%)"}}),(0,b.jsxs)("div",{style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"40px 24px",maxWidth:860,margin:"0 auto",width:"100%",left:"50%",transform:"translateX(-50%)"},children:[(0,b.jsx)(d.default,{href:"/blog",style:{fontFamily:"Inter, sans-serif",fontSize:"0.8rem",fontWeight:700,color:"rgba(255,255,255,0.7)",textDecoration:"none",marginBottom:16,display:"inline-flex",alignItems:"center",gap:6},children:"← Voltar ao blog"}),(0,b.jsx)("span",{style:{display:"inline-block",background:g.categoryColor,color:"#fff",fontSize:"0.7rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"3px 12px",borderRadius:50,marginBottom:14,alignSelf:"flex-start"},children:g.category}),(0,b.jsx)("h1",{style:{fontFamily:"Nunito, sans-serif",fontSize:"clamp(1.6rem, 4vw, 2.5rem)",color:"#fff",lineHeight:1.2,marginBottom:12},children:g.title}),(0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:16},children:[(0,b.jsx)("span",{style:{fontFamily:"Inter, sans-serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.65)"},children:new Date(g.date).toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}),(0,b.jsx)("span",{style:{color:"rgba(255,255,255,0.35)"},children:"·"}),(0,b.jsxs)("span",{style:{fontFamily:"Inter, sans-serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.65)"},children:[g.readTime," min de leitura"]})]})]})]}),(0,b.jsx)("div",{style:{maxWidth:860,margin:"0 auto",padding:"48px 24px 64px"},children:(0,b.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 280px",gap:40,alignItems:"start"},children:[(0,b.jsxs)("article",{children:[(0,b.jsx)("div",{style:{background:"#fff",borderRadius:16,padding:"24px 28px",border:"1px solid #E2E8F0",marginBottom:32,borderLeft:`4px solid ${g.categoryColor}`},children:(0,b.jsx)("p",{style:{fontFamily:"Inter, sans-serif",fontSize:"1rem",color:"#0F2340",fontWeight:600,lineHeight:1.7,margin:0},children:g.excerpt})}),(0,b.jsx)("div",{style:{background:"#fff",borderRadius:20,padding:"40px 44px",boxShadow:"0 4px 24px rgba(13,27,62,0.07)",border:"1px solid #E2E8F0"},dangerouslySetInnerHTML:{__html:g.content},className:"blog-content"}),(0,b.jsx)("div",{style:{marginTop:28,display:"flex",flexWrap:"wrap",gap:8},children:g.tags.map(a=>(0,b.jsxs)("span",{style:{fontFamily:"Inter, sans-serif",fontSize:"0.75rem",color:"#64748B",background:"#fff",border:"1px solid #E2E8F0",padding:"4px 12px",borderRadius:50},children:["#",a]},a))})]}),(0,b.jsxs)("aside",{style:{position:"sticky",top:100},children:[(0,b.jsxs)("div",{style:{background:"linear-gradient(135deg, #0F2340 0%, #1E3A6E 100%)",borderRadius:16,padding:"28px 24px",marginBottom:24,textAlign:"center"},children:[(0,b.jsx)("h3",{style:{fontFamily:"Nunito, sans-serif",fontSize:"1.1rem",color:"#fff",marginBottom:10},children:"Precisa de visto?"}),(0,b.jsx)("p",{style:{fontFamily:"Inter, sans-serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.7)",lineHeight:1.65,marginBottom:18},children:"Verifique passaporte, visto e vacinas antes de comprar sua passagem. R$ 39 por viagem."}),(0,b.jsx)(d.default,{href:"/prep",className:"btn-gold",style:{fontSize:"0.85rem",padding:"10px 20px"},children:"Usar Livoo Prep"})]}),(0,b.jsxs)("div",{style:{background:"#fff",borderRadius:16,padding:"24px",border:"1px solid #E2E8F0",marginBottom:24},children:[(0,b.jsx)("h3",{style:{fontFamily:"Nunito, sans-serif",fontSize:"1rem",color:"#0F2340",marginBottom:8},children:"Monte seu roteiro"}),(0,b.jsx)("p",{style:{fontFamily:"Inter, sans-serif",fontSize:"0.82rem",color:"#64748B",lineHeight:1.6,marginBottom:14},children:"Descreva a experiência que quer ter e receba um pacote completo com voo + hotel."}),(0,b.jsx)(d.default,{href:"/",className:"btn-primary",style:{fontSize:"0.85rem",padding:"10px 20px",display:"block",textAlign:"center"},children:"Gerar roteiro grátis"})]}),h.length>0&&(0,b.jsxs)("div",{style:{background:"#fff",borderRadius:16,padding:"24px",border:"1px solid #E2E8F0"},children:[(0,b.jsx)("h3",{style:{fontFamily:"Inter, sans-serif",fontSize:"0.75rem",fontWeight:700,color:"#0F2340",textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:16},children:"Leia também"}),(0,b.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:14},children:h.map(a=>(0,b.jsx)(d.default,{href:`/blog/${a.slug}`,style:{textDecoration:"none"},children:(0,b.jsxs)("div",{style:{display:"flex",gap:12,alignItems:"flex-start"},children:[(0,b.jsx)("div",{style:{position:"relative",width:56,height:44,borderRadius:8,overflow:"hidden",flexShrink:0},children:(0,b.jsx)(e.default,{src:a.imageUrl,alt:a.title,fill:!0,style:{objectFit:"cover"},unoptimized:!0})}),(0,b.jsx)("p",{style:{fontFamily:"Inter, sans-serif",fontSize:"0.8rem",color:"#0F2340",fontWeight:600,lineHeight:1.4,margin:0},children:a.title})]})},a.slug))})]})]})]})}),(0,b.jsx)("style",{children:`
        .blog-content h2 {
          font-family: Nunito, sans-serif;
          font-size: 1.35rem;
          color: #0F2340;
          margin: 32px 0 14px;
          line-height: 1.3;
        }
        .blog-content h3 {
          font-family: Nunito, sans-serif;
          font-size: 1.1rem;
          color: #0F2340;
          margin: 24px 0 10px;
        }
        .blog-content p {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: #4A5A70;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .blog-content ul, .blog-content ol {
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          color: #4A5A70;
          line-height: 1.75;
          padding-left: 22px;
          margin-bottom: 16px;
        }
        .blog-content li { margin-bottom: 6px; }
        .blog-content strong { color: #0F2340; font-weight: 700; }
        .blog-content em { color: #1A82D8; font-style: italic; }
        .blog-content a { color: #1A82D8; font-weight: 600; text-decoration: underline; }
      `})]})},"generateMetadata",0,h,"generateStaticParams",0,g])},90857,a=>{a.n(a.i(52519))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__10z63aw._.js.map