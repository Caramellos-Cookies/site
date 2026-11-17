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
    whatsapp: "5511900000000",
    instagram: "caramellos.cookies",
    mensagemPadrao: "Oi, Irae! Vim pelo site e quero encomendar cookies 🍪"
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
      foto: "img/cookie-tradicional-mao.jpg",
      itens: ["Massa amanteigada", "Gotas de chocolate meio amargo"]
    },
    {
      id: "doce-de-leite",
      nome: "Doce de Leite com Castanha-do-Pará",
      peso: "≈ 100g · 80g de massa + 20g de recheio",
      preco: 12,
      selo: "Recheado",
      foto: "img/cookie-doce-de-leite.jpg",
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
    { foto: "img/cookie-doce-de-leite.jpg", alt: "Cookie de doce de leite com castanha-do-pará partido ao meio" },
    { foto: "img/lembretes-gentis.jpg", alt: "Cookie de chocolate sobre azulejos vermelhos com o texto Lembretes gentis para você" },
    { foto: "img/cookie-tradicional-mao.jpg", alt: "Mão segurando um cookie tradicional com pedaços de chocolate" }
  ],

  // ---------- FEEDBACKS DE CLIENTES ----------
  // Adicione depoimentos reais aqui. Enquanto estiver vazio,
  // o site mostra um convite para a pessoa deixar o dela.
  // ex.: { nome: "Ana, Itaquera", texto: "Melhor cookie da ZL!" }
  depoimentos: []
};
