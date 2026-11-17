#!/bin/sh
# Build da Cloudflare Pages: monta a pasta dist/ só com o que é público.
# Lista fechada de propósito: CLAUDE.md, STYLE_GUIDE.md, vercel.json e este
# script ficam fora do site. Página ou arquivo público novo na raiz: incluir aqui.
set -eu

rm -rf dist
mkdir dist
cp -R index.html privacidade.html termos.html 404.html \
      robots.txt sitemap.xml _headers _redirects \
      assets dist/

echo "dist/ pronta: $(find dist -type f | wc -l) arquivos"
