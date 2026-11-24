/* =========================================================
   DADOS DO SITE CARAMELLOS
   ---------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para
   atualizar preços, sabores, contato e locais.
   Basta trocar os textos entre aspas e salvar.
   ========================================================= */

window.CARAMELLOS = {
  contato: {
    // Número do WhatsApp com DDI + DDD, só números. Ex.: "5511999998888"
    whatsapp: "5511965400995",
    instagram: "caramellos.cookies",
    mensagemPadrao: "Oi, Iraê! Vim pelo site e quero encomendar cookies 🍪"
  },

  // ---------- SABORES ----------
  // foto: caminho da imagem (ou null para mostrar a mascote no lugar)
  // preco: valor unitário em reais (número). Usado no "monte seu pedido".
  produtos: [
    {
      id: "tradicional",
      nome: "Cookie Tradicional",
      peso: "≈ 90g",
      preco: 12,
      selo: "O clássico",
      foto: "img/fotos/tradicional-flor-de-sal.jpg",
      itens: ["Massa amanteigada", "Gotas de chocolate meio amargo"]
    },
    {
      id: "doce-de-leite",
      nome: "Doce de Leite com Castanha-do-Pará",
      peso: "≈ 100g · 80g de massa + 20g de recheio",
      preco: 12,
      selo: "Recheado",
      foto: "img/fotos/doce-de-leite-trio.jpg",
      itens: ["Massa amanteigada", "Recheio de doce de leite", "Castanha-do-pará"]
    },
    {
      id: "nutella",
      nome: "Cookie de Nutella",
      peso: "≈ 100g · 80g de massa + 20g de recheio",
      preco: 14,
      selo: "Recheado",
      foto: null,
      itens: ["Massa amanteigada", "Recheio de Nutella"]
    }
  ],

  // ---------- TABELA DE PREÇOS ----------
  // Cada grupo vira um bloco na seção "Preços".
  // "valor" é texto livre: "R$ 10,00", "a partir de R$ 50", "sob consulta"...
  precos: [
    {
      grupo: "Unidade",
      linhas: [
        { produto: "Cookie Tradicional", qtd: "1 un.", valor: "R$ 12,00" },
        { produto: "Doce de Leite com Castanha", qtd: "1 un.", valor: "R$ 12,00" },
        { produto: "Cookie de Nutella", qtd: "1 un.", valor: "R$ 14,00" }
      ]
    },
    {
      grupo: "Combos",
      linhas: [
        { produto: "Combo Trio (1 de cada sabor)", qtd: "3 un.", valor: "R$ 34,00" },
        { produto: "Combo Tradicional", qtd: "4 un.", valor: "R$ 36,00" }
      ]
    },
    {
      grupo: "Kits",
      linhas: [
        { produto: "Kit Presente (caixinha + cartão)", qtd: "6 un.", valor: "R$ 70,00" },
        { produto: "Kit Festa", qtd: "12 un.", valor: "R$ 130,00" }
      ]
    },
    {
      grupo: "Encomendas especiais",
      linhas: [
        { produto: "Eventos, empresas, lembrancinhas", qtd: "a partir de 20 un.", valor: "sob consulta" }
      ]
    }
  ],
  avisoPrecos: "Valores sujeitos a alteração. Confirme sempre pelo WhatsApp.",

  // ---------- EMPRESAS E FESTAS ----------
  // Seção "Corporativo e festas". O formulário monta a mensagem do WhatsApp.
  corporativo: {
    minimo: 20,                      // pedido mínimo (unidades)
    antecedencia: "5 dias úteis",    // prazo para encomendar
    // Encomendas já entregues (cases). "destaque" aparece como selo no cartão.
    encomendas: [
      {
        tipo: "Empresa",
        titulo: "Brinde corporativo com a marca do cliente",
        texto: "Cookies embalados um a um com adesivo do logo da empresa, montados junto com o kit de presentes.",
        destaque: "100 cookies",
        detalhes: ["Adesivo com o logo", "Embalagem individual", "Entrega no escritório"],
        fotos: [
          { foto: "img/encomendas/corporativo-kit.jpg", alt: "Kit corporativo com sacola, brindes e cookies com adesivo do logo da empresa" },
          { foto: "img/encomendas/corporativo-mao.jpg", alt: "Mão segurando cookie embalado com adesivo do logo da empresa" },
          { foto: "img/encomendas/corporativo-cookies.jpg", alt: "Cookies embalados com adesivo vermelho do logo da empresa" }
        ]
      },
      {
        tipo: "Festa",
        titulo: "Lembrancinha de aniversário de 3 anos",
        texto: "Adesivo personalizado com o tema da festa e o agradecimento aos convidados, direto na mesa de doces.",
        destaque: "",
        detalhes: ["Adesivo com o tema da festa", "Embalagem individual", "Pronto para a mesa"],
        fotos: [
          { foto: "img/encomendas/aniversario-lembrancinhas.jpg", alt: "Cookies embalados com adesivo de dinossauro de aniversário de três anos" },
          { foto: "img/encomendas/aniversario-mesa.jpg", alt: "Mesa de festa decorada com folhagens e cookies de lembrancinha" },
          { foto: "img/encomendas/aniversario-adesivos.jpg", alt: "Quatro cookies embalados com adesivo personalizado vistos de cima" }
        ]
      }
    ],
    segmentos: [
      {
        titulo: "Empresas",
        texto: "Mimos que fazem o time e os clientes lembrarem de você.",
        itens: ["Brindes de fim de ano", "Boas-vindas para novos colaboradores", "Coffee break e reuniões", "Presentes para clientes"]
      },
      {
        titulo: "Festas",
        texto: "O doce que todo mundo leva pra casa (e pede o contato).",
        itens: ["Aniversários", "Casamentos e noivados", "Chá de bebê e chá revelação", "Formaturas"]
      },
      {
        titulo: "Lembrancinhas",
        texto: "Cookie embalado um a um, pronto para entregar.",
        itens: ["Embalagem individual", "Adesivo com nome ou logo", "Cartãozinho com mensagem", "Cores do seu evento"]
      }
    ]
  },

  // ---------- FINALIZAR PEDIDO (popup do "Monte seu pedido") ----------
  pedido: {
    antecedenciaDias: 1,   // a data mais cedo que o cliente pode escolher (1 = a partir de amanhã)
    periodos: [
      { nome: "Manhã", horario: "9h às 12h", frase: "de manhã" },
      { nome: "Tarde", horario: "13h às 18h", frase: "à tarde" },
      { nome: "Noite", horario: "18h às 21h", frase: "à noite" }
    ],
    pagamentos: ["Pix", "Dinheiro", "Cartão"],
    avisoEntrega: "A taxa de entrega é combinada no WhatsApp, conforme o bairro.",
    avisoRetirada: "Retirada em Itaquera, com horário combinado no WhatsApp.",
    despedida: "Fico no aguardo da confirmação. Até já! 🧡"
  },

  // ---------- ONDE ENCONTRAR ----------
  locais: {
    regiao: "Itaquera e bairros vizinhos da Zona Leste de São Paulo.",
    retirada: "Retirada combinada em Itaquera, com data e horário marcados pelo WhatsApp.",
    entrega: "Entregas na Zona Leste conforme disponibilidade (taxa conforme a distância).",
    pontosDeVenda: [],   // ex.: { nome: "Café da Esquina", endereco: "Rua X, 123" }
    eventos: []          // ex.: { nome: "Feira de Itaquera", data: "14/12", local: "Praça Y" }
  },

  // ---------- INSTAGRAM ----------
  galeria: [
    { foto: "img/fotos/tradicional-close.jpg", alt: "Cookies tradicionais com pedaços de chocolate e flor de sal" },
    { foto: "img/cookie-doce-de-leite.jpg", alt: "Arte Pausa! com cookie de doce de leite com castanha-do-pará" },
    { foto: "img/fotos/doce-de-leite-aberto.jpg", alt: "Cookie de doce de leite partido mostrando o recheio" },
    { foto: "img/lembretes-gentis.jpg", alt: "Cookie de chocolate sobre azulejos vermelhos com o texto Lembretes gentis para você" },
    { foto: "img/fotos/fornada-bandeja-2.jpg", alt: "Bandeja de cookies tradicionais saindo do forno" },
    { foto: "img/cookie-tradicional-mao.jpg", alt: "Mão segurando um cookie tradicional com o adesivo da Caramellos" },
    { foto: "img/fotos/fornada-bandeja.jpg", alt: "Bandeja cheia de cookies tradicionais recém-assados" },
    { foto: "img/fotos/doce-de-leite-inteiro.jpg", alt: "Cookie de doce de leite coberto de castanha-do-pará picada" },
    { foto: "img/fotos/tradicional-trio.jpg", alt: "Três cookies tradicionais com pedaços de chocolate" }
  ],

  // ---------- FEEDBACKS DE CLIENTES ----------
  // Adicione depoimentos reais aqui. Enquanto estiver vazio,
  // o site mostra um convite para a pessoa deixar o dela.
  // ex.: { nome: "Ana, Itaquera", texto: "Melhor cookie da ZL!" }
  depoimentos: []
};
