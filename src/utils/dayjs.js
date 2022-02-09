import Vue from 'vue'

import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'
// 加载相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置中文
dayjs.locale('zh-cn')
// 配置相对时间插件
dayjs.extend(relativeTime)

// 配置vue全局过滤器
Vue.filter('relativeTime', val => {
  return dayjs().to(dayjs(val))
})
