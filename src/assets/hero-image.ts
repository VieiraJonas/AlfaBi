import { getImage } from 'astro:assets';
import { poster } from './images';

// The preload, visible image and video poster use the same generated resource.
export const heroImageOptions = {
  src: poster,
  width: 1440,
  height: 810,
  widths: [480, 768, 960, 1440],
  sizes: '(max-width: 760px) calc(100vw - 50px), (max-width: 1100px) calc(100vw - 76px), 55vw',
  format: 'webp' as const,
  quality: 90,
};
export const heroPoster = await getImage(heroImageOptions);
