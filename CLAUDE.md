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
