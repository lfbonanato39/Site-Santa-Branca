#!/bin/sh
# Build do site: monta a pasta dist/ só com o que é público.
# Usado pela Cloudflare Pages e, até a troca do domínio, também pela Vercel
# (buildCommand do vercel.json). Nome mantido porque é o que está no painel.
# Lista fechada de propósito: CLAUDE.md, STYLE_GUIDE.md, vercel.json e este
# script ficam fora do site. Página ou arquivo público novo na raiz: incluir aqui.
set -eu

rm -rf dist
mkdir dist
cp -R index.html privacidade.html termos.html 404.html \
      robots.txt sitemap.xml favicon.ico site.webmanifest _headers _redirects \
      assets dist/

# Na Vercel, _headers e _redirects seriam servidos como arquivos comuns
# (a Vercel usa o vercel.json). A Vercel define VERCEL=1 durante o build.
if [ -n "${VERCEL:-}" ]; then
  rm dist/_headers dist/_redirects
fi

echo "dist/ pronta: $(find dist -type f | wc -l) arquivos"
