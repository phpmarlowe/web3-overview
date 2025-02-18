import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build'
  const envConfig = loadEnv(mode, process.cwd(), 'GABLE')
  console.log('当前环境变量：', envConfig) // env { VITE_VARIATE: '1' }
  return {
    envPrefix: 'GABLE',
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      visualizer(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/assets/styles/variables.scss';`,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@api': fileURLToPath(new URL('./src/service/api', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
    },
    build: {
      // 打包输出的文件夹名称
      outDir: 'dist',
      // 静态资源文件保存的文件夹名称
      assetsDir: 'static',
      // 是否启用css代码拆分
      cssCodeSplit: true,
      // 打包构建后是否生成 source map 文件。
      sourcemap: false,
      // 打包构建时压缩混淆使用的混淆器
      minify: 'esbuild',
      // 自定义底层的 Rollup 打包配置（Rollup文档地址：https://cn.rollupjs.org/configuration-options/）
      rollupOptions: {
        // 输出配置
        output: {
          // 输出的文件自定义命名
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.type === 'asset' && /\.(jpe?g|png|gif|svg)$/i.test(assetInfo.name)) {
              return 'static/img/[name].[hash][ext]'
            }
            if (assetInfo.type === 'asset' && /\.(ttf|woff|woff2|eot)$/i.test(assetInfo.name)) {
              return 'static/fonts/[name].[hash][ext]'
            }
            return 'static/[ext]/name1-[hash].[ext]'
          },

          // manualChunks: (id: any) => {
          //   if (id.includes('node_modules')) {
          //     return id.toString().split('node_modules/')[1].split('/')[0].toString()
          //   }
          // },
          // manualChunks(id) {
          //   // 判断是否为第三方依赖，将其拆分到 vendor 中
          //   if (id.includes('node_modules')) {
          //     // 这里代码可以优化一下，但是我懒，我相信你一定可以的！
          //     if (id.includes('element-plus')) {
          //       return 'element-plus'
          //     }
          //     if (id.includes('three')) {
          //       return 'three'
          //     } else if (id.includes('echarts') || id.includes('echarts-wordcloud')) {
          //       return 'echarts'
          //     } else if (id.includes('dayjs')) {
          //       return 'dayjs'
          //     } else if (id.includes('lodash-es')) {
          //       return 'lodash-es'
          //     } else if (id.includes('zrender')) {
          //       return 'zrender'
          //     } else if (id.includes('xlsx') || id.includes('xlsx-js-style')) {
          //       return 'xlsx'
          //     } else {
          //       return 'vendor'
          //     }
          //   } else {
          //     return 'index'
          //   }
          // },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        '^/gable': {
          target: envConfig.GABLE_PROXY_URL, // 后端服务实际地址
          changeOrigin: true, //开启代理
          configure: (proxy, options) => {
            proxy.on('proxyReq', function (proxyReq, req, res) {
              proxyReq.removeHeader('referer') // 移除请求头
              proxyReq.removeHeader('origin') // 移除请求头
            })
          },
          rewrite: (path) => path.replace(/^\/gable/, ''),
        },
      },
    },
    preview: {
      port: 4173,
      open: true,
      proxy: {
        '^/gable': {
          target: envConfig.GABLE_PROXY_URL, // 后端服务实际地址
          changeOrigin: true, //开启代理
          configure: (proxy, options) => {
            proxy.on('proxyReq', function (proxyReq, req, res) {
              proxyReq.removeHeader('referer') // 移除请求头
              proxyReq.removeHeader('origin') // 移除请求头
            })
          },
          rewrite: (path) => path.replace(/^\/gable/, ''),
        },
      },
    },
  }
})
