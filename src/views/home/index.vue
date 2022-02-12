<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        round
        size="small"
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs
      class="channel-tabs"
      v-model="active"
      animated
      swipeable
      :before-change="beforeTabsChange"
      @change="onTabsChange"
    >
      <van-tab :key="channel.id" v-for="channel in channels" :title="channel.name">
        <!-- 文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <!-- 空白占位和汉堡菜单 -->
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow=true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 编辑频道弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
      @closed="$refs.channelEditRef.isEdit = false"
    >
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
        ref="channelEditRef"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserChannels } from '@/api/user.js'
import { getItem } from '@/utils/storage'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'

// “频道名称”和“滚动条位置”之间的对应关系，格式 { '推荐': 211, 'html': 30, '开发者资讯': 890 }
const nameToTop = {}

export default {
  name: 'HomeIndex',
  components: {
    'article-list': ArticleList,
    ChannelEdit
  },
  data() {
    return {
      // 激活的标签页
      active: 0,
      // 用户频道
      channels: [],
      // 是否编辑频道弹出层
      isChannelEditShow: false
    }
  },

  created() {
    this.loadChannels()
  },

  methods: {
    // 获取用户频道数据
    async loadChannels() {
      try {
        let channels = []
        if (this.user) {
          // 已登录，加载服务器数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，加载本地数据或者请求默认列表
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            channels = localChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道失败')
      }
    },
    // 根据编辑弹出层组件更改active
    onUpdateActive(index, isChannelEditShow = true) {
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    },
    // tabs 发生切换之前，触发此方法
    beforeTabsChange() {
      // 把当前"频道名称"对应的"滚动条位置"记录到 nameToTop 对象中
      const name = this.channels[this.active].name
      nameToTop[name] = window.scrollY
      console.log('切换之前', name, nameToTop[name])
      // return true 表示允许进行标签页的切换
      return true
    },
    // 当 tabs 切换完毕之后，触发此方法
    onTabsChange() {
      // 等 DOM 更新完毕之后，根据记录的"滚动条位置"，调用 window.scrollTo() 方法进行滚动
      this.$nextTick(() => {
        const name = this.channels[this.active].name
        window.scrollTo(0, nameToTop[name] || 0)
        console.log('切换之后', name, nameToTop[name])
      })
    }
  },
  computed: {
    ...mapState(['user'])
  },
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    // console.log('列表位置是', from.meta.top)
    next()
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  // scoped的原理是给每个节点添加属性，通过属性选择器应用样式。deep的原理是将属性移动到父节点上，才不会找不到元素。
  // 不添加deep找到元素  .home-container .van-nav-bar__title[data-v-5954443c] （无此元素）
  // 添加了deep找到元素 .home-container[data-v-5954443c] .van-nav-bar__title
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 600px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    // 激活tab文字变黑
    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    // 激活tab底部边框
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      // 宽度大于容器，flex会进行等比例收缩，flex-shrink 属性指定了 flex 元素的收缩规则
      flex-shrink: 0; // 不参与收缩
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      // 汉堡菜单左边框渐变条纹
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
