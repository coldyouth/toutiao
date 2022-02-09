<template>
  <div class="layout-container">
    <!-- 路由占位符 -->
    <router-view></router-view>
    <!-- 底部的导航栏 -->
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item to="/">
        <span class="text">首页</span>
        <i slot="icon" class="toutiao toutiao-shouye"></i>
      </van-tabbar-item>

      <van-tabbar-item to="/qa">
        <span class="text">问答</span>
        <i slot="icon" class="toutiao toutiao-wenda"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <span class="text">视频</span>
        <i slot="icon" class="toutiao toutiao-shipin"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <span class="text">{{ $store.state.user?'我的':'未登录'}}</span>
        <i slot="icon" class="toutiao toutiao-wode"></i>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout-container',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
