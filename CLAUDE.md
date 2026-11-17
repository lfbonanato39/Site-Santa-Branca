# Santa Branca Seguros — notas do projeto

Fonte da verdade visual e técnica: [STYLE_GUIDE.md](STYLE_GUIDE.md).

---

## Fluxo de trabalho

Repositório `github.com/lfbonanato39/Site-Santa-Branca`, publicado na **Cloudflare Pages** (projeto `site-santa-branca`, plano gratuito):

- push na `main` = deploy de **Produção**: https://santabranca.com.br (e `https://site-santa-branca.pages.dev`, com noindex);
- push em qualquer outra branch = deploy de **Preview**: `https://<branch>.site-santa-branca.pages.dev`, com noindex.

**Nada vai direto para a `main`.** Desde a troca do domínio (17/11/2026), toda mudança segue estes passos:

1. Criar uma branch de teste a partir da `main` atualizada (`git fetch` e `git checkout -b <branch> origin/main`). O nome vira o endereço do Preview: curto, em minúsculas e com hífens (ex.: `ajuste-rodape`). A Cloudflare troca outros caracteres por hífen e corta o nome em 28 caracteres.
2. Fazer a mudança e o commit, com mensagem descritiva em português.
3. Rodar `node tools/precheck.mjs` (na primeira vez, `cd tools && npm install`; usa o Chrome instalado). Precisa terminar com `RESULTADO: OK PARA PUSH`. **Nunca fazer push, em nenhuma branch, com erro no console ou HTML inválido.** Ele faz as duas checagens:
   - HTML: `html-validate` (preset standard) em `index.html`, `privacidade.html`, `termos.html` e `404.html`, sem erros.
   - Console: abre as quatro páginas num servidor local próprio, em 390 px e 1440 px, rola até o fim e exige zero erros, zero avisos e nenhuma requisição falhando.
4. Push da branch de teste.
5. Informar ao usuário o hash do commit, o nome da branch e a URL do Preview.
6. O usuário revisa o Preview. Só depois da aprovação dele a branch entra na `main` (merge e push, com o precheck rodado de novo antes desse push).

A Vercel (projeto `site-santa-branca`, https://site-santa-branca.vercel.app) não atende mais o domínio, mas ainda publica a cada push até ser apagada (ver "Estado atual e pendências"). Até lá, ela roda o mesmo `cloudflare-build.sh` e publica só a `dist/` (`buildCommand` e `outputDirectory` no `vercel.json`), e o `vercel.json` repete os cabeçalhos do `_headers` (menos a regra de noindex do `pages.dev`, que só existe na Cloudflare).

`tools/` guarda as ferramentas locais (checagem, teste da Cloudflare, fonte da imagem de compartilhamento). Não vai para o site publicado.

## Estado atual e pendências (17/11/2026)

Site feito pela agência Foco 9 para a Santa Branca Seguros. O **Rodrigo** (Santa Branca) aprova textos e informações: mudança de texto relevante vai com tabela antes/depois para ele.

**Aguardando o Rodrigo (não mexer até ele responder):**

- **Motivo 02 ("Atendimento humano")**: já reescrito para "falar com uma pessoa é sempre a primeira opção", porque o antigo "sem chatbot, sem URA" conflitava com o menu do WhatsApp previsto para dezembro. Esperar o retorno antes de mexer de novo.
- **Bloco III do Sobre.**
- **Data de 2012 na timeline.** A entrada do Rodrigo em 2001 já está confirmada.
- **Card Seguro de Vida**: voltou ao texto anterior, sem citar "invalidez e doenças graves", até ele confirmar as coberturas.

**Hospedagem:** desde 17/11/2026 (por volta das 19h40), https://santabranca.com.br está no ar pela Cloudflare Pages. Configuração em "Cloudflare (configuração atual)". Conferido depois da troca: home 200, www e http redirecionando, `/index.php` → `/`, 404 com noindex, canonical e imagem de compartilhamento certos, HSTS presente, sem X-Robots-Tag no domínio principal, e-mail funcionando e prévia do WhatsApp ok.

Próximos passos, nesta ordem:

1. **Vercel:** continua publicando, mas será apagada a partir de 01/12/2026. Só apagar quando o usuário avisar.
2. **Cópia do site antigo:** depois que a Vercel for apagada, baixar pelo painel da Task a cópia do site antigo (Apache/PHP).
3. **Task:** em seguida, o Rodrigo cancela os dois planos da Task.
4. **DNS:** depois do cancelamento, apagar na Cloudflare os CNAMEs da Task e tirar o include da Task do SPF (ver "Cloudflare (configuração atual)").

**Outras pendências:**

- Itens que dependem do cliente: "TODOs pré-go-live" no STYLE_GUIDE.md (fotos, SUSEP, IDs de GA4/Google Ads/Meta Pixel, Search Console, revisão jurídica).

**Decisões já tomadas:**

- HSTS com `includeSubDomains; preload` fica, e vem só do `_headers`: o HSTS do painel da Cloudflare fica desligado. Os CNAMEs que sobraram da Task (imap, mail, pop, pop3, smtp, webmail) não são usados no navegador; o e-mail é Google.
- URLs limpas nas duas hospedagens (`/privacidade`, `/termos`) e domínio oficial sem www.

## Textos (regras do cliente)

- Zero travessões (— ou –) e zero " - " como pausa: trocar por ponto, vírgula ou dois-pontos. Única exceção: o título da timeline "1994 — 2026".
- Escrever como o Rodrigo explicaria a um cliente: frases curtas, concretas, tom próximo ("você"). Nada com cara de texto de IA.
- Manter os fatos e a frase "Aqui ninguém se aposenta da relação com o cliente".
- Reescrita não acrescenta informação nova (cobertura, prazo, número, promessa). Na dúvida, perguntar.
- Alcance: sede em Belo Horizonte, clientes em todo o Brasil. Não restringir a Minas Gerais.
- Números: "+1.000 Clientes atendidos" (não "famílias") e 12 seguradoras. Mudou um número, mudar em todos os lugares (textos, Termos, Privacidade, meta description).
- Título e descrição (`<title>`, meta description, as versões `og:` e `twitter:` e, só a descrição, o `description` dos dados estruturados): "Santa Branca Seguros | Corretora familiar desde 1994" e "Corretora familiar desde 1994, com clientes em todo o Brasil. Seguro auto, residencial, vida e empresarial com 12 seguradoras e atendimento humano." Manter até ~60 e ~160 caracteres.

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
- **`_headers`**: cabeçalhos de segurança em todas as respostas, cache de 1 ano em `/assets/*`, `max-age=0` nas páginas, 1 h no sitemap e no robots, noindex em `site-santa-branca.pages.dev`. Os outros endereços `*.site-santa-branca.pages.dev` (Previews de branch e o endereço com hash de cada deploy, inclusive os de produção) já recebem noindex automático da Cloudflare, por isso não têm regra aqui. Conferido em 17/11/2026. Página nova: incluir a regra de cache aqui e no `vercel.json`.
- **`_redirects`**: `/index.php` e `/index.html` → `/` (301), endereços do site antigo.
- **URLs limpas** são automáticas: `/privacidade.html` → 308 `/privacidade` (a Vercel faz igual com `cleanUrls: true`). Links internos sempre sem `.html`: `/`, `/privacidade`, `/termos`.
- **`404.html`** é servida em qualquer endereço inexistente, então usa caminhos absolutos (`/assets/...`).
- **www → sem www** não cabe no `_redirects` (ele só enxerga o caminho): é uma Redirect Rule no painel da zona (ver "Cloudflare (configuração atual)"). Domínio oficial, sem www: `https://santabranca.com.br` em canonical, sitemap, robots, Open Graph e dados estruturados.
- **Teste local fiel à Cloudflare:** `sh cloudflare-build.sh && npx wrangler@4 pages dev dist` (http://localhost:8788) e, em outro terminal, `bash tools/cf-test.sh` (tabela de status, redirecionamentos, cache, cabeçalhos e 404). O `python -m http.server` não faz URLs limpas nem lê `_headers`/`_redirects`: nele, `/privacidade` e `/termos` dão 404.
- **Teste de um endereço publicado:** `bash tools/cf-test.sh https://santabranca.com.br` (produção) ou `bash tools/cf-test.sh https://<branch>.site-santa-branca.pages.dev` (Preview: a lista de cabeçalhos tem que mostrar `x-robots-tag: noindex`).

## Cloudflare (configuração atual)

Zona `santabranca.com.br`, plano Free, no ar desde 17/11/2026. Mudou algo no painel, atualizar aqui.

- **Nameservers** (definidos no Registro.br): `ethan.ns.cloudflare.com` e `mallory.ns.cloudflare.com`.
- **DNS:**
  - `@` (santabranca.com.br): CNAME para `site-santa-branca.pages.dev`, Proxied. É o custom domain do projeto Pages.
  - `www`: CNAME para `santabranca.com.br`, Proxied. Só existe para o redirecionamento abaixo.
  - MX do Google (e-mail): intactos. Não mexer.
  - CNAMEs da Task (imap, mail, pop, pop3, smtp, webmail) e o include da Task no SPF: ficam até o cancelamento da Task. Depois, apagar.
  - O CNAME `ftp` foi apagado.
- **Redirect Rule "www para o site principal":** `https://www.*` → `https://${1}`, 301, Preserve query string ligado. Ex.: `https://www.santabranca.com.br/termos?v=1` → `https://santabranca.com.br/termos?v=1`.
- **SSL/TLS:** Always Use HTTPS e Automatic HTTPS Rewrites ligados. O HSTS vem do `_headers` (`max-age=63072000; includeSubDomains; preload`). **Não ligar o HSTS do painel.**
- **Conferir depois de mexer no painel ou no `_headers`:**
  - `bash tools/cf-test.sh https://santabranca.com.br`
  - `https://www.santabranca.com.br/termos?v=1` → 301 para `https://santabranca.com.br/termos?v=1`, e `http://` → `https://`
  - e-mail chegando e saindo (MX) e prévia do link no WhatsApp

**Em aberto (decisão do usuário, levantado em 17/11/2026):**

- **Ofuscação de e-mail** (Email Address Obfuscation, do Scrape Shield; vem ligada por padrão na zona): em produção, a Cloudflare troca os links `mailto:` da home, da Privacidade e dos Termos por `/cdn-cgi/l/email-protection#…`, mostra `[email protected]` no lugar do endereço e injeta o script `email-decode.min.js`. Sem JS, o e-mail não aparece. Isso não acontece nos Previews nem no precheck, só no domínio.
- **Browser Cache TTL** no padrão da zona (4 h): por isso o `robots.txt` sai com `max-age=14400`, e não com o 3600 do `_headers`. O sitemap não é afetado. Para valer o `_headers`: Caching → Configuration → Browser Cache TTL → Respect Existing Headers.
- **Content-Security-Policy:** o site não tem. Avaliação entregue ao usuário, sem decisão ainda. Não ativar o rascunho comentado no `<head>` do `index.html`: está desatualizado (tem `frame-src` para um iframe do Google que não existe e não cobre os endereços que o GA4 e o Google Ads usam).

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
- Validar com o Hey Meta (heymeta.com, aba WhatsApp). Enquanto a imagem nova está só no Preview, o endereço de `og:image` (santabranca.com.br) dá 404 lá. Para simular, trocar no próprio validador o campo da imagem pela cópia em `https://<branch>.site-santa-branca.pages.dev/assets/...`.
- WhatsApp e Facebook guardam a prévia do link por dias: depois que a imagem nova (ou um título ou descrição novos) entrar na `main`, forçar nova leitura no Depurador de Compartilhamento do Facebook (developers.facebook.com/tools/debug).

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
