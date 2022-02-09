<template>
  <van-button
    v-if=" isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="badge"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
  >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'followUser',
  model: {
    prop: 'isFollowed',
    event: 'updateFollow'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    // 关注或取关文章作者
    async onFollow() {
      // 加载按钮
      this.loading = true
      try {
        if (this.isFollowed) {
          // 取关
          await deleteFollow(this.userId)
        } else {
          // 关注
          await addFollow(this.userId)
        }
        this.$emit('updateFollow', !this.isFollowed)
      } catch (err) {
        let message = '操作失败'
        if (err.response && err.response.status === 400) {
          message = '自己不能关注自己'
        }
        this.$toast(message)
      }
      // 加载按钮结束
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
