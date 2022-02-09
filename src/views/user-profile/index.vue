<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()" />
    <!-- /导航栏 -->

    <!-- 隐藏的文件输入框 -->
    <input type="file" ref="file" hidden @change="onFileChange" />
    <!-- 个人信息 -->
    <van-cell class="avatar-cell" title="头像" is-link center @click="$refs.file.click()">
      <van-image class="avatar" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow=true" />
    <van-cell
      title="性别"
      :value="user.gender===0? '男':'女'"
      is-link
      @click="isUpdateGenderShow=true"
    />
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow=true" />
    <!-- /个人信息 -->

    <!-- 头像弹出层 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" :style="{ height: '100%' }">
      <update-photo
        v-if="isUpdatePhotoShow"
        @close="isUpdatePhotoShow=false"
        :img="img"
        @update-photo="user.photo=$event"
      ></update-photo>
    </van-popup>

    <!-- 昵称弹出层 -->
    <van-popup v-model="isUpdateNameShow" position="bottom" :style="{ height: '100%' }">
      <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow=false" v-model="user.name"></update-name>
    </van-popup>
    <!-- 性别弹出层 v-if让选择器关闭重打开后重新渲染，目的是重新初始化数据-->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        v-model="user.gender"
        @close="isUpdateGenderShow=false"
      ></update-gender>
    </van-popup>
    <!-- 生日弹出层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow=false"
      ></update-birthday>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user.js'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  props: {},
  data() {
    return {
      // 用户的简介信息
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      // 预览的图片
      img: null
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    // 获取用户的简介信息
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        console.log('简介信息', data)
        this.user = data.data
      } catch (err) {
        this.$toast('获取简介信息失败')
      }
    },
    // 监听文件输入框
    onFileChange() {
      // 获取图片文件对象
      const file = this.$refs.file.files[0]
      // 基于图片获取Blob数据
      this.img = window.URL.createObjectURL(file)

      // 展示预览图片
      this.isUpdatePhotoShow = true

      // file-input 选择同一个文件不会触发change事件，解决方法是清空value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
