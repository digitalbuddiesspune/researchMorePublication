import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  // Inline PostCSS so Tailwind always runs in dev/build (avoids postcss.config resolution issues).
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
