<template>
  <van-button
    :class="{liked:attitude===1}"
    :icon="attitude===1?'good-job':'good-job-o'"
    :loading="loading"
    @click="onClick"
  ></van-button>
</template>

<script>
import { addLiking, deleteLiking } from '@/api/article.js'
export default {
  name: 'LikeArticle',
  // 用model自定义父组件中属性和事件名称，用.async修饰符自定义多个prop
  model: {
    prop: 'attitude',
    event: 'updateAttitude'
  },
  props: {
    attitude: {
      type: [String, Number],
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      // 是否加载
      loading: false
    }
  },
  methods: {
    async onClick() {
      this.loading = true
      try {
        let status = -1
        if (this.attitude === 1) {
          // 进行取消点赞
          await deleteLiking(this.articleId)
        } else {
          // 进行点赞
          await addLiking(this.articleId)
          status = 1
        }
        // 视图更新
        this.$emit('updateAttitude', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('点赞操作失败')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.liked {
  color: #ffa500 !important;
}
</style>
