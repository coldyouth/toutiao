<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user.js'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localName: this.value
    }
  },
  methods: {
    // 修改用户简介
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        if (this.localName.length === 0) {
          this.$toast('昵称不能为空')
          return
        }

        await updateUserProfile({ name: this.localName })

        // 更新视图
        this.$emit('input', this.localName)
        // 关闭弹窗
        this.$emit('close')
        // 提示成功
        this.$toast.success('昵称更新成功')
      } catch (err) {
        this.$toast.fail('昵称更新失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>
