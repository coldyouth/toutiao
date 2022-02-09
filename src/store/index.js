import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem, removeItem } from '@/utils/storage.js'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 用来存储 token 信息的对象，将来这个对象中会包含两个属性 { token, refresh_token }
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      setItem(TOKEN_KEY, state.user)
    },
    // 情空数据
    cleanState(state) {
      state.user = ''
      removeItem(TOKEN_KEY)
    }
  },
  actions: {
  },
  modules: {
  }
})
