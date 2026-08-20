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

## ⚠️ Os links de divulgação moram aqui também

`udikey.com/bio`, `udikey.com/tiktok-ana` e qualquer outro apelido que não seja
uma página deste site **são repassados pro painel**, pra `admin.udikey.com/i/<apelido>`.
Quem cria e administra esses apelidos é o painel, na seção Divulgação > Links;
aqui só existe a regra de repasse, no `vercel.json`.

É repasse (`rewrites`), não desvio (`redirects`), de propósito: o endereço
continua sendo udikey.com no navegador do começo ao fim. É o que o link precisa
ser pra caber numa bio de Instagram sem parecer endereço de painel de
administração.

**Medido em 20/08/2026, antes de escolher este caminho:** o IP real de quem
clicou sobrevive ao repasse (`x-real-ip` chega no painel igual ao de um acesso
direto), e a cidade e o user-agent também. Isso era condição pra tudo: o painel
liga clique e instalação por uma impressão feita a partir do IP, e se todo
clique chegasse lá com o IP do repassador, qualquer instalação casaria com
qualquer clique recente. Seria medir errado, não medir menos.

### Duas coisas que quebram sem avisar se alguém mexer aqui

**1. A lista de nomes reservados tem uma gêmea.** O padrão do repasse exclui
`privacidade`, `termos`, `servico`, `reset-callback` e companhia, pra elas
continuarem sendo páginas deste site. A mesma lista existe no painel
(`lib/links.ts`, constante `RESERVADOS`), pra ele recusar criar um link com
esses nomes. **Mexeu numa, mexa na outra.** Fora de sincronia, o sintoma é um
link criado sem erro nenhum que, ao ser aberto, mostra a política de
privacidade.

**2. O CSP deste site vale também pra resposta repassada.** Foi medido: os
`headers` do `vercel.json` são aplicados na resposta que veio do painel. O
`script-src 'self'` do bloco geral mataria o script da página que abre a loja no
aplicativo, e o sintoma seria uma tela de carregando pra sempre. Por isso existe
um bloco de `headers` só pros apelidos, no fim do arquivo, afrouxando o CSP
apenas ali. **Ele precisa continuar sendo o último**, senão o bloco geral vence.

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
