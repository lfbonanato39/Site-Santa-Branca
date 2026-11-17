#!/usr/bin/env bash
# Confere redirecionamentos, cabeçalhos e 404 de um endereço da Cloudflare Pages.
# Uso: bash tools/cf-test.sh [URL-base]   (padrão: wrangler pages dev em http://127.0.0.1:8788;
#      depois da troca do domínio: bash tools/cf-test.sh https://santabranca.com.br)
B=${1:-http://127.0.0.1:8788}
for i in $(seq 1 60); do curl -s -o /dev/null "$B/" && break; sleep 1; done
row() { # caminho -> status, location, cache-control
  local out
  out=$(curl -s -o /dev/null -D - "$B$1")
  local st loc cc
  st=$(printf '%s' "$out" | head -1 | awk '{print $2}')
  loc=$(printf '%s' "$out" | grep -i '^location:' | tr -d '\r' | cut -d' ' -f2-)
  cc=$(printf '%s' "$out" | grep -i '^cache-control:' | tr -d '\r' | cut -d' ' -f2-)
  printf '%-40s %s  %-14s %s\n' "$1" "$st" "${loc:--}" "${cc:--}"
}
printf '%-40s %s  %-14s %s\n' CAMINHO ST LOCATION CACHE-CONTROL
for p in / /index.html /index.php /privacidade /privacidade.html /privacidade/ /termos /termos.html \
         /404 /nao-existe /pasta/que/nao/existe /CLAUDE.md /vercel.json /cloudflare-build.sh /_headers /_redirects \
         /sitemap.xml /robots.txt /assets/fonts/newsreader-latin.woff2 /assets/js/vendor/; do
  row "$p"
done
echo; echo '--- cabeçalhos de segurança em / ---'
curl -s -o /dev/null -D - "$B/" | grep -iE '^(x-content-type|x-frame|referrer-policy|permissions-policy|strict-transport|x-robots)' | tr -d '\r'
echo; echo '--- 404 serve a página nova? ---'
curl -s "$B/pasta/que/nao/existe" | grep -o '<title>[^<]*</title>'
