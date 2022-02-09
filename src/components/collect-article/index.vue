<template>
  <van-button
    :icon="isCollected ? 'star':'star-o'"
    :class="{collected: isCollected}"
    @click="onCollect"
    :loading="loading"
  ></van-button>
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article.js'
export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected',
    event: 'updateIsCollected'
  },
  props: {
    isCollected: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      // 加载状态
      loading: false
    }
  },
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.isCollected) {
          // 已收藏，进行取消收藏
          const data = await deleteCollect(this.articleId)
          console.log('取消收藏', data)
        } else {
          // 进行收藏
          const data = await addCollect(this.articleId)
          console.log('收藏', data)
        }
        // 更新视图
        // this.$emit('updateIsCollected', !this.isCollected)
        this.$toast.success(!this.isCollected ? '收藏' : '取消收藏')
      } catch (err) {
        console.log('收藏操作失败，请重试')
      }
      this.loading = false
      // 接口失效，不管成功与否都更新视图
      this.$emit('updateIsCollected', !this.isCollected)
    }
  }
}
</script>
<style lang="less" scoped>
.collected {
  color: #ffa500 !important;
}
</style>
