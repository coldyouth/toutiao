<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登陆">
      <!-- 关闭按钮 -->
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <van-form @submit="onSubmit" ref="loginForm">
      <!-- 手机号 -->
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <!-- 验证码 -->
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>

        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="60*1000"
            format="ss s"
            @finish="isCountDownShow=false"
          />
          <!-- 发送验证码按钮 -->
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="medium"
            type="default"
            native-type="button"
            @click="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <!-- 登陆按钮 -->
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'loginIndex',
  data() {
    return {
      // 表单数据
      user: {
        // 手机号
        mobile: '13911111111',
        // 验证码
        code: '246810'
      },
      // 表单验证对象
      userFormRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '请填写正确的手机号'
          }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          {
            pattern: /^\d{6}$/,
            message: '请填写正确的验证码'
          }
        ]
      },
      // 是否显示倒计时
      isCountDownShow: false
    }
  },
  methods: {
    // 获取表单数据》表单验证》发起请求》后续操作
    async onSubmit() {
      // 获取表单数据》表单验证》发起请求》后续操作
      const user = this.user
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true,
        durantion: 0
      })
      try {
        const { data } = await login(user)
        // 将数据存储到store中
        this.$store.commit('setUser', data.data)
        this.$toast.success('登陆成功')
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          console.log('登陆失败，请稍后重试 ', err)
          this.$toast.fail('登陆失败，请稍后重试 ')
        }
      }
    },
    // 验证手机号》倒计时》发送验证码
    async onSendSms() {
      // 验证手机号》倒计时》发送验证码
      try {
        await this.$refs.loginForm.validate('mobile')
        this.$toast.success('验证成功')
      } catch (err) {
        return this.$toast.fail('验证失败', err)
      }
      this.isCountDownShow = true

      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        this.isCountDownShow = false

        if (err.response.status === 429) {
          this.$toast.fail('发送太频繁', err)
        } else {
          this.$toast.fail('发送失败', err)
        }
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
