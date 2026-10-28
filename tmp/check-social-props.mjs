import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const fixture = path.resolve('src/pages/social-preview-check.astro');
assert.ok(fixture.startsWith(path.resolve('src/pages') + path.sep));
fs.writeFileSync(fixture, `---
import Layout from '../layouts/Layout.astro';
---
<Layout
  title="Pagina personalizada ALFABI"
  description="Previa com dados personalizados."
  image="/og-image.jpg?v=2"
  imageAlt="Imagem personalizada ALFABI"
  imageWidth={1200}
  imageHeight={630}
  type="article"
  siteName="ALFABI Educacao"
  canonical="/pagina-personalizada/"
><main id="conteudo">Teste local</main></Layout>`, { flag: 'wx' });
function build(log) {
  const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { encoding: 'utf8' });
  fs.writeFileSync(log, (result.stdout ?? '') + (result.stderr ?? ''));
  assert.equal(result.status, 0, `Build failed: ${log}`);
}
try {
  build('tmp/social-props-build.log');
  const html = fs.readFileSync('dist/social-preview-check/index.html', 'utf8');
  for (const [key, value] of Object.entries({
    'og:type': 'article', 'og:url': 'https://alfabi.com.br/pagina-personalizada/',
    'og:title': 'Pagina personalizada ALFABI', 'og:description': 'Previa com dados personalizados.',
    'og:image': 'https://alfabi.com.br/og-image.jpg?v=2', 'og:image:alt': 'Imagem personalizada ALFABI',
    'og:image:width': '1200', 'og:image:height': '630', 'og:site_name': 'ALFABI Educacao',
    'twitter:title': 'Pagina personalizada ALFABI', 'twitter:description': 'Previa com dados personalizados.',
    'twitter:image': 'https://alfabi.com.br/og-image.jpg?v=2', 'twitter:image:alt': 'Imagem personalizada ALFABI',
  })) {
    assert.ok(html.includes(`="${key}" content="${value}"`), key);
  }
  assert.ok(html.includes('rel="canonical" href="https://alfabi.com.br/pagina-personalizada/"'));
  console.log('PASS: personalized title, description, image, alt, dimensions, type, site name and canonical.');
} finally {
  fs.unlinkSync(fixture);
  build('tmp/social-final-build.log');
}
assert.equal(fs.existsSync('dist/social-preview-check/index.html'), false);
console.log('PASS: temporary validation route removed from source and production output.');
