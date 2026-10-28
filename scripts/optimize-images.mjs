import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root = 'public/assets';
async function files(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
const report = [];
const replacements = [];
for (const file of await files(root)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const original = await fs.readFile(file);
  const output = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const optimized = await sharp(original).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toBuffer();
  const before = await sharp(original).metadata();
  const after = await sharp(optimized).metadata();
  if (before.width !== after.width || before.height !== after.height || Boolean(before.hasAlpha) !== Boolean(after.hasAlpha)) throw new Error(`Metadata mismatch: ${file}`);
  if (optimized.length >= original.length) continue;
  const backup = path.join('tmp/media-originals', path.relative(root, file));
  await fs.mkdir(path.dirname(backup), { recursive: true });
  await fs.writeFile(backup, original);
  await fs.writeFile(output, optimized);
  replacements.push([file.slice('public'.length).replaceAll('\\', '/'), output.slice('public'.length).replaceAll('\\', '/')]);
  report.push({ file, before: original.length, after: optimized.length });
}
for (const file of await files('src')) {
  if (!/\.(astro|css|js|ts)$/.test(file)) continue;
  const original = await fs.readFile(file, 'utf8');
  let source = original;
  for (const [from, to] of replacements) source = source.replaceAll(from, to);
  if (source !== original) await fs.writeFile(file, source);
}
// Remove replaced assets only after every source reference has been updated.
for (const [from] of replacements) await fs.unlink('public' + from);
await fs.writeFile('tmp/media-compression-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
