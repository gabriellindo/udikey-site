# udikey-site

Site público do UDIkey (**udikey.com**). Projeto SEPARADO do painel admin
(`painel-udikey`, que fica em admin.udikey.com) e do app (`chave-ja`).

## O que é
Site estático (HTML + CSS, sem build) hospedado na Vercel. Serve a landing
institucional e as páginas legais. É a base para crescer num site completo,
estilo iFood/Uber.

## Páginas
- `/` — landing (index.html): hero, como funciona, serviços, para chaveiros, CTA.
- `/privacidade` — Política de Privacidade (privacidade.html). URL usada na Play Store.
- `/termos` — Termos de Uso, cliente e chaveiro (termos.html).
- `style.css` — design system (escuro + dourado, igual ao app).
- `vercel.json` — cleanUrls (URLs sem .html) + headers.
- `robots.txt`, `sitemap.xml` — SEO (o site é indexável, ao contrário do painel).

## Como editar
É HTML puro. Abra os arquivos, edite o conteúdo e faça commit. A Vercel publica
sozinha a cada push na branch `main`.

## Deploy
- Projeto Vercel próprio (não é o painel-udikey).
- Domínio `udikey.com` apontado aqui (DNS no Hostinger: A @ -> Vercel).
- Sem build: framework preset "Other", output é a própria raiz.

## Evoluir para um site dinâmico
Quando quiser um site com áreas dinâmicas (login web, painel do cliente, etc.),
dá para migrar para Next.js dentro deste mesmo repositório/projeto, mantendo o
domínio. O conteúdo atual serve de base visual.
