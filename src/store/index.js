import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem, removeItem } from '@/utils/storage.js'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 用来存储 token 信息的对象，将来这个对象中会包含两个属性 { token, refresh_token }
    user: getItem(TOKEN_KEY),
    // 用户的基本信息
    userInfo: {}
  },
  mutations: {
    // 保存token 信息的方法
    setUser(state, data) {
      state.user = data
      setItem(TOKEN_KEY, state.user)
    },
    // 清空token 信息的方法
    cleanState(state) {
      state.user = ''
      removeItem(TOKEN_KEY)
      state.userInfo = {}
    },
    // 保存用户基本信息的方法
    updateUserInfo(state, data) {
      state.userInfo = data
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    // 用户头像的计算属性
    userAvatar(state) {
      // 默认的头像地址
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'
      // 如果用户信息对象中包含 photo 属性的值，则为 imgSrc 重新赋值
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }

      return imgSrc
    }
  }
})
