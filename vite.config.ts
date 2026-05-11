//Default vite config file
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiHost = env.VITE_API_HOST && env.VITE_API_HOST !== 'auto' ? env.VITE_API_HOST : 'localhost';
  const apiProtocol = env.VITE_API_PROTOCOL || 'http';
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      react({
        // @ts-ignore
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", {}],
          ],
        },
      }),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/imgs': {
          target: `${apiProtocol}://${apiHost}:${env.VITE_API_PORT || 3000}`,
          changeOrigin: true,
        },
      },
    },
  };
})
