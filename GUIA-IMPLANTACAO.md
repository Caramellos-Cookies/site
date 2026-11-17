# Guia de implantação: Caramellos

Passo a passo para colocar o site e o painel de estoque no ar em `caramelloscookies.com.br`,
**com tudo em nome da empresa** e o desenvolvedor só como administrador convidado.

**Legenda:** 🧑‍💻 você · 🍪 Irae / empresa · 🤖 Claude (no projeto) · ⏳ espera

**Regra de ouro:** toda conta é criada com o e-mail da empresa. Toda senha vai para o cofre (Bitwarden).
Verificação em duas etapas no celular da Irae.

---

## Status atual

- [x] Domínio `caramelloscookies.com.br` registrado
- [x] Gmail da Caramellos criado (vai ser a **chave reserva** de todas as contas)
- [x] Conta no Zoho Mail criada, no plano **gratuito**
- [x] Projeto do site pronto, com README de gestão e configuração da Netlify
- [ ] ⏳ Domínio em transição no registro.br (cerca de 2 h). A zona DNS só pode ser editada depois

---

## Fase 0: Conferências (5 min)

- [ ] 🧑‍💻 No registro.br, confira o **titular** do domínio. Deve ser o CNPJ da Caramellos (ou o CPF da Irae, se não houver CNPJ).
      Se estiver no seu nome, transfira a titularidade **antes** de tudo.
- [ ] 🧑‍💻 Gmail da Caramellos: em *Conta do Google → Segurança*
  - [ ] telefone de recuperação = celular da Irae
  - [ ] verificação em duas etapas ativada no celular da Irae
- [ ] 🧑‍💻 No registro.br, ative a verificação em duas etapas da conta que administra o domínio.

## Fase 1: Cofre de senhas (10 min)

- [ ] 🧑‍💻 Crie a conta em **bitwarden.com** (plano grátis) com o Gmail da Caramellos.
      Depois da Fase 2, troque o login para `admin@caramelloscookies.com.br`.
- [ ] 🧑‍💻 Guarde lá as senhas que já existem: Gmail, Zoho e registro.br.
- [ ] 🍪 A Irae instala o app do Bitwarden no celular e sabe a senha mestra. **A senha mestra não pode ser perdida:** ela não tem recuperação.

## Fase 2: E-mail corporativo no Zoho

### 2.1 Verificar o domínio (depois que a transição acabar)
- [ ] 🧑‍💻 No registro.br, abra `caramelloscookies.com.br`, vá em **DNS → Configurar zona DNS** e clique em **Nova entrada**:

  | Tipo | Nome | Dados |
  |---|---|---|
  | TXT | *(em branco)* | `zoho-verification=zb34864959.zmverify.zoho.com` |

  Clique em **Adicionar** e depois em **Salvar alterações**.
- [ ] 🤖 Me avise que eu confiro a propagação.
- [ ] 🧑‍💻 No Zoho (*mail.zoho.com → Painel de administração → Domínios*), clique em **Verificar registro TXT**.

### 2.2 Criar as caixas de e-mail
- [ ] 🧑‍💻 No Zoho, crie os usuários:
  - `admin@caramelloscookies.com.br`: dono das contas. Recebe faturas e alertas; ninguém usa no dia a dia
  - `contato@caramelloscookies.com.br`: atendimento. Vai no site e no Instagram; quem usa é a Irae
- [ ] 🧑‍💻 Em cada caixa, ative a verificação em duas etapas e coloque o Gmail da Caramellos como e-mail de recuperação.
- [ ] 🧑‍💻 Senhas no Bitwarden.

### 2.3 Fazer o e-mail funcionar (receber, enviar, não cair no spam)
Os valores exatos aparecem no Zoho em *Domínios → caramelloscookies.com.br → Configuração de e-mail*.
**Use sempre o que o Zoho mostrar**; a tabela abaixo é o padrão esperado.

| Tipo | Nome | Dados | Prioridade |
|---|---|---|---|
| MX | *(em branco)* | `mx.zoho.com` | 10 |
| MX | *(em branco)* | `mx2.zoho.com` | 20 |
| MX | *(em branco)* | `mx3.zoho.com` | 50 |
| TXT | *(em branco)* | `v=spf1 include:zohomail.com ~all` | |
| TXT | `zmail._domainkey` (o nome exato vem do Zoho) | chave DKIM gerada no Zoho, um texto longo que começa com `v=DKIM1; k=rsa; p=…` | |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@caramelloscookies.com.br` | |

- [ ] 🧑‍💻 Adicione no registro.br e salve.
- [ ] 🤖 Eu confiro os registros.
- [ ] 🧑‍💻 No Zoho, clique em **Verificar** em cada um (MX, SPF, DKIM).
- [ ] 🧑‍💻 Teste: mande um e-mail do Gmail para `contato@` e responda. A resposta deve chegar na caixa de entrada, não no spam.
- [ ] 🍪 A Irae instala o app **Zoho Mail** no celular e entra com `contato@`.

### 2.4 Trocar o login das contas para o `admin@`
- [ ] 🧑‍💻 Bitwarden: o e-mail da conta passa a ser `admin@`.
- [ ] 🧑‍💻 Zoho: o e-mail de contato e de recuperação da organização deve ser o Gmail (a reserva).

## Fase 3: Site no ar

### 3.1 Dados que faltam no site
- [ ] 🍪 Número real do WhatsApp para pedidos
- [ ] 🍪 Preços dos combos e kits (os atuais são exemplos)
- [ ] 🍪 Fotos em boa resolução, se houver (em especial a do cookie de Nutella)
- [ ] 🤖 Eu atualizo o `js/dados.js` e troco o e-mail de contato para `contato@`

### 3.2 GitHub (onde fica o código)
- [ ] 🧑‍💻 Com `admin@`, crie uma conta em **github.com** e depois uma **organização** (plano Free), por exemplo `caramellos`.
- [ ] 🧑‍💻 Convide a **sua** conta pessoal do GitHub para a organização como **Owner**.
- [ ] 🧑‍💻 Ative a verificação em duas etapas na conta `admin@` do GitHub.
- [ ] 🧑‍💻 No seu Mac, instale o GitHub CLI e faça login com a **sua** conta:
  ```
  brew install gh
  gh auth login
  ```
- [ ] 🤖 Eu faço o primeiro commit, crio o repositório `caramellos/site` (privado) e envio o código.

### 3.3 Netlify (hospedagem)
- [ ] 🧑‍💻 Com `admin@`, crie a conta em **netlify.com** (plano Free) e uma equipe *Caramellos*.
- [ ] 🧑‍💻 Convide o seu e-mail para a equipe.
- [ ] 🧑‍💻 **Add new site → Import an existing project → GitHub** e autorize a organização `caramellos`. Escolha o repositório `site`.
  - Build command: *(vazio)*
  - Publish directory: `.`
  - Clique em **Deploy**.
- [ ] 🤖 Eu confiro o site no endereço provisório `xxxxx.netlify.app`.

### 3.4 Domínio apontando para a Netlify
- [ ] 🧑‍💻 Na Netlify, vá em **Domain management → Add a domain** e digite `caramelloscookies.com.br`. Quando ela oferecer o Netlify DNS, escolha **manter o DNS externo**.
- [ ] 🧑‍💻 No registro.br, adicione (sem apagar os registros de e-mail):

  | Tipo | Nome | Dados |
  |---|---|---|
  | A | *(em branco)* | `75.2.60.5` |
  | CNAME | `www` | `xxxxx.netlify.app` (o endereço do seu site na Netlify) |

- [ ] ⏳ Espere a Netlify emitir o **HTTPS** (Let's Encrypt). É automático e leva de minutos a horas.
- [ ] 🤖 Eu confiro: `https://caramelloscookies.com.br` abre, `www` redireciona e o e-mail continua funcionando.

## Fase 4: Painel de estoque com login, em nome da empresa

### 4.1 Supabase (banco de dados e login)
- [ ] 🧑‍💻 Com `admin@`, crie a conta em **supabase.com** e uma organização *Caramellos* (plano Free).
- [ ] 🧑‍💻 **New project:**
  - nome: `caramellos-painel`
  - região: **South America (São Paulo)**
  - senha do banco: gere uma forte e **guarde no Bitwarden**
- [ ] 🧑‍💻 Em *Organization → Team*, convide o **seu** e-mail como *Developer* ou *Administrator*.
- [ ] 🧑‍💻 Em *Authentication → Sign In / Providers*, **desligue** "Allow new users to sign up". Assim só entra quem for convidado.
- [ ] 🧑‍💻 Em *Project Settings → API*, me passe a **Project URL** e a **anon / publishable key**.
      ⚠️ **Nunca** me passe nem coloque no site a *service_role / secret key*.

### 4.2 Construção
- [ ] 🤖 Crio as tabelas (insumos, receitas, movimentações) com regras de acesso: só usuários logados leem e escrevem.
- [ ] 🤖 Crio a página `caramelloscookies.com.br/painel` com login por e-mail, mantendo as mesmas funções e contas já revisadas.
- [ ] 🤖 Copio para lá os insumos e as receitas do painel atual.
- [ ] 🧑‍💻 Em *Authentication → Users → Invite user*, convide a Irae (`contato@`) e quem mais for usar.
- [ ] 🧑‍💻🍪 Teste de ponta a ponta: login, registrar uma compra, registrar uma fornada, conferir o histórico.
- [ ] 🍪 A Irae confirma as estimativas da receita: estoque real, preços, rendimento, gás por receita, castanha dentro ou fora dos 80 g.

## Fase 5: Entrega para a empresa

- [ ] Em cada serviço, o **dono** é a empresa e você é **convidado**:

  | Serviço | Dono | Você |
  |---|---|---|
  | registro.br | titular Caramellos | contato técnico (opcional) |
  | Zoho | `admin@` | sem acesso, ou admin enquanto houver contrato |
  | GitHub | organização `caramellos` (`admin@`) | Owner convidado |
  | Netlify | equipe Caramellos (`admin@`) | membro convidado |
  | Supabase | organização Caramellos (`admin@`) | Developer/Admin convidado |
  | Bitwarden | `admin@` | sem acesso |

- [ ] Verificação em duas etapas ativa em **todas** as contas, no celular da Irae.
- [ ] Todas as senhas no Bitwarden; nenhuma enviada por WhatsApp.
- [ ] O painel antigo do claude.ai é desativado depois da migração.
- [ ] Treinamento com a Irae (30 min):
  - [ ] como mudar preço ou sabor (README → `js/dados.js` no GitHub)
  - [ ] como registrar compra e fornada no painel
  - [ ] como ler o e-mail `contato@` no app
- [ ] Contrato: domínio, código e dados são da empresa; definir se há suporte depois da entrega e por quanto tempo.
- [ ] Atualizar `contato@caramelloscookies.com.br` no Instagram (bio) e no WhatsApp Business.

---

## Ordem resumida

1. ⏳ A transição do domínio termina
2. TXT do Zoho → verificar → criar `admin@` e `contato@` → MX, SPF, DKIM e DMARC → testar o e-mail
3. Bitwarden (pode ser feito já, enquanto espera)
4. GitHub e Netlify (podem ser feitos já, com o Gmail; troca para `admin@` depois)
5. Dados reais no site → deploy → apontar o domínio → HTTPS
6. Supabase → migrar o painel → convidar usuários → testar
7. Entrega e treinamento
