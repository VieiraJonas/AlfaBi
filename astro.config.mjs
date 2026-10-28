// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://alfabi.com.br',
  build: { inlineStylesheets: 'never' },
});
