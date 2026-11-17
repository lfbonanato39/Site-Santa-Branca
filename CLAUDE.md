# Santa Branca Seguros — notas do projeto

Fonte da verdade visual e técnica: [STYLE_GUIDE.md](STYLE_GUIDE.md).

---

## Fluxo de trabalho

Repositório `github.com/lfbonanato39/Site-Santa-Branca`, branch `main`, publicado na **Cloudflare Pages** (plano gratuito):

- push na `main` = deploy de **Produção** (`https://<projeto>.pages.dev` e, depois da troca do domínio, https://santabranca.com.br);
- push em qualquer outra branch = deploy de **Preview** (`https://<branch>.<projeto>.pages.dev`, com noindex automático).

A Vercel (projeto `site-santa-branca`, https://site-santa-branca.vercel.app) continua no ar até o domínio virar. Enquanto isso, ela roda o mesmo `cloudflare-build.sh` e publica só a `dist/` (`buildCommand` e `outputDirectory` no `vercel.json`), e o `vercel.json` fica igual ao `_headers`.

- **Após concluir cada modificação:** commit com mensagem descritiva em português + push para a `main`.
- **Nunca fazer push com erro no console ou HTML inválido.** Antes do push, rodar `node tools/precheck.mjs` (na primeira vez, `cd tools && npm install`; usa o Chrome instalado). Precisa terminar com `RESULTADO: OK PARA PUSH`. Ele faz as duas checagens:
  - HTML: `html-validate` (preset standard) em `index.html`, `privacidade.html`, `termos.html` e `404.html`, sem erros.
  - Console: abre as quatro páginas num servidor local próprio, em 390 px e 1440 px, rola até o fim e exige zero erros, zero avisos e nenhuma requisição falhando.
- **Ao final, informar** o hash do commit e a URL para testar.

> **Nota:** quando o domínio santabranca.com.br apontar para a Cloudflare Pages, essa regra muda: push em uma branch de teste (deploy de Preview) + revisão antes de ir para a `main`.

`tools/` guarda as ferramentas locais (checagem, teste da Cloudflare, fonte da imagem de compartilhamento). Não vai para o site publicado.

## Estado atual e pendências (17/11/2026)

Site feito pela agência Foco 9 para a Santa Branca Seguros. O **Rodrigo** (Santa Branca) aprova textos e informações: mudança de texto relevante vai com tabela antes/depois para ele.

**Aguardando o Rodrigo (não mexer até ele responder):**

- **Motivo 02 ("Atendimento humano")**: já reescrito para "falar com uma pessoa é sempre a primeira opção", porque o antigo "sem chatbot, sem URA" conflitava com o menu do WhatsApp previsto para dezembro. Esperar o retorno antes de mexer de novo.
- **Bloco III do Sobre.**
- **Data de 2012 na timeline.** A entrada do Rodrigo em 2001 já está confirmada.
- **Card Seguro de Vida**: voltou ao texto anterior, sem citar "invalidez e doenças graves", até ele confirmar as coberturas.

**Hospedagem:** tudo pronto para a Cloudflare Pages, mas o domínio ainda aponta para o site antigo (Apache/PHP, hospedagem da Task). Não desligar nada na Vercel até a troca. Passo a passo em "Troca do domínio".

**Outras pendências:**

- A `description` dos dados estruturados (JSON-LD) ainda tem o texto antigo. Foi oferecido alinhar com a meta description nova; sem resposta ainda.
- Itens que dependem do cliente: "TODOs pré-go-live" no STYLE_GUIDE.md (fotos, SUSEP, IDs de GA4/Google Ads/Meta Pixel, Search Console, revisão jurídica).

**Decisões já tomadas:**

- HSTS com `includeSubDomains; preload` fica. Os subdomínios existentes (mail, smtp, imap, pop, webmail, stat) são da hospedagem antiga e não são usados no navegador; o e-mail é Google.
- URLs limpas nas duas hospedagens (`/privacidade`, `/termos`) e domínio oficial sem www.

## Textos (regras do cliente)

- Zero travessões (— ou –) e zero " - " como pausa: trocar por ponto, vírgula ou dois-pontos. Única exceção: o título da timeline "1994 — 2026".
- Escrever como o Rodrigo explicaria a um cliente: frases curtas, concretas, tom próximo ("você"). Nada com cara de texto de IA.
- Manter os fatos e a frase "Aqui ninguém se aposenta da relação com o cliente".
- Reescrita não acrescenta informação nova (cobertura, prazo, número, promessa). Na dúvida, perguntar.
- Alcance: sede em Belo Horizonte, clientes em todo o Brasil. Não restringir a Minas Gerais.
- Números: "+1.000 Clientes atendidos" (não "famílias") e 12 seguradoras. Mudou um número, mudar em todos os lugares (textos, Termos, Privacidade, meta description).
- Título e descrição (`<title>`, meta description e as versões `og:` e `twitter:`): "Santa Branca Seguros | Corretora familiar desde 1994" e "Corretora familiar desde 1994, com clientes em todo o Brasil. Seguro auto, residencial, vida e empresarial com 12 seguradoras e atendimento humano." Manter até ~60 e ~160 caracteres.

## Dados oficiais da empresa

| Dado | Valor |
|---|---|
| Razão social | Santa Branca Adm e Corretora de Seguros Ltda |
| CNPJ | 00.361.719/0001-58 |
| SUSEP | 10.0179680 (dígito ainda a confirmar com o cliente) |
| Endereço | Av. Cônsul Antônio Cadar, 126, 2º andar, Loja 89, Center São Bento, Belo Horizonte/MG |
| CEP | 30360-000 |
| WhatsApp (ação principal do site) | +55 31 98726-3411, `https://wa.me/5531987263411` |
| Telefone fixo | +55 31 3309-5558 |
| E-mail | santabranca@santabranca.com.br |
| Fundação | 1994 (Washington); Rodrigo entrou em 2001 |
| Seguradoras (12) | Porto Seguro, Allianz, Zurich, Liberty, SulAmérica, HDI, Tokio Marine, Itaú, MetLife, Chubb, AIG, Assist Card |

Esses dados aparecem em `index.html` (textos e JSON-LD), `privacidade.html` e `termos.html`: mudou um, mudar em todos.

## Deploy (Cloudflare Pages)

Configuração do projeto no painel (Settings → Build):

| Campo | Valor |
|---|---|
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `sh cloudflare-build.sh` |
| Build output directory | `dist` |
| Root directory | vazio |

- **`cloudflare-build.sh`** copia para `dist/` só o que é público (lista fechada). Página ou arquivo público novo na raiz precisa entrar na lista; `assets/` vai inteira. `CLAUDE.md`, `STYLE_GUIDE.md`, `vercel.json` e o próprio script ficam fora do ar. Na Vercel (variável `VERCEL=1`), o script tira também `_headers` e `_redirects`, que lá seriam servidos como arquivos comuns.
- **`_headers`**: cabeçalhos de segurança em todas as respostas, cache de 1 ano em `/assets/*`, `max-age=0` nas páginas, 1 h no sitemap e no robots, noindex no `*.pages.dev`. Página nova: incluir a regra de cache aqui e no `vercel.json`.
- **`_redirects`**: `/index.php` e `/index.html` → `/` (301), endereços do site antigo.
- **URLs limpas** são automáticas: `/privacidade.html` → 308 `/privacidade` (a Vercel faz igual com `cleanUrls: true`). Links internos sempre sem `.html`: `/`, `/privacidade`, `/termos`.
- **`404.html`** é servida em qualquer endereço inexistente, então usa caminhos absolutos (`/assets/...`).
- **www → sem www** não cabe no `_redirects` (ele só enxerga o caminho): é uma Redirect Rule no painel da zona santabranca.com.br. Domínio oficial, sem www: `https://santabranca.com.br` em canonical, sitemap, robots, Open Graph e dados estruturados.
- **Teste local fiel à Cloudflare:** `sh cloudflare-build.sh && npx wrangler@4 pages dev dist` (http://localhost:8788) e, em outro terminal, `bash tools/cf-test.sh` (tabela de status, redirecionamentos, cache, cabeçalhos e 404). O `python -m http.server` não faz URLs limpas nem lê `_headers`/`_redirects`: nele, `/privacidade` e `/termos` dão 404.

## Troca do domínio (passo a passo)

1. Conectar o repositório: Workers & Pages → Create → aba **Pages** → Connect to Git → `lfbonanato39/Site-Santa-Branca`, com os campos da tabela acima. Nome sugerido do projeto: `site-santa-branca` (vira `site-santa-branca.pages.dev`).
2. Add a domain → `santabranca.com.br` → plano Free. Antes de trocar os nameservers no Registro.br, conferir se os registros MX e TXT do Google (e-mail) foram importados.
3. Projeto Pages → Custom domains → `santabranca.com.br`.
4. DNS → registro CNAME `www` → `santabranca.com.br`, Proxied (nuvem laranja).
5. Rules → Redirect Rules: Hostname equals `www.santabranca.com.br` → URL redirect, tipo Dynamic, `concat("https://santabranca.com.br", http.request.uri.path)`, 301, Preserve query string ligado.
6. SSL/TLS → Edge Certificates → Always Use HTTPS ligado.
7. Conferir:
   - `bash tools/cf-test.sh https://santabranca.com.br`
   - `https://www.santabranca.com.br/termos` → 301 para `https://santabranca.com.br/termos`
   - prévia do link no Hey Meta (heymeta.com) sem editar nada, e nova leitura no Depurador de Compartilhamento do Facebook
   - PageSpeed no celular (meta na seção Performance)
8. A partir daí vale a regra de branch de teste + revisão antes da `main`. Desligar a Vercel só quando o usuário decidir.

---

## Links externos — SuperCálculo

Formulários de cotação online (SuperCálculo, domínio `formularioweb.com.br`). São ação **secundária**: o WhatsApp continua sendo a ação principal do site.

| Ramo | Link | `data-cotacao-ramo` |
|---|---|---|
| Auto | https://formularioweb.com.br/34b07SANTA | `auto` |
| Residência | https://formularioweb.com.br/b47c6SANTA | `residencia` |
| Vida | https://formularioweb.com.br/9bbccSANTA | `vida` |

**Onde aparecem (`index.html`):**

- **`#seguros`**: link "Cotação online ↗" abaixo de "Ver detalhes" nos cards Seguro Auto, Seguro Residencial e Seguro de Vida (`.sb-coverage-card__quote`, `data-cotacao-origem="card"`).
  - Os 6 cards têm o grupo `.sb-coverage-card__actions`, preso na base do card e com a 2ª linha (44px) reservada mesmo sem cotação. É isso que mantém "Ver detalhes" na mesma altura em cards lado a lado.
  - "Ver detalhes" deixa o card inteiro clicável via `::after` esticado; "Cotação online" fica acima dele com `position: relative; z-index: 1`. Não colocar `position` no grupo de ações, senão o `::after` deixa de cobrir o card.
- **`#contato`**: bloco "Prefere preencher?" abaixo do CTA do WhatsApp e do "Prefere ligar?", com links Auto · Residência · Vida (`.sb-contact__quote`, `data-cotacao-origem="contato"`).

Todos abrem em nova aba (`target="_blank" rel="noopener noreferrer"`). Não usar iframe.

**Rastreio:** evento GA4 `cotacao_online_click`, parâmetros `ramo` (`auto` | `residencia` | `vida`) e `origem` (`card` | `contato`).

- Um listener de clique delegado no `document` lê os data-attributes (bloco "COTAÇÃO ONLINE" no script inline do fim de `index.html`).
- Só envia com consentimento `measure` ou `all` (banner LGPD, chave `sb_cookie_consent_v1`) e com `gtag` carregado. Sem isso, não faz nada e não gera erro.
- Para `ramo` e `origem` aparecerem nos relatórios do GA4, registrar os dois como dimensões personalizadas (escopo: evento).

Ao trocar um link, atualizar os dois lugares (card e contato) e esta tabela.

## Outros links externos

| Link | Onde aparece |
|---|---|
| Tabela FIPE: https://veiculos.fipe.org.br/ | Card Seguro Auto (`.sb-coverage-card__fipe`, fora do grupo de ações) e rodapé ("Links úteis") |
| Estrada Real: https://institutoestradareal.com.br/ | Rodapé, coluna da marca (`.sb-footer__seal`, imagem `assets/estradareal.png` 50×65, não exibir maior) |

Todos abrem em nova aba (`target="_blank" rel="noopener noreferrer"`).

## Imagem de compartilhamento (Open Graph)

`assets/og-image-v2.jpg`, 1200×630, JPEG de ~70 KB (WhatsApp ignora imagens grandes demais: manter abaixo de 300 KB). Usada em `og:image`, `twitter:image` e no `image` dos dados estruturados de `index.html`, com `og:image:alt` e `twitter:image:alt`.

- Ao refazer: salvar com **nome novo** (`og-image-v3.jpg`…), porque `/assets/` tem cache `immutable` de 1 ano, e trocar os três lugares.
- Fonte da imagem: `tools/og-image.html` (fontes, cores e logo do site). Gerar: `node tools/render-og.mjs assets/og-image-v3.jpg`. Conferir a leitura no tamanho da prévia do WhatsApp (~330 px de largura): textos menores que ~29 px na imagem somem.
- Validar com o Hey Meta (heymeta.com, aba WhatsApp). Antes da troca do domínio a imagem dá 404 lá, porque o endereço aponta para santabranca.com.br. Para simular, trocar no próprio validador o campo da imagem pela cópia em `site-santa-branca.vercel.app`.
- WhatsApp e Facebook guardam a prévia do link por dias: depois da troca, forçar nova leitura no Depurador de Compartilhamento do Facebook (developers.facebook.com/tools/debug).

## Depoimentos (avaliações do Google)

Seção `#depoimentos` com 13 avaliações reais do Google, todas 5 estrelas. Perfil: https://maps.google.com/?cid=14581381387190124280 (link "Nota 5,0 no Google · Ver todas as avaliações" no fim da seção).

- **Texto literal.** Não corrigir nem reescrever; "[…]" marca corte. Única exceção autorizada: a do Raphael L. (correção de digitação já aplicada). Sem "cliente desde", tipo de seguro ou data.
- **Nome:** primeiro nome + inicial do sobrenome (ex.: "Andressa D.").
- **Cor do avatar:** fixa por pessoa. Classe `sb-review--cN`, com N = (soma dos códigos das letras do nome em minúsculas, sem acento) mod 8 + 1. Paleta em `.sb-review--c1` a `--c8` (contraste com branco ≥ 5,9:1).
- **Foto opcional:** salvar `assets/depoimentos/<nome>.webp` (ex.: `andressa-d.webp`, 80×80) e adicionar `data-foto="assets/depoimentos/andressa-d.webp"` no `.sb-review__avatar`. Sem o atributo, aparece a inicial. Não baixar nem linkar fotos de perfil do Google.
- Celular: carrossel com altura acompanhando o card visível (`initCarousel(..., { autoHeight: true })`). Desktop: mural em colunas.

## Performance (não desfazer sem medir)

Meta no celular: PageSpeed Performance ≥ 90, LCP < 2,5 s, página < 1,5 MB. Medir com 3 rodadas e usar a mediana (o PageSpeed reaproveita a análise da mesma URL por alguns minutos: use `?psi=<algo>` para forçar análise nova).

- **Nada fica invisível esperando JS.** O hero (texto = LCP) aparece no primeiro quadro; com `html.js-on` ele nasce deslocado e o GSAP anima só o `y`. Títulos `[data-split-lines]`, a cortina do Sobre e o loader só se escondem com `.js-on`. Sem JS o site fica 100% legível.
- **Loader:** só no desktop, 300 ms + 300 ms de fade, controlado por script inline logo após `#sb-loader`.
- **Bibliotecas JS:** GSAP 3.12.5, ScrollTrigger 3.12.5 e Lenis 1.1.20 em `assets/js/vendor/`, com a versão no nome do arquivo (cache `immutable` de 1 ano pela regra `/assets/*` do `_headers` e do `vercel.json`). Nenhuma CDN. Ao atualizar, baixar o arquivo do npm, conferir o hash e trocar o nome.
- **Fontes:** `assets/fonts/` (woff2 variável, só latin); preload só da Newsreader. Sem Google Fonts.
- **Ícones:** Phosphor Light em `<symbol>` no sprite do topo do `<body>` (`<i class="ph"><svg><use href="#ph-nome"/></svg></i>`). Ícone novo: copiar o SVG de `@phosphor-icons/core/assets/light/<nome>-light.svg` para o sprite.
- **Vídeo do hero:** fontes entram depois do `load`; celular usa `hero-bg-mobile.{webm,mp4}` (≤ 800 KB); Save-Data ou 2g/3g fica só o pôster WebP.
- **Imagens:** foto do escritório e logos PNG grandes com `srcset`/`sizes` em WebP.
