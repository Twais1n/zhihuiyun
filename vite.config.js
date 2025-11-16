import { defineConfig, mergeAlias } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    Components({
      resolvers: [ElementPlusResolver()], // 自动导入 Element Plus 组件
      dts: true, // 自动生成 types.d.ts
    }),
  ],
  //添加的别名 
  resolve:{
    alias:[
      {
        find:"@",
        replacement:"/src"
      }
    ]
  }
})
/*@/······  的格式代表 在src的目录下查找*/ 