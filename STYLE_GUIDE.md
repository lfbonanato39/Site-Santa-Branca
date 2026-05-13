# Santa Branca Seguros — Style Guide

**Padrão visual:** Institucional Verde Mineiro (reforma 2026-05 — pré: Premium Editorial Cinematográfico)
**Referências:** wsj.com · ft.com · reuters.com · santabranca.com.br (marca histórica)
**Stack:** HTML/CSS/JS puro · Lenis · GSAP + ScrollTrigger (todos via CDN)

> Este arquivo é a fonte da verdade visual e técnica. Consulte antes de editar tokens, animações ou tipografia.

---

## 1. Paleta — Reforma Identidade Verde (2026-05)

Tokens canônicos em `:root` — sempre prefira `--color-*` em código novo. Os aliases legados (`--color-midnight`, `--color-cream`, `--color-champagne`, `--ink`, `--gold`, etc.) ficam rebound aos novos tokens para não quebrar o CSS pré-existente.

### Cores principais

| Token | Hex | Quando usar |
|---|---|---|
| `--color-forest-deep` | `#1B4D44` | Background verde principal (hero, footer, seções alternadas) — substitui o antigo midnight/navy |
| `--color-forest-medium` | `#2A5F55` | Hover de CTAs primárias, gradient stops, acentos médios |
| `--color-forest-soft` | `#3D7268` | Variação suave para tints internos |
| `--color-forest-darker` | `#143B34` | Hover/depth, máscaras de transição, gradient stops mais escuros |
| `--color-sage` | `#7A9690` | Acento sage stone — usado em `<em>` sobre fundo forest, divisores sobre dark |
| `--color-sage-light` | `#A3B8B3` | Texto secundário sobre forest, tickers do hero |
| `--color-papiro` | `#F5F1E8` | Background claro alternado (about, conteúdo editorial) — substitui cream |
| `--color-papiro-deep` | `#E8E1D0` | Cards lift, blocos editoriais, callouts |
| `--color-papiro-line` | `#D9D0BA` | Bordas finas sobre papiro |
| `--color-bronze` | `#A88B5A` | **Accent — uso parcimonioso.** Eyebrows sobre papiro, ornamentos íris (opacity 40%), `<em>` sobre papiro |
| `--color-bronze-deep` | `#8F7438` | Eyebrows seguradoras, `<em>` semibold sobre papiro |
| `--color-bronze-soft` | `#C4A87A` | Variação suave, gradient stops |
| `--color-text-on-forest` | `#F5F1E8` | Texto sobre fundo forest |
| `--color-text-on-forest-muted` | `#A3B8B3` | Eyebrows, captions, metadata sobre forest |
| `--color-text-on-papiro` | `#1A2826` | Texto principal sobre papiro |
| `--color-text-secondary` | `#4A5752` | Auxiliares neutros sobre papiro |

**Regra de ouro:** se uma cor não está nessa tabela, ela é tint/utility e existe só pra hierarquia interna. A paleta antiga (navy/cream/champagne dourado) foi descontinuada na reforma 2026-05.

---

## 2. Tipografia

| Token | Família | Pesos |
|---|---|---|
| `--font-serif` | **Newsreader**, Source Serif 4, Georgia, serif | 300, 400, 500, 600 (axis opsz 6..72) |
| `--font-sans` | **Inter**, -apple-system, system-ui, sans-serif | 400, 500, 600, 700 |
| `--font-display` | alias de `--font-serif` | — |

> Migração 2026-05: Newsreader (serifa institucional moderna, estilo WSJ/FT) substituiu Fraunces (editorial floreado).

**Aplicação:**
- `body` → `--font-sans`
- `h1, h2, h3, h4` → `--font-serif`
- Eyebrows / labels / botões → `--font-sans` (geralmente weight 500/600 + tracking elevado)
- `<em>` em headlines → **font-style: normal**, **font-weight: 600**, color bronze (sobre papiro) ou sage (sobre forest). Italic foi removido para reforço institucional. Letras-arquitetura (1994, III, XII) usam Newsreader Light 300 + bronze opacity 40%.

**Escala (clamp para fluido entre mobile e desktop):**

```css
--fs-display: clamp(64px, 9vw, 132px);  /* hero h1 */
--fs-h1:      clamp(40px, 5vw, 72px);
--fs-h2:      clamp(32px, 4vw, 56px);
--fs-h3:      2rem;
--fs-h4:      1.5rem;
--fs-lg:      1.25rem;
--fs-base:    1.0625rem;
--fs-sm:      0.9375rem;
--fs-xs:      0.8125rem;
```

**Line-height:**
- Headlines (`--lh-heading`): `1.1`
- Display ultra grande (`--lh-display`): `0.96`
- Corpo (`--lh-normal`): `1.6`
- Parágrafos longos (`--lh-relaxed`): `1.65`

---

## 3. Princípios de animação

1. **Duração curta na maioria dos casos.** Padrão entre 200–600ms. Reservar 800–1200ms apenas para entradas cinematográficas (loader, hero reveal). Tudo acima de 1.2s é exceção e precisa de justificativa.
2. **Easing padrão:** `power3.out` (GSAP) ou `cubic-bezier(0.16, 1, 0.3, 1)` (CSS). Saída rápida, chegada suave — nunca linear.
3. **Sempre respeitar `prefers-reduced-motion`.** Toda animação JS verifica `REDUCED_MOTION`. CSS usa `@media (prefers-reduced-motion: reduce)`. Quando ativo, animações se tornam instantâneas (sem fade, sem transform).
4. **Mobile usa animações reduzidas.** Custom cursor, parallax e particle effects ficam desktop-only (`min-width: 1025px` + `hover: hover`).
5. **Reveals via `[data-reveal]`.** Função `revealOnScroll()` aplica fade + translateY 24px → 0, duração 0.8s, easing `power3.out`, trigger em `top 85%`, sem reverter. Elementos irmãos com pai marcado `[data-reveal-stagger]` recebem stagger 0.1s. Delay individual via `[data-reveal-delay="<ms>"]`.
6. **Lenis dirige o ScrollTrigger.** Não tente sincronizar manualmente — o ticker GSAP já é alimentado pelo `lenis.raf`.

---

## 4. Princípios de design

- **Minimalismo intencional.** Cada elemento na tela precisa pagar aluguel. Espaço em branco é conteúdo.
- **Hierarquia editorial.** Tamanho > peso > cor. Headlines em serif Newsreader dão autoridade institucional; corpo em Inter conforta.
- **Espaço em branco generoso.** Padding mínimo de seção: `var(--sp-16)` (64px) mobile, `var(--sp-24)` (96px) desktop+. Containers respiram.
- **Champanhe é raro.** O accent dourado só aparece em divisores finos, eyebrows, hover de link âncora, selo do logo. Nunca em botões CTA grandes nem em backgrounds.
- **Fundo nunca é branco puro.** Sempre `--color-cream` ou `--color-midnight`. Branco puro (#FFF) é proibido em superfícies grandes.
- **Não há ornamentos sem propósito.** Nada de pulse rings, custom cursors, decorações invisíveis. Cada efeito visual responde a uma intenção (hierarquia, foco, transição).

---

## 5. Roadmap das 8 fases

| Fase | Status | Escopo |
|---|---|---|
| **1. Fundação** | ✅ Concluída | Paleta + tipografia + GSAP/ScrollTrigger/Lenis integrados + `revealOnScroll` + style guide |
| **2. Hero cinematográfico** | ✅ Concluída | Manifest split por palavra, timeline GSAP de entrada, count-up tickers, parallax+fade-out scrub |
| **3. Manifesto + Timeline da família** | ✅ Concluída | Curtain reveal cream, manifesto monumental com line split, grid 2-col com drop-cap, timeline horizontal pinned com 6 marcos |
| **4. Correção timeline + Quatro motivos** | ✅ Concluída | Timeline com nomes Washington/Rodrigo, seção Why tipográfica pura, headline com line split, hover refinado (linha 60→120px). Splitter `[data-split-lines]` extraído pra IIFE genérica reutilizável |
| **5. Coberturas** | ✅ Concluída | 6 cards uniformes editoriais sobre midnight, ícones Phosphor Light champagne, hover lift 2px + border opacity, "Também atendemos" inline tipográfico com pontos champagne, prompt WhatsApp italic |
| **6. Como funciona + Seguradoras** | ✅ Concluída | Process com 4 círculos numerados + linha conectora animada via scrub (horizontal desktop / vertical mobile, posicionada via JS com offsetLeft/Top). Insurers com 11 cards + slot "+você", spotlight via `:has()` no hover, tooltip flutuante com data-attributes, bottom-row detection automática, tap-to-reveal mobile. revealOnScroll passou a aceitar `data-reveal-stagger="<ms>"` para custom stagger |
| **7. Depoimentos + Localização + CTA Final** | ✅ Concluída | Nova seção `#depoimentos` com 10 cards reais em masonry CSS columns 1/2/3, avatares com iniciais, tag champagne pílula. `#localizacao` reescrita: midnight bg, mapa Google com filter invert+hue-rotate (escuro sem API key), info em 4 blocos editoriais com divisores 48px. `#contato` virou CTA cinematográfico midnight-deep, headline monumental clamp(3-6.5rem) com line split, botão WhatsApp cream com shine sweep ::before via transform translateX, ícones Phosphor Light (whatsapp-logo + clock) |
| **8. Polish, a11y, SEO & performance** | ✅ Concluída | Meta tags expandidas + JSON-LD com founder/identifier SUSEP. Critical CSS inline anti-FOUC com fade-in `body.is-ready`. Preconnect unpkg. Tooltip mobile com edge guard via `--tooltip-shift`. WhatsApp float circular 56px com Phosphor + pulse 3s scale 1→1.05. Páginas legais migradas pra paleta nova. Sitemap atualizado (lastmod 2026-05-08) |

**Regra de progressão:** fechamos uma fase com checklist verificada antes de abrir a próxima. Conteúdo de seções existentes só é tocado a partir da Fase 2.

---

## 6. TODOs pré-go-live (entregue ao cliente)

Itens que dependem de input/decisão do cliente antes do site ir pra produção:

- [ ] **Foto profissional do escritório** (vertical 3:4, ≥2400px) — substituir `assets/photo-office.{webp,jpg}`. Hoje a imagem provisória aparece no hero e no Sobre.
- [ ] **Foto da família/equipe** (P&B preferencial, três gerações) — para o Sobre, recolocar no lugar da foto provisória.
- [ ] **Validar nº SUSEP** (atualmente `10.0179680` — confirmar se está completo com dígito verificador)
- [ ] **Confirmar marcos da timeline** (datas e descrições de 1998, 2012, 2019; nomes Washington e Rodrigo já confirmados)
- [ ] **Substituir 10 depoimentos fictícios** por reais — pedir autorização LGPD de cada cliente para uso de nome real
- [ ] **Validar especialidades das 11 seguradoras** nos tooltips (descrições atuais são genéricas baseadas em conhecimento público)
- [ ] **Criar `og-image.jpg` 1200×630** (foto fachada com vitral + logo overlay + tagline)
- [ ] **Logos oficiais SVG das 11 seguradoras** (substituir nomes em texto pelos logos com `filter: grayscale` no estado base)
- [ ] **Revisar `privacidade.html` e `termos.html`** com advogado antes do go-live
- [ ] **GA4_ID, GADS_ID, META_PIXEL_ID** — colar IDs reais (atualmente placeholders `__GA4_ID__` etc.)
- [ ] **Token Google Search Console** — colar em `<meta name="google-site-verification">` (atualmente comentado no head)
