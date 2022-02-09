<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入评论"
      show-word-limit
    />
    <van-button class="post-btn" @click="onPost" :disable="!message.length">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment.js'
export default {
  name: 'CommentPost',
  props: {
    target: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    // 发表新评论
    async onPost() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await addComment({
          target: this.target,
          content: this.message
        })
        console.log('发表新评论', data)
        // 清空输入框
        this.message = ''
        // 关闭弹出层
        // 渲染新评论
        this.$emit('post-success', data.data)
        this.$toast.success('发布成功')
      } catch (err) {
        this.$toast.fail('发表新评论失败，请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
