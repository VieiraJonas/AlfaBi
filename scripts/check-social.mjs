import fs from 'node:fs';
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
