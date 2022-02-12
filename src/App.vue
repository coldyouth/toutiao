<template>
  <div id="app">
    <keep-alive>
      <!-- 路由占位符 -->
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="less">
.box {
  width: 200px;
  height: 200px;
  background-color: pink;
}
</style>
