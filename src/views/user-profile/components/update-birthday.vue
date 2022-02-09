<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :max-date="maxDate"
      :min-date="minDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user.js'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 时间选择器最小值
      minDate: new Date(1970, 0, 1),
      // 时间选择器最大值
      maxDate: new Date(),
      // 时间选择器当前值
      currentDate: new Date(this.value)
    }
  },
  methods: {
    // 确认修改时间
    async onConfirm() {
      // 加载提示，防止多次提交
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday: currentDate
        })
        this.$toast.success('修改生日成功')
        this.$emit('close')
        this.$emit('input', currentDate)
      } catch (err) {
        this.$toast('修改生日失败，请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
