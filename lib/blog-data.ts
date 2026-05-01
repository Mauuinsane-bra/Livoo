// lib/blog-data.ts
// Artigos do blog Go Livoo — focados em SEO de destinos e eventos

export interface BlogPost {
  slug:        string
  title:       string
  excerpt:     string
  content:     string   // HTML/markdown simplificado
  category:    string
  categoryColor: string
  date:        string   // ISO 8601
  readTime:    number   // minutos
  imageUrl:    string
  tags:        string[]
  featured?:   boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'como-ir-ao-gp-de-formula-1-em-monaco',
    title: 'Como ir ao GP de Fórmula 1 em Mônaco: guia completo 2026',
    excerpt: 'O GP de Mônaco é o mais glamouroso da Fórmula 1. Saiba como planejar a viagem, onde ficar, quanto custa e o que não pode deixar de fazer nas ruas do Principado.',
    category: 'Automobilismo',
    categoryColor: '#7c3aed',
    date: '2026-03-15',
    readTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1615483585256-a5e24a069ee1?w=1200',
    tags: ['fórmula 1', 'mônaco', 'gp monaco', 'automobilismo', 'europa'],
    featured: true,
    content: `
<h2>Por que o GP de Mônaco é diferente de todos os outros?</h2>
<p>
  O Grande Prêmio de Mônaco é corrido nas ruas do Principado desde 1929 — antes mesmo da criação do campeonato
  mundial de Fórmula 1. É a corrida mais lenta do calendário em termos de velocidade média, mas a mais difícil
  de ultrapassar, a mais glamourosa, e a única onde os pilotos ainda sentem aquela adrenalina bruta de guiar
  a 300 km/h a centímetros das barreiras de concreto.
</p>
<p>
  O circuito de Monte Carlo percorre os pontos mais icônicos do Principado: a curva do Casino, o túnel,
  a chicane do porto com os iates ao fundo. Nenhum outra corrida no mundo tem esse cenário.
</p>

<h2>Quando acontece o GP de Mônaco 2026?</h2>
<p>
  O GP de Mônaco 2026 está previsto para o fim de semana de <strong>21 a 24 de maio de 2026</strong>.
  O formato é o mesmo dos últimos anos: treinos na quinta e sexta, quali no sábado, corrida no domingo.
</p>

<h2>Quanto custa ir ao GP de Mônaco?</h2>
<p>
  Mônaco é, sem dúvida, a experiência mais cara da F1. Os ingressos para a área das arquibandadas
  começam em €300–400 para o fim de semana completo. Suítes e espaços VIP nos iates no porto
  podem chegar a €50.000 por grupo.
</p>
<p>
  Para o viajante brasileiro médio, um roteiro realista inclui:
</p>
<ul>
  <li><strong>Voo Guarulhos → Nice (NCE):</strong> R$ 4.500–7.000 ida e volta em econômica</li>
  <li><strong>Hotel 3★ em Nice (transfer para Mônaco):</strong> €150–250/noite (4 noites: €600–1.000)</li>
  <li><strong>Ingresso GP + treinos:</strong> €400–600 por pessoa</li>
  <li><strong>Transporte Nice–Mônaco (trem):</strong> €10–15 por trajeto</li>
  <li><strong>Alimentação e passeios:</strong> €80–120/dia</li>
</ul>
<p>
  <strong>Estimativa total para 5 dias:</strong> R$ 15.000–22.000 por pessoa, tudo incluído.
</p>

<h2>Onde ficar? Nice ou Mônaco?</h2>
<p>
  Ficar em <strong>Nice</strong> é a escolha mais inteligente para a maioria dos viajantes. A cidade
  fica a apenas 30 minutos de trem de Mônaco (€4 a passagem), tem muito mais opções de hotel e
  restaurantes a preços razoáveis. Mônaco em si tem poucos hotéis — e os que existem são exclusivamente
  de luxo, com diárias que facilmente passam de €1.000 durante o GP.
</p>
<p>
  Durante o fim de semana do GP, a demanda por hospedagem na região explode. <strong>Reserve com
  pelo menos 6 meses de antecedência.</strong>
</p>

<h2>O que não pode deixar de fazer em Mônaco</h2>
<ul>
  <li>Caminhar pelo circuito na quinta-feira de manhã (antes dos treinos), quando as ruas ainda estão abertas</li>
  <li>Visitar o Museu de Automóveis de Mônaco (coleção do Príncipe Rainier)</li>
  <li>Subir ao Jardim Exótico para a vista mais bonita do porto e do circuito</li>
  <li>Casino de Monte Carlo — mesmo que só para ver por fora (entrada é paga e tem código de vestimenta)</li>
  <li>Jantar na Condamine, o bairro local, longe dos restaurantes turísticos do porto</li>
</ul>

<h2>Documentação para brasileiros em Mônaco</h2>
<p>
  Mônaco não faz parte da União Europeia, mas adota o euro e tem fronteiras abertas com a França.
  Brasileiros precisam de <strong>passaporte válido</strong> com pelo menos 6 meses de validade
  além da data de retorno. Não é necessário visto para estadas de até 90 dias em Mônaco/Espaço Schengen.
</p>
<p>
  Use o <strong>Livoo Prep</strong> para confirmar todos os requisitos de documentação antes de comprar
  sua passagem.
</p>

<h2>Como montar esse pacote com a Go Livoo</h2>
<p>
  Na plataforma da Go Livoo, basta descrever o que quer: "Quero ir ao GP de Mônaco em maio de 2026,
  saindo de São Paulo, para 5 dias". A IA gera um roteiro completo com voos, sugestão de hotel,
  dicas do evento e checklist de documentação — tudo em um só lugar.
</p>
    `,
  },
  {
    slug: 'rock-in-rio-2026-guia-completo',
    title: 'Rock in Rio 2026: guia completo para quem vem de fora do Rio',
    excerpt: 'Vai ao Rock in Rio 2026? Saiba como comprar ingresso, onde ficar no Rio, como chegar à Cidade do Rock e o que esperar de cada dia do festival.',
    category: 'Festivais',
    categoryColor: '#db2777',
    date: '2026-03-28',
    readTime: 7,
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
    tags: ['rock in rio', 'festival de música', 'rio de janeiro', 'shows', 'brasil'],
    featured: true,
    content: `
<h2>Rock in Rio 2026: o maior festival da América Latina</h2>
<p>
  O Rock in Rio é um dos maiores festivais de música do mundo — e o maior da América Latina.
  Com mais de 700 artistas, 9 palcos e mais de 700 mil visitantes por edição, o evento
  transforma o Rio de Janeiro na capital mundial da música por dois fins de semana consecutivos.
</p>

<h2>Datas e programação</h2>
<p>
  O Rock in Rio 2026 acontece nos fins de semana de <strong>12–13 e 19–20 de setembro de 2026</strong>,
  na Cidade do Rock, na Barra da Tijuca. O Palco Mundo recebe os headliners internacionais;
  o Palco Sunset tem shows a partir das 15h30.
</p>

<h2>Ingressos: como comprar e quanto custa</h2>
<p>
  Os ingressos do Rock in Rio são vendidos exclusivamente pelo site oficial e costumam esgotar
  em horas. O preço de um ingresso para um dia gira em torno de <strong>R$ 550–750</strong>
  na primeira leva. Passaportes (4 dias) começam em R$ 1.800.
</p>
<p>
  Dica: cadastre-se na lista de espera do site oficial e fique de olho nas redes sociais do festival.
  A Go Livoo monitora as datas de abertura de vendas em <a href="/eventos">nossa página de eventos</a>.
</p>

<h2>Onde ficar no Rio de Janeiro</h2>
<p>
  A Cidade do Rock fica na Barra da Tijuca. As melhores opções de hospedagem para quem vai ao festival:
</p>
<ul>
  <li><strong>Barra da Tijuca:</strong> mais próximo do evento, transfer direto, preços mais altos durante o festival</li>
  <li><strong>Ipanema / Leblon:</strong> melhor localização para aproveitar o Rio, 30–40 min de táxi/app até a Cidade do Rock</li>
  <li><strong>Centro / Lapa:</strong> mais barato, próximo a bares e vida noturna, 40–50 min até a Cidade do Rock</li>
</ul>

<h2>Como chegar à Cidade do Rock</h2>
<p>
  O Rock in Rio oferece transporte oficial (ônibus fretados) a partir de vários pontos da cidade,
  incluindo estações do metrô. O serviço é pago à parte (R$ 40–60 ida e volta) e garante
  acesso seguro sem engarrafamentos. Apps de mobilidade (99, Uber) funcionam bem, mas espere
  filas na saída do evento.
</p>

<h2>O que levar para o festival</h2>
<ul>
  <li>Ingresso impresso ou digital (app Rock in Rio)</li>
  <li>Documento com foto (RG ou CNH — passaporte para estrangeiros)</li>
  <li>Protetor solar e repelente (setembro ainda é quente no Rio)</li>
  <li>Roupa leve — dias costumam ser quentes; noites podem esfriar</li>
  <li>Não pode: cadeira dobrável, guarda-chuva grande, profissional fotográfico sem credencial</li>
</ul>

<h2>Monte seu roteiro para o Rock in Rio</h2>
<p>
  Use a Go Livoo para montar o pacote completo: voo para o Rio, hotel próximo ao festival e
  orientações sobre a programação. Descreva no campo de roteiro: "Quero ir ao Rock in Rio 2026,
  saindo de [sua cidade], por 4 dias".
</p>
    `,
  },
  {
    slug: 'viagem-japao-hanami-cerejeiras',
    title: 'Viagem ao Japão para ver o Hanami: quando ir e como se preparar',
    excerpt: 'O Hanami — a floração das cerejeiras — é um dos espetáculos naturais mais impressionantes do mundo. Saiba quando acontece, as melhores cidades para ver e como montar seu roteiro.',
    category: 'Cultura',
    categoryColor: '#0891b2',
    date: '2026-02-10',
    readTime: 9,
    imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200',
    tags: ['japão', 'hanami', 'cerejeiras', 'tóquio', 'kyoto', 'ásia'],
    content: `
<h2>O que é o Hanami?</h2>
<p>
  Hanami (花見) significa literalmente "contemplar flores" em japonês. A tradição de apreciar a
  floração das cerejeiras (sakura) existe no Japão há mais de mil anos. Para os japoneses,
  o sakura representa a transitoriedade da vida — as flores duram apenas 1–2 semanas antes de cair.
</p>
<p>
  Durante o Hanami, parques, rios e templos ficam cobertos de flores cor-de-rosa e brancas.
  As pessoas montam piqueniques sob as árvores, bebem sakê e cerveja, e celebram a chegada da primavera.
  É uma das experiências mais únicas que o Japão tem a oferecer.
</p>

<h2>Quando acontece o Hanami em 2026?</h2>
<p>
  A floração das cerejeiras varia conforme a latitude e o clima de cada ano. Em geral:
</p>
<ul>
  <li><strong>Tóquio:</strong> 20 de março – 10 de abril (pico: final de março)</li>
  <li><strong>Kyoto:</strong> 25 de março – 12 de abril (pico: início de abril)</li>
  <li><strong>Osaka:</strong> 25 de março – 8 de abril</li>
  <li><strong>Hokkaido (norte):</strong> late abril – início de maio</li>
</ul>
<p>
  Acompanhe o <a href="https://www.jnto.go.jp" target="_blank" rel="noopener">Japan National Tourism Organization</a> para previsões atualizadas conforme a temporada se aproxima.
</p>

<h2>Melhores lugares para ver o Hanami</h2>
<h3>Tóquio</h3>
<ul>
  <li>Parque Shinjuku Gyoen — o mais bonito e organizado (entrada ¥500)</li>
  <li>Rio Meguro — marginal coberta de cerejeiras, famosa pelos piqueniques</li>
  <li>Parque Ueno — o mais movimentado e festivo</li>
  <li>Chidorigafuchi — canal a poucos metros do Palácio Imperial</li>
</ul>
<h3>Kyoto</h3>
<ul>
  <li>Maruyama Park — o mais famoso, com uma cerejeira chorão iluminada à noite</li>
  <li>Philosopher's Path — canal cercado de centenas de cerejeiras</li>
  <li>Templo Kiyomizudera — vista da cidade com floração ao fundo</li>
</ul>

<h2>Quanto custa uma viagem ao Japão para o Hanami?</h2>
<p>
  O Hanami coincide com o Golden Week japonês (fim de abril), um dos períodos mais movimentados do ano.
  Reserve com antecedência mínima de 6–8 meses.
</p>
<ul>
  <li><strong>Voo São Paulo–Tóquio:</strong> R$ 5.500–9.000 ida e volta</li>
  <li><strong>Hotel 3★ em Tóquio:</strong> R$ 350–600/noite</li>
  <li><strong>Japan Rail Pass (14 dias):</strong> ¥50.000 (~R$ 2.200)</li>
  <li><strong>Alimentação:</strong> ¥2.000–4.000/dia (~R$ 90–175)</li>
</ul>
<p>
  <strong>Estimativa total 10 dias:</strong> R$ 18.000–30.000 por pessoa.
</p>

<h2>Documentação para brasileiros no Japão</h2>
<p>
  Brasileiros precisam de visto para entrar no Japão. O visto de turista é gratuito e pode ser
  solicitado no Consulado Geral do Japão em São Paulo ou via solicitantes autorizados.
  O processo leva 5–10 dias úteis. Exige passaporte válido, comprovante de reserva, extrato bancário
  e comprovante de renda.
</p>
<p>
  Use o <strong>Livoo Prep</strong> para verificar todos os requisitos atualizados antes de solicitar o visto.
</p>
    `,
  },
  {
    slug: 'documentacao-para-viajar-ao-exterior-checklist-completo',
    title: 'Documentação para viajar ao exterior: checklist completo para brasileiros em 2026',
    excerpt: 'Passaporte, visto, vacinas — não deixe a burocracia estragar sua viagem. Checklist completo de documentação para os destinos mais populares entre os brasileiros.',
    category: 'Dicas de Viagem',
    categoryColor: '#16a34a',
    date: '2026-04-01',
    readTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200',
    tags: ['documentação', 'passaporte', 'visto', 'vacinas', 'viagem exterior', 'dicas'],
    featured: true,
    content: `
<h2>O que você precisa verificar antes de qualquer viagem internacional</h2>
<p>
  Cada destino tem requisitos específicos. O erro mais comum do viajante brasileiro é deixar
  a verificação de documentação para a última hora — e descobrir que precisa de um visto que
  demora 3 semanas para processar, ou que a vacina de febre amarela precisava ser tomada
  10 dias antes da viagem.
</p>
<p>
  Este checklist cobre os principais documentos e requisitos para os destinos mais buscados
  por brasileiros. Para verificação específica e atualizada, use o <a href="/prep">Livoo Prep</a>.
</p>

<h2>1. Passaporte</h2>
<p>
  O passaporte brasileiro é processado pela Polícia Federal. Requisitos essenciais:
</p>
<ul>
  <li><strong>Validade:</strong> a maioria dos países exige pelo menos 6 meses de validade ALÉM da data de retorno. Com 3 meses, você pode ser negado no embarque.</li>
  <li><strong>Prazo:</strong> tire o passaporte com pelo menos 2 meses de antecedência. Em períodos de alta demanda pode demorar mais.</li>
  <li><strong>Onde tirar:</strong> Polícia Federal (agendamento pelo gov.br). Taxa: R$ 257,25.</li>
  <li><strong>E-Passaporte:</strong> recomendado — permite entrar nos EUA sem visto (ESTA) e agiliza imigração em vários países.</li>
</ul>

<h2>2. Visto: quem precisa de quê</h2>

<h3>Destinos sem visto para brasileiros (principais)</h3>
<ul>
  <li>União Europeia / Espaço Schengen — até 90 dias (Portugal, França, Espanha, Itália, Alemanha...)</li>
  <li>Reino Unido — até 6 meses (sem visto, mas pode ser questionado na imigração sobre fins da viagem)</li>
  <li>Canadá — até 6 meses (e-TA obrigatório para chegada por avião, ~CAD 7)</li>
  <li>Argentina, Chile, Uruguai, Paraguai — sem visto, apenas RG válido</li>
  <li>México, Colômbia, Peru, Equador — sem visto para turismo</li>
</ul>

<h3>Destinos que exigem visto prévio</h3>
<ul>
  <li><strong>EUA:</strong> visto B1/B2 ou ESTA (para e-passaporte). ESTA online: US$ 21, válido 2 anos.</li>
  <li><strong>Japão:</strong> visto de turismo gratuito, solicitar no Consulado. Prazo: 5–10 dias úteis.</li>
  <li><strong>China:</strong> visto obrigatório, solicitar no Consulado. Em 2026, China implementou vistos eletrônicos para alguns países — verificar.</li>
  <li><strong>Austrália:</strong> ETA eletrônico (AUD 20) ou visto turista. Apenas e-passaporte para ETA.</li>
  <li><strong>Índia:</strong> e-Visa online (USD 25–80 dependendo da duração). Prazo: 4–7 dias.</li>
  <li><strong>Rússia:</strong> visto obrigatório. Situação geopolítica afeta voos diretos — consultar antes.</li>
</ul>

<h2>3. Vacinas obrigatórias e recomendadas</h2>

<h3>Febre Amarela</h3>
<p>
  <strong>Obrigatória (com certificado internacional):</strong> Tanzânia, Uganda, Quênia, Gana, Congo,
  Angola, Zâmbia, e outros países africanos. Também exigida ao retornar de algumas regiões
  para entrar em certos países.
</p>
<p>
  <strong>Importante:</strong> a vacina de febre amarela precisa ser tomada pelo menos <strong>10 dias
  antes da viagem</strong>. O certificado é válido para toda a vida (revisão da OMS de 2016).
</p>

<h3>Outras vacinas recomendadas por destino</h3>
<ul>
  <li><strong>Ásia (sudeste):</strong> hepatite A e B, febre tifoide, japonesa B (longa permanência)</li>
  <li><strong>África subsaariana:</strong> meningite, cólera, raiva (atividades de risco)</li>
  <li><strong>América do Sul (selva):</strong> febre amarela, hepatite A</li>
  <li><strong>Todo destino:</strong> manter vacinas de rotina (COVID-19, gripe, hepatite A/B) em dia</li>
</ul>

<h2>4. Seguro viagem</h2>
<p>
  Não é um documento obrigatório para a maioria dos destinos — mas é altamente recomendado.
  A União Europeia exige seguro com cobertura mínima de €30.000 para o visto Schengen.
</p>
<p>
  Para uma viagem de 10 dias à Europa, um seguro básico custa em torno de R$ 150–300.
  Uma consulta médica emergencial na França pode custar €300–500. A conta é simples.
</p>

<h2>5. Outros documentos úteis</h2>
<ul>
  <li><strong>Permissão internacional para dirigir (PID):</strong> obrigatória em alguns países (EUA, Europa); tirar no DETRAN, custa ~R$ 130</li>
  <li><strong>Comprovante de hospedagem:</strong> alguns países pedem na imigração (EUA, UK)</li>
  <li><strong>Passagem de retorno:</strong> muitos países verificam se você tem passagem de volta</li>
  <li><strong>Extrato bancário:</strong> comprovante de que tem fundos suficientes para a estadia</li>
</ul>

<h2>Use o Livoo Prep para verificação completa</h2>
<p>
  O <a href="/prep">Livoo Prep</a> é nossa ferramenta de verificação de documentação.
  Por R$ 39 por viagem, você recebe um relatório completo e atualizado com todos os requisitos
  de visto, passaporte e vacinas para o seu destino específico — com base na API Sherpa,
  a mesma tecnologia usada por companhias aéreas internacionais.
</p>
    `,
  },
  {
    slug: 'mexico-copa-2026',
    title: 'México na Copa do Mundo 2026: tudo o que você precisa saber',
    excerpt: 'Guia completo para quem vai ao México na Copa do Mundo 2026: vistos, estádios, cidad