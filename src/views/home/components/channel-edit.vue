<template>
  <div class="channel-edit">
    <!-- 我的频道区域 -->
    <van-cell :border="false">
      <div slot="title">我的频道</div>
      <!-- 编辑按钮 -->
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >{{isEdit? '完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon v-show="isEdit && !fixedChannel.includes(channel.id)" slot="icon" name="clear"></van-icon>
        <span class="text" slot="text" :class="{active: index===active}">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐区域 -->
    <van-cell :border="false">
      <div slot="title">频道推荐</div>
    </van-cell>

    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, updateUserChannelAPI } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    // 我的频道
    myChannels: {
      type: Array,
      required: true
    },
    // 当前激活频道
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 所有频道列表
      allChannels: [],
      // 是否编辑我的频道
      isEdit: false,
      // 固定频道的id
      fixedChannel: [0]
    }
  },
  methods: {
    // 获取所有频道列表
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道列表失败')
      }
    },
    // 更新用户的频道到服务器
    async updateChannel() {
      try {
        //  准备要提交到服务器的数据
        const channels = this.myChannels
          .filter((channel) => channel.name !== '推荐') // 将“推荐”从频道列表中过滤出去
          .map((channel, index) => {
            // 调用数组的 map 循环，最终返回一个处理好的新数组
            return {
              id: channel.id,
              seq: index + 1
            }
          })
        // 发起请求
        const { data: res } = await updateUserChannelAPI(channels)
        console.log(res)
        if (res.message === '更新用户频道成功') {
          // 弹框提示用户更新成功
          this.$toast.success('更新用户的频道成功')
        }
      } catch (err) {
        this.$toast('更新用户的频道失败')
      }
    },
    // 添加频道到用户频道
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 登陆了，数据同步到服务器
        this.updateChannel()
      } else {
        // 未登录，数据保存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 点击我的频道列表(删除或切换当前频道)
    onMyChannelClick(channel, index) {
      // 编辑状态，删除频道
      if (this.isEdit) {
        // 不能删除固定保留的频道
        if (
          this.fixedChannel.includes(channel.id) ||
          this.myChannels.length === 2
        ) {
          return
        }
        // 如果删的是激活前面的频道，则active要减一
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.myChannels.splice(index, 1)

        // 数据持久化
        this.deleteChannel()
      } else {
        // 非编辑状态，切换频道(子组件给父组件传值)
        this.$emit('update-active', index, false)
      }
    },
    // 删除频道的数据持久化
    async deleteChannel() {
      // 已登录则保存数据到服务器
      if (this.user) {
        this.updateChannel()
      } else {
        // 未登录则保存数据到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  },
  computed: {
    ...mapState(['user']),
    // 生成推荐频道
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        return !this.myChannels.find((mychannel) => {
          return mychannel.id === channel.id
        })
      })
      /*
      const channels = []
      this.allChannels.forEach((channel) => {
        const ret = this.myChannels.find((mychannel) => {
          return mychannel.id === channel.id
        })
        if (!ret) {
          channels.push(channel)
        }
      })
      return channels
*/
    }
  },
  created() {
    this.loadAllChannels()
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }

      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
