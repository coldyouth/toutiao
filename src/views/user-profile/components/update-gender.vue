<template>
  <div class="update-gender">
    <van-picker
      title="设置性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女']
    }
  },
  methods: {
    // 修改用户简介
    onConfirm(item, index) {
      this.$emit('input', index)
      this.$emit('close')
      this.$toast.success('更新性别成功')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
