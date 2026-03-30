import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Element Plus（推荐全量引入，开发阶段方便，后期可按需引入）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 可选：引入中文语言包（如果需要）
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
    locale: zhCn,        // 中文
    size: 'default'      // 组件默认大小
})

app.mount('#app')