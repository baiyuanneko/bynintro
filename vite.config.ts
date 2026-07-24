import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有 mdui- 前缀的标签视为自定义元素
          isCustomElement: (tag) => tag.startsWith('mdui-'),
        },
      },
    }),
    tailwindcss(),
  ],
})

