# Site Caramellos

Site institucional da Caramellos (cookies artesanais, Itaquera – ZL de São Paulo).
Endereço: https://caramelloscookies.com.br

É um site estático (HTML, CSS e JavaScript, sem banco de dados nem etapa de build).
Fica hospedado na Netlify, que publica sozinha cada alteração salva neste repositório.

## Como alterar o conteúdo (sem saber programar)

Quase tudo que muda no dia a dia fica num único arquivo: **`js/dados.js`**.

1. Abra o repositório no GitHub e clique em `js/dados.js`.
2. Clique no lápis (✏️ *Edit this file*).
3. Troque só o texto entre aspas ou os números. Não apague vírgulas, chaves `{ }` nem colchetes `[ ]`.
4. Clique em **Commit changes**. Em 1 ou 2 minutos o site está atualizado.

| O que mudar | Onde, dentro de `js/dados.js` |
|---|---|
| Número do WhatsApp | `contato.whatsapp`: só números, com 55 + DDD. Ex.: `"5511987654321"` |
| Preço de um sabor | `produtos` → `preco` (usado no "Monte seu pedido") **e** `precos` → `valor` (tabela) |
| Novo sabor | copie um bloco de `produtos` inteiro e altere |
| Combos e kits | `precos` → grupos "Combos" e "Kits" |
| Região, retirada e entrega | `locais` |
| Pontos de venda e feiras | `locais.pontosDeVenda` e `locais.eventos` |
| Depoimentos de clientes | `depoimentos`. Use só depoimentos reais, com autorização |

**Fotos:** envie a imagem para a pasta `img/` (botão *Add file → Upload files*) e use o caminho
no campo `foto`, por exemplo `"img/cookie-nutella.jpg"`. Prefira JPG com até 1200 px de largura.

Se algo der errado, o GitHub guarda o histórico: abra o arquivo, clique em **History** e volte à versão anterior.

## Estrutura

```
index.html          página do site
css/estilo.css      visual (cores da marca no topo do arquivo)
js/dados.js         conteúdo editável (preços, sabores, contato…)
js/app.js           monta as seções a partir de dados.js
img/                fotos
img/marca/          logo, mascote e selo em SVG (vetor, arquivos oficiais)
netlify.toml        configuração da hospedagem
```

Para ver o site no computador: na pasta do projeto, rode `python3 -m http.server` e abra http://localhost:8000.

## Contas e acessos

Todas as contas estão em nome da empresa, com o e-mail corporativo como dono.
O desenvolvedor tem acesso de administrador convidado e pode ser removido a qualquer momento.

| Serviço | Para quê | Dono |
|---|---|---|
| registro.br | domínio e DNS | Caramellos |
| E-mail corporativo | `@caramelloscookies.com.br` | Caramellos |
| GitHub | código do site | organização da Caramellos |
| Netlify | hospedagem | equipe da Caramellos |
| Supabase | banco e login do painel de estoque | organização da Caramellos |

Senhas ficam no gerenciador de senhas da empresa, com verificação em duas etapas ativada em todas as contas.
