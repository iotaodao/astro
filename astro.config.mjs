import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    tailwind({
      configFile: './tailwind.config.cjs', 
      applyBaseStyles: false,
    })
  ],
  vite: {
    ssr: {
      noExternal: ['@dotcms/react', '@dotcms/client'],
    },
  }
});
