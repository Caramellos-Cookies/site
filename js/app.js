(function () {
  const D = window.CARAMELLOS;
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const whats = (msg) => `https://wa.me/${D.contato.whatsapp}?text=${encodeURIComponent(msg)}`;
  const insta = `https://instagram.com/${D.contato.instagram}`;

  // ---------- links fixos ----------
  ["#flutuante", "#rod-whats"].forEach((s) => ($(s).href = whats(D.contato.mensagemPadrao)));
  ["#link-insta", "#btn-insta", "#rod-insta"].forEach((s) => ($(s).href = insta));
  $("#ano").textContent = new Date().getFullYear();

  // ---------- sabores ----------
  $("#lista-produtos").innerHTML = D.produtos.map((p, i) => `
    <article class="produto">
      <div class="produto__foto ${p.foto ? "" : "produto__foto--vazia"}">
        ${p.foto
          ? `<img src="${esc(p.foto)}" alt="${esc(p.nome)}" loading="lazy">`
          : `<img src="img/marca/mascote-adesivo.svg" alt="" class="produto__mascote"><span>foto em breve!</span>`}
        <span class="produto__selo">${esc(p.selo)}</span>
      </div>
      <div class="produto__corpo">
        <h3>${esc(p.nome)}</h3>
        <p class="produto__peso">${esc(p.peso)}</p>
        <ul>${p.itens.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <div class="produto__rodape">
          <span class="produto__preco">${brl(p.preco)}</span>
          <a href="#encomendar" class="btn btn--vermelho btn--peq" data-add="${esc(p.id)}">Quero esse</a>
        </div>
      </div>
    </article>`).join("");

  // ---------- preços ----------
  $("#tabela-precos").innerHTML = D.precos.map((g) => `
    <div class="precos__grupo cartao">
      <h3>${esc(g.grupo)}</h3>
      <table>
        <thead><tr><th>Produto</th><th>Qtd.</th><th>Valor</th></tr></thead>
        <tbody>${g.linhas.map((l) => `
          <tr><td>${esc(l.produto)}</td><td>${esc(l.qtd)}</td><td>${esc(l.valor)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>`).join("");
  $("#aviso-precos").textContent = D.avisoPrecos;

  // ---------- montador de pedido ----------
  const qtd = Object.fromEntries(D.produtos.map((p) => [p.id, 0]));
  $("#montador-itens").innerHTML = D.produtos.map((p) => `
    <div class="item" data-id="${esc(p.id)}">
      <div><strong>${esc(p.nome)}</strong><small>${brl(p.preco)} / un.</small></div>
      <div class="contador">
        <button type="button" data-d="-1" aria-label="Menos ${esc(p.nome)}">−</button>
        <output aria-live="polite">0</output>
        <button type="button" data-d="1" aria-label="Mais ${esc(p.nome)}">+</button>
      </div>
    </div>`).join("");

  function atualizar() {
    let total = 0, n = 0;
    const linhas = [];
    D.produtos.forEach((p) => {
      const q = qtd[p.id];
      document.querySelector(`.item[data-id="${p.id}"] output`).textContent = q;
      if (q) { total += q * p.preco; n += q; linhas.push(`• ${q}x ${p.nome}`); }
    });
    $("#total").textContent = brl(total);
    $("#btn-pedido-txt").textContent = n ? `Pedir ${n} cookie${n > 1 ? "s" : ""} pelo WhatsApp` : "Pedir pelo WhatsApp";
    const msg = n
      ? `Oi, Irae! Vim pelo site e quero encomendar:\n${linhas.join("\n")}\nTotal estimado: ${brl(total)}\n\nPodemos combinar data e entrega?`
      : D.contato.mensagemPadrao;
    $("#btn-pedido").href = whats(msg);
  }

  $("#montador-itens").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-d]");
    if (!b) return;
    const id = b.closest(".item").dataset.id;
    qtd[id] = Math.max(0, Math.min(99, qtd[id] + Number(b.dataset.d)));
    atualizar();
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-add]");
    if (!a) return;
    qtd[a.dataset.add] += 1;
    atualizar();
    const item = document.querySelector(`.item[data-id="${a.dataset.add}"]`);
    item.classList.remove("pulo"); void item.offsetWidth; item.classList.add("pulo");
  });
  atualizar();

  // ---------- empresas e festas ----------
  const C = D.corporativo;
  if (C) {
    $("#segmentos").innerHTML = C.segmentos.map((g) => `
      <article class="segmento cartao">
        <h3>${esc(g.titulo)}</h3>
        <p>${esc(g.texto)}</p>
        <ul>${g.itens.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </article>`).join("");
    $("#corp-min").textContent = C.minimo;
    $("#corp-prazo").textContent = C.antecedencia;
    $("#o-qtd").min = 1;
    $("#form-orcamento").addEventListener("submit", (e) => {
      e.preventDefault();
      const qtd = parseInt($("#o-qtd").value, 10) || 0;
      const aviso = $("#o-aviso");
      if (qtd && qtd < C.minimo) { aviso.textContent = `O pedido mínimo para eventos é de ${C.minimo} cookies. Para menos, use o "Monte seu pedido" logo abaixo.`; aviso.hidden = false; return; }
      aviso.hidden = true;
      const data = $("#o-data").value ? new Date($("#o-data").value + "T12:00").toLocaleDateString("pt-BR") : "a combinar";
      const linhas = [
        "Oi, Irae! Vim pelo site e quero um orçamento para evento 🍪",
        `• Tipo: ${$("#o-tipo").value}`,
        `• Quantidade: ${qtd || "a definir"} cookies`,
        `• Data: ${data}`,
        $("#o-nome").value.trim() && `• Nome/empresa: ${$("#o-nome").value.trim()}`,
        $("#o-obs").value.trim() && `• Detalhes: ${$("#o-obs").value.trim()}`
      ].filter(Boolean);
      window.open(whats(linhas.join("\n")), "_blank", "noopener");
    });
  }

  // ---------- onde encontrar ----------
  const L = D.locais;
  const lista = (arr, fmt, vazio) => arr.length ? `<ul>${arr.map(fmt).join("")}</ul>` : `<p class="vazio">${vazio}</p>`;
  const cards = [
    ["📍", "Região de atendimento", `<p>${esc(L.regiao)}</p>`],
    ["🛍️", "Retirada e entrega", `<p>${esc(L.retirada)}</p><p>${esc(L.entrega)}</p>`],
    ["🏪", "Pontos de venda", lista(L.pontosDeVenda, (p) => `<li><strong>${esc(p.nome)}</strong><br>${esc(p.endereco)}</li>`, "Em breve em cafés e lojinhas da região. Quer revender? Me chama!")],
    ["🎪", "Eventos e feiras", lista(L.eventos, (ev) => `<li><strong>${esc(ev.data)}</strong> · ${esc(ev.nome)}<br>${esc(ev.local)}</li>`, "As próximas feiras são anunciadas no Instagram. Fica de olho!")]
  ];
  $("#onde-cards").innerHTML = cards.map(([ic, t, c]) => `
    <div class="onde__card cartao"><span class="onde__ic" aria-hidden="true">${ic}</span><h3>${t}</h3>${c}</div>`).join("");

  // ---------- instagram ----------
  $("#galeria").innerHTML = D.galeria.map((g) => `
    <a href="${insta}" target="_blank" rel="noopener" class="galeria__item">
      <img src="${esc(g.foto)}" alt="${esc(g.alt)}" loading="lazy">
    </a>`).join("");

  $("#depoimentos").innerHTML = D.depoimentos.length
    ? D.depoimentos.map((d) => `<figure class="balao-dep"><blockquote>“${esc(d.texto)}”</blockquote><figcaption>${esc(d.nome)}</figcaption></figure>`).join("")
    : `<div class="balao-dep balao-dep--convite"><p><strong>Já provou?</strong> Marca a <a href="${insta}" target="_blank" rel="noopener">@${esc(D.contato.instagram)}</a> no stories e conta o que achou. Seu feedback pode aparecer aqui! 💬</p></div>`;

  // ---------- menu mobile ----------
  const btn = $(".menu-btn"), menu = $("#menu");
  btn.addEventListener("click", () => {
    const aberto = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!aberto));
    menu.classList.toggle("aberto", !aberto);
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) { btn.setAttribute("aria-expanded", "false"); menu.classList.remove("aberto"); }
  });

  // ---------- cabeçalho com sombra ao rolar ----------
  const topo = $("#topo");
  addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 10), { passive: true });

  // ---------- revelar ao rolar ----------
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visivel"); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".produto, .cartao, .passos li, .galeria__item").forEach((el) => {
      el.classList.add("revela"); io.observe(el);
    });
  }
})();
