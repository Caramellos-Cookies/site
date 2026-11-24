(function () {
  const D = window.CARAMELLOS;
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  // Usa o endereço direto do WhatsApp: o atalho wa.me estraga emojis (🍪 vira "�") ao redirecionar
  const whats = (msg) => `https://api.whatsapp.com/send?phone=${D.contato.whatsapp}&text=${encodeURIComponent(msg)}`;
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
    $("#btn-pedido-txt").textContent = n ? `Finalizar pedido de ${n} cookie${n > 1 ? "s" : ""}` : "Pedir pelo WhatsApp";
    $("#btn-pedido").href = whats(D.contato.mensagemPadrao);
  }

  // ---------- finalizar pedido (popup) ----------
  const PD = D.pedido || {};
  const ck = $("#checkout"), ckForm = $("#ck-form");
  const GUARDA = "caramellos-pedido";
  const lerGuardado = () => { try { return JSON.parse(localStorage.getItem(GUARDA)) || {}; } catch (e) { return {}; } };
  const guardar = (o) => { try { localStorage.setItem(GUARDA, JSON.stringify(o)); } catch (e) {} };
  const hojeMais = (dias) => { const d = new Date(); d.setDate(d.getDate() + dias); return d.toLocaleDateString("sv-SE"); };
  const tipo = () => (ckForm.querySelector('input[name="ck-tipo"]:checked') || {}).value;

  $("#ck-periodo").innerHTML = (PD.periodos || []).map((p, i) => `<option value="${i}">${esc(p.nome)} (${esc(p.horario)})</option>`).join("");
  $("#ck-pagamentos").insertAdjacentHTML("beforeend", (PD.pagamentos || []).map((p, i) =>
    `<label><input type="radio" name="ck-pag" value="${esc(p)}"${i === 0 ? " checked" : ""}><span>${esc(p)}</span></label>`).join(""));
  $("#ck-aviso-entrega").textContent = PD.avisoEntrega || "";
  $("#ck-aviso-retirada").textContent = PD.avisoRetirada || "";

  function itensPedido() {
    return D.produtos.filter((p) => qtd[p.id]).map((p) => ({ nome: p.nome, q: qtd[p.id], sub: qtd[p.id] * p.preco }));
  }
  function trocarTipo() {
    const ent = tipo() === "entrega";
    $("#ck-endereco").hidden = !ent; $("#ck-aviso-retirada").hidden = ent;
  }
  ckForm.addEventListener("change", (e) => {
    if (e.target.name === "ck-tipo") trocarTipo();
    if (e.target.id === "ck-presente") { $("#ck-cartao-campo").hidden = !e.target.checked; if (e.target.checked) $("#ck-cartao").focus(); }
  });

  // CEP: máscara + busca do endereço (ViaCEP, serviço público gratuito)
  let ultimoCep = "";
  $("#ck-cep").addEventListener("input", async (e) => {
    const dig = e.target.value.replace(/\D/g, "").slice(0, 8);
    e.target.value = dig.length > 5 ? dig.slice(0, 5) + "-" + dig.slice(5) : dig;
    const st = $("#ck-cep-status");
    if (dig.length !== 8 || dig === ultimoCep) { if (dig.length < 8) st.textContent = ""; return; }
    ultimoCep = dig; st.textContent = "Buscando endereço…";
    try {
      const r = await fetch(`https://viacep.com.br/ws/${dig}/json/`);
      const j = await r.json();
      if (j.erro) { st.textContent = "CEP não encontrado. Preencha o endereço abaixo."; return; }
      $("#ck-rua").value = j.logradouro || $("#ck-rua").value;
      $("#ck-bairro").value = j.bairro || $("#ck-bairro").value;
      $("#ck-cidade").value = j.localidade ? `${j.localidade}/${j.uf}` : $("#ck-cidade").value;
      st.textContent = "✓ Endereço encontrado";
      $("#ck-numero").focus();
    } catch (err) { st.textContent = "Não deu para buscar o CEP agora. Preencha o endereço abaixo."; }
  });

  function abrirCheckout() {
    const its = itensPedido(), total = its.reduce((s, i) => s + i.sub, 0);
    $("#ck-resumo").innerHTML = `<ul>${its.map((i) => `<li><span>${i.q}x ${esc(i.nome)}</span><b>${brl(i.sub)}</b></li>`).join("")}</ul>
      <p><span>Total dos cookies</span><b>${brl(total)}</b></p>`;
    const g = lerGuardado();
    [["ck-nome", "nome"], ["ck-cep", "cep"], ["ck-rua", "rua"], ["ck-numero", "numero"], ["ck-compl", "compl"], ["ck-bairro", "bairro"], ["ck-cidade", "cidade"]]
      .forEach(([id, k]) => { if (g[k] && !$("#" + id).value) $("#" + id).value = g[k]; });
    if (g.tipo) { const r = ckForm.querySelector(`input[name="ck-tipo"][value="${g.tipo}"]`); if (r) r.checked = true; }
    if (g.pag) { const r = ckForm.querySelector(`input[name="ck-pag"][value="${CSS.escape(g.pag)}"]`); if (r) r.checked = true; }
    const min = hojeMais(PD.antecedenciaDias ?? 1);
    $("#ck-data").min = min; if (!$("#ck-data").value || $("#ck-data").value < min) $("#ck-data").value = "";
    trocarTipo(); $("#ck-erro").hidden = true;
    ck.showModal();
    if (!$("#ck-nome").value) $("#ck-nome").focus();
  }
  $("#btn-pedido").addEventListener("click", (e) => {
    if (!itensPedido().length) return;          // sem cookies: abre a conversa normal
    e.preventDefault(); abrirCheckout();
  });
  ck.addEventListener("click", (e) => {
    if (e.target.closest("[data-fechar]") || e.target === ck) ck.close();
  });

  function montarMensagem(v) {
    const its = itensPedido(), total = its.reduce((s, i) => s + i.sub, 0);
    const per = (PD.periodos || [])[v.periodo] || {};
    const dia = new Date(v.data + "T12:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
    const end = [`${v.rua}, ${v.numero}${v.compl ? ", " + v.compl : ""}`, v.bairro, v.cidade, v.cep && "CEP " + v.cep].filter(Boolean).join(" · ");
    return [
      "Oi, Iraê! Tudo bem? 😊",
      `Aqui é ${v.nome}, vi os cookies no site e quero fazer uma encomenda:`,
      "",
      ...its.map((i) => `🍪 ${i.q}x ${i.nome} · ${brl(i.sub)}`),
      `*Total dos cookies: ${brl(total)}*${v.tipo === "entrega" ? " (+ entrega a combinar)" : ""}`,
      "",
      v.tipo === "entrega" ? `📦 *Entrega:* ${end}` : "🛍️ *Retirada:* vou retirar com você",
      `📅 *Para:* ${dia}, ${per.frase || ""} (${per.horario || ""})`,
      `💳 *Pagamento:* ${v.pag}`,
      v.presente && (v.cartao ? `🎁 *É presente!* Mensagem do cartão: "${v.cartao}"` : "🎁 *É presente!*"),
      v.obs && `📝 *Obs.:* ${v.obs}`,
      "",
      PD.despedida || "Fico no aguardo da confirmação!"
    ].filter((l) => typeof l === "string").join("\n").replace(/\n{3,}/g, "\n\n");
  }

  ckForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = {
      nome: $("#ck-nome").value.trim(), tipo: tipo(), cep: $("#ck-cep").value.trim(), rua: $("#ck-rua").value.trim(),
      numero: $("#ck-numero").value.trim(), compl: $("#ck-compl").value.trim(), bairro: $("#ck-bairro").value.trim(),
      cidade: $("#ck-cidade").value.trim(), data: $("#ck-data").value, periodo: Number($("#ck-periodo").value),
      pag: (ckForm.querySelector('input[name="ck-pag"]:checked') || {}).value || "", presente: $("#ck-presente").checked,
      cartao: $("#ck-cartao").value.trim(), obs: $("#ck-obs").value.trim()
    };
    const falta = [];
    if (!v.nome) falta.push("seu nome");
    if (v.tipo === "entrega" && (!v.rua || !v.numero || !v.bairro)) falta.push("o endereço (rua, número e bairro)");
    if (!v.data) falta.push("a data");
    else if (v.data < $("#ck-data").min) falta.push(`uma data a partir de ${new Date($("#ck-data").min + "T12:00").toLocaleDateString("pt-BR")}`);
    const erro = $("#ck-erro");
    if (falta.length) { erro.textContent = "Falta preencher " + falta.join(", ") + "."; erro.hidden = false; return; }
    erro.hidden = true;
    guardar({ nome: v.nome, tipo: v.tipo, cep: v.cep, rua: v.rua, numero: v.numero, compl: v.compl, bairro: v.bairro, cidade: v.cidade, pag: v.pag });
    const url = whats(montarMensagem(v));
    const w = window.open(url, "_blank", "noopener");
    if (!w) location.href = url;
    ck.close();
  });

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
    $("#corp-cases").innerHTML = (C.encomendas || []).map((e) => `
      <article class="case cartao">
        <div class="case__fotos">${e.fotos.slice(0, 3).map((f, i) => `<img class="case__foto case__foto--${i}" src="${esc(f.foto)}" alt="${esc(f.alt)}" loading="lazy">`).join("")}
          ${e.destaque ? `<span class="case__selo">${esc(e.destaque)}</span>` : ""}</div>
        <div class="case__txt">
          <span class="case__tipo">${esc(e.tipo)}</span>
          <h4>${esc(e.titulo)}</h4>
          <p>${esc(e.texto)}</p>
          <ul>${e.detalhes.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        </div>
      </article>`).join("");
    $("#corp-min").textContent = C.minimo;
    // eventos: o calendário só mostra datas a partir de hoje + dias de produção
    const diasEvento = C.antecedenciaDias ?? 5;
    const minEvento = hojeMais(diasEvento);
    const dataBR = (iso) => new Date(iso + "T12:00").toLocaleDateString("pt-BR");
    $("#corp-prazo").textContent = `${diasEvento} dias`;
    $("#o-data").min = minEvento;
    $("#o-qtd").min = 1;
    $("#form-orcamento").addEventListener("submit", (e) => {
      e.preventDefault();
      const qtd = parseInt($("#o-qtd").value, 10) || 0;
      const aviso = $("#o-aviso");
      if (qtd && qtd < C.minimo) { aviso.textContent = `O pedido mínimo para eventos é de ${C.minimo} cookies. Para menos, use o "Monte seu pedido" logo abaixo.`; aviso.hidden = false; return; }
      if ($("#o-data").value && $("#o-data").value < minEvento) {
        aviso.textContent = `Para eventos, precisamos de ${diasEvento} dias para a produção. Escolha uma data a partir de ${dataBR(minEvento)}.`;
        aviso.hidden = false; return;
      }
      aviso.hidden = true;
      const data = $("#o-data").value ? new Date($("#o-data").value + "T12:00").toLocaleDateString("pt-BR") : "a combinar";
      const linhas = [
        "Oi, Iraê! Vim pelo site e quero um orçamento para evento 🍪",
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
  const subir = $("#subir"), hero = $(".hero");
  const aoRolar = () => {
    topo.classList.toggle("rolado", scrollY > 10);
    subir.classList.toggle("visivel", scrollY > hero.offsetHeight);   // aparece depois da primeira tela
  };
  addEventListener("scroll", aoRolar, { passive: true }); aoRolar();

  // ---------- transições ao entrar nas seções (uma vez só) ----------
  // Sem JavaScript ou com "reduzir movimento" ligado, tudo aparece direto, sem efeito.
  const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduzMovimento) {
    document.documentElement.classList.add("anima");
    const aoVer = (ents, obs) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("animou"); obs.unobserve(en.target); }
    });
    const io = new IntersectionObserver(aoVer, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
    // seções inteiras (cortina): disparam assim que o topo entra no último quarto da tela
    const ioSecao = new IntersectionObserver(aoVer, { threshold: 0, rootMargin: "0px 0px -25% 0px" });
    // marca os elementos com o estilo e um atraso em cascata entre irmãos
    const marcar = (sel, estilo, passo) => document.querySelectorAll(sel).forEach((el) => {
      if (el.dataset.anim) return;
      const irmaos = [...el.parentElement.children].filter((c) => c.matches(sel));
      el.dataset.anim = estilo;
      el.style.setProperty("--atraso", irmaos.indexOf(el) * passo + "ms");
      (estilo === "cortina" ? ioSecao : io).observe(el);
    });
    marcar(".produto", "pop", 220);                                              // Sabores
    marcar(".cab h2", "titulo", 0);                                              // títulos das seções
    marcar("#quem-faz, #encomendar, .rodape", "cortina", 0);                     // seções vermelhas
    marcar(".cab__selo, .orcamento__txt > img", "carimbo", 0);                   // selos
    marcar(".precos__grupo, .segmento, .case, .orcamento", "sobe", 200);         // Preços, Empresas e festas
    marcar(".galeria__item, .passos li, .onde__card, .montador, .historia__txt, .balao-dep", "sobe", 150);
  }
})();
