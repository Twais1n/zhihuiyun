import { createApp } from 'vue'
import '@/assets/styles/base.less'  // 新增引入
import App from './App.vue'
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from  'pinia' 
import zhCn from 'element-plus/es/locale/lang/zh-cn'



const pinia = createPinia()
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)

app.mount('#app')