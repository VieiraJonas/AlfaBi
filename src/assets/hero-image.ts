import { getImage } from 'astro:assets';
import { poster } from './images';

// The preload, visible image and video poster use the same generated resource.
export const heroImageOptions = {
  src: poster,
  width: 960,
  height: 540,
  widths: [480, 768, 960],
  sizes: '(max-width: 760px) 110vw, 860px',
  format: 'webp' as const,
  quality: 90,
};
export const heroPoster = await getImage(heroImageOptions);
