import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载全局样式文件
import './styles/index.less'

// 加载vant和懒加载
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

// 加载动态rem基准值
import 'amfe-flexible'

// 加载dayjs中的代码
import './utils/dayjs.js'

Vue.use(Vant)
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
