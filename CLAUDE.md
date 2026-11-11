# Santa Branca Seguros — notas do projeto

Fonte da verdade visual e técnica: [STYLE_GUIDE.md](STYLE_GUIDE.md).

---

## Fluxo de trabalho

Repositório `github.com/lfbonanato39/Site-Santa-Branca`, branch `main`, ligada ao projeto Vercel `site-santa-branca` (todo push na `main` vira deploy de Produção em https://site-santa-branca.vercel.app).

- **Após concluir cada modificação:** commit com mensagem descritiva em português + push para a `main`.
- **Nunca fazer push com erro no console ou HTML inválido.** Antes do push:
  - HTML: `npx html-validate@11 --preset standard index.html privacidade.html termos.html` precisa terminar sem erros.
  - Console: abrir as três páginas num servidor local (`python -m http.server 8080`), rolar até o fim e confirmar zero erros e zero avisos.
- **Ao final, informar** o hash do commit e a URL para testar.

> **Nota:** quando o domínio santabranca.com.br apontar para a Vercel, essa regra muda: push em uma branch de teste (deploy de Preview) + revisão antes de ir para a `main`.

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
- **Fontes:** `assets/fonts/` (woff2 variável, só latin); preload só da Newsreader. Sem Google Fonts.
- **Ícones:** Phosphor Light em `<symbol>` no sprite do topo do `<body>` (`<i class="ph"><svg><use href="#ph-nome"/></svg></i>`). Ícone novo: copiar o SVG de `@phosphor-icons/core/assets/light/<nome>-light.svg` para o sprite.
- **Vídeo do hero:** fontes entram depois do `load`; celular usa `hero-bg-mobile.{webm,mp4}` (≤ 800 KB); Save-Data ou 2g/3g fica só o pôster WebP.
- **Imagens:** foto do escritório e logos PNG grandes com `srcset`/`sizes` em WebP.
