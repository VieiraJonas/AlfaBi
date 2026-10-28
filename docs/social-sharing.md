# Compartilhamento social da ALFABI

Implementado no HTML inicial gerado pelo Astro, sem depender de JavaScript no navegador.

## Imagem padrao

Arquivo: public/og-image.jpg. URL depois de publicar: https://alfabi.com.br/og-image.jpg.
Dimensoes: 1200 x 630 pixels. JPEG com a identidade oficial ALFABI, 44.610 bytes (44,6 KB).
Meta pratica de peso para novas imagens: ate 300 KB, preferencialmente abaixo de 100 KB quando a qualidade permitir. Esse alvo e uma recomendacao de entrega, nao um limite oficial nem uma garantia de funcionamento do WhatsApp. Arquivo e pagina precisam estar acessiveis publicamente em HTTPS; caches e disponibilidade externa tambem afetam a previa.

Para trocar a imagem padrao, substitua public/og-image.jpg, mantendo 1200 x 630 px. Se usar outro nome ou formato, ajuste a prop image ou o fallback do Layout. Dimensoes personalizadas devem ser acompanhadas de imageWidth e imageHeight reais.

## Exemplo de pagina personalizada

Crie sua imagem personalizada em public/compartilhamento/metodologia.jpg antes de usar esse caminho. Na pagina Astro:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="Metodologia STEAM | ALFABI"
  description="Aprender fazendo e descobrir brincando, com acolhimento e criatividade."
  image="/compartilhamento/metodologia.jpg"
  imageAlt="Atividades da metodologia STEAM na ALFABI"
  imageWidth={1200}
  imageHeight={630}
>
  <main id="conteudo">
    <!-- Conteudo existente da pagina -->
  </main>
</Layout>
```

A URL da imagem passa a ser https://alfabi.com.br/compartilhamento/metodologia.jpg. Tambem sao aceitas URLs completas de imagens. O canonical padrao usa Astro.url.pathname com a origem Astro.site, sem query ou fragmento; pode ser sobrescrito com canonical="/caminho/". Props adicionais: type="website" ou "article", siteName.

A pagina src/pages/index.astro ja utiliza Layout sem props e herda os valores padrao, sem precisar de alteracoes.

## Validacao

Executar npm run build e node scripts/check-social.mjs. A verificacao confere canonical, tags unicas, URLs HTTPS absolutas, imagem existente, dimensoes reais e peso. Props personalizadas foram conferidas por uma rota temporaria de build, removida ao finalizar. Validacao local nao equivale a teste dos crawlers nas plataformas. As mudancas passam a valer no dominio apos publicar o build.

## Referencias

- https://docs.astro.build/en/reference/api-reference/#site
- https://ogp.me/

## Arquivos editados/adicionados e codigo completo

### astro.config.mjs

```javascript
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://alfabi.com.br',
  build: { inlineStylesheets: 'never' },
});
```

### src/layouts/Layout.astro

```astro
---
import '../styles/global.css';
import { heroPoster } from '../assets/hero-image';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
  image?: string | URL;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: 'website' | 'article';
  siteName?: string;
  canonical?: string | URL;
}

const {
  title = 'ALFABI — Cada descoberta começa com acolhimento',
  description = 'Na ALFABI, cada descoberta começa com acolhimento. Um espaço para aprender, desenvolver habilidades e crescer com afeto.',
  image = '/og-image.jpg',
  imageAlt = title,
  imageWidth = 1200,
  imageHeight = 630,
  type = 'website',
  siteName = 'ALFABI',
  canonical,
} = Astro.props;

// Prefer the production origin, even when rendering a local development preview.
const siteURL = Astro.site ?? new URL(Astro.url.origin);
const canonicalURL = new URL(canonical ?? Astro.url.pathname, siteURL);
canonicalURL.search = '';
canonicalURL.hash = '';
const imageURL = new URL(image, siteURL);
---

<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content={description}>
  <title>{title}</title>
  <link rel="canonical" href={canonicalURL.href}>

  <meta property="og:type" content={type}>
  <meta property="og:url" content={canonicalURL.href}>
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content={imageURL.href}>
  <meta property="og:image:alt" content={imageAlt}>
  <meta property="og:image:width" content={String(imageWidth)}>
  <meta property="og:image:height" content={String(imageHeight)}>
  <meta property="og:site_name" content={siteName}>
  <meta property="og:locale" content="pt_BR">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content={imageURL.href}>
  <meta name="twitter:image:alt" content={imageAlt}>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=alfabi">
  <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico?v=alfabi">
  <link rel="preload" as="font" type="font/ttf" href="/assets/hero/fonts/Pamit.ttf" crossorigin>
  <link rel="preload" as="font" type="font/ttf" href="/assets/hero/fonts/Poppins-Regular.ttf" crossorigin>
  <link rel="preload" as="image" href={heroPoster.src} imagesrcset={heroPoster.srcSet.attribute} imagesizes={heroPoster.options.sizes} fetchpriority="high">
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
  <slot name="head" />
</head>
<body>

  <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
  <svg class="svg-defs" aria-hidden="true"><defs>
    <symbol id="arrow" viewBox="0 0 24 24"><path d="M5 19 19 5M5 5h14v14"/></symbol>
    <symbol id="chat" viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20l1.3-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></symbol>
    <symbol id="heart" viewBox="0 0 24 24"><path d="m12 20-8-8a5 5 0 0 1 8-6 5 5 0 0 1 8 6z"/></symbol>
    <symbol id="down" viewBox="0 0 24 24"><path d="M12 4v16m-6-6 6 6 6-6"/></symbol>
    <symbol id="spark" viewBox="0 0 24 24"><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></symbol>
<symbol id="menu" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></symbol><symbol id="close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"/></symbol><symbol id="chevron" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></symbol><symbol id="book" viewBox="0 0 24 24"><path d="M12 5C9 3 5 3 2 4v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/></symbol><symbol id="instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></symbol><symbol id="pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
  </defs></svg>
  <Header />
  <slot />
  <Footer />
</body>
</html>



<script>
  import '../scripts/page-effects.js';
</script>
```

### scripts/check-social.mjs

```javascript
﻿import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const html = fs.readFileSync('dist/index.html', 'utf8');
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
}
const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attributes(m[0]));
const get = key => tags.filter(t => (t.property ?? t.name) === key);
const fields = ['og:type', 'og:url', 'og:title', 'og:description', 'og:image', 'og:image:alt', 'og:image:width', 'og:image:height', 'og:site_name', 'og:locale', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'];
for (const field of fields) {
  assert.equal(get(field).length, 1, `Missing or duplicate tag: ${field}`);
  assert.ok(get(field)[0].content.length, field);
}
assert.equal(get('og:url')[0].content, 'https://alfabi.com.br/');
assert.equal(get('og:image')[0].content, 'https://alfabi.com.br/og-image.jpg');
assert.equal(get('twitter:image')[0].content, get('og:image')[0].content);
assert.equal(get('twitter:card')[0].content, 'summary_large_image');
assert.equal(get('og:title')[0].content, get('twitter:title')[0].content);
assert.equal(get('og:description')[0].content, get('twitter:description')[0].content);
const canonicals = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attributes(m[0])).filter(t => t.rel === 'canonical');
assert.equal(canonicals.length, 1);
assert.equal(canonicals[0].href, get('og:url')[0].content);
const image = await sharp('dist/og-image.jpg').metadata();
assert.equal(image.width, Number(get('og:image:width')[0].content));
assert.equal(image.height, Number(get('og:image:height')[0].content));
assert.equal(image.format, 'jpeg');
assert.ok(fs.statSync('dist/og-image.jpg').size < 300_000);
console.log('PASS: production canonical; unique Open Graph/Twitter tags; absolute HTTPS image; matching JPEG dimensions; image under 300 KB.');
```

