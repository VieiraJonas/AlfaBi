import sharp from 'sharp';
const artwork = await sharp('public/assets/brand/alfabi-oficial.webp')
  .flatten({ background: '#ffffff' }).trim({ background: '#ffffff', threshold: 15 })
  .resize({ width: 1040, height: 490, fit: 'inside' }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
  .composite([{ input: artwork, gravity: 'centre' }])
  .jpeg({ quality: 90, mozjpeg: true }).toFile('public/og-image.jpg');
const { width, height, size } = await sharp('public/og-image.jpg').metadata();
console.log(JSON.stringify({ width, height, bytes: size }));
