<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <!-- 文章列表 -->
      <!-- 瀑布流滚动加载，用于展示长列表，当列表即将滚动到底部时，会触发事件并加载更多列表项。
      绑定 :immediate-check="false" 属性，即可防止首次加载时触发 load 事件：-->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
      >
        <article-item
          v-for="(article,index) in list"
          :key="index"
          :article="article"
          @remove-article="removeArticle"
        />
        <!-- <van-cell v-for="(article,index) in list" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  // 父组件传递过来的当前频道
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 文章列表
      loading: false, // 控制加载中是否显示
      finished: false, // 控制没有更多了是否显示
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 列表加载失败是否显示
      isRefreshLoading: false, // 是否刷新
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示
    }
  },
  methods: {
    // 加载列表
    async onLoad() {
      try {
        // 异步更新数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now()
        })
        console.log(data)
        const { results } = data.data

        // 随机报错测试用
        // if (Math.random() > 0.5) {
        //   JSON.parse('aaa')
        // }

        // 上拉加载 1. “旧数据”在前，“新数据”在后
        this.list.push(...results)

        // 加载状态结束(开启加载状态是框架会自动变true)
        this.loading = false

        // 判断数据全部加载完成
        if (results.length) {
          // 更新用来获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 结束状态
          this.finished = true
        }
      } catch (err) {
        // 加载错误提示
        this.error = true
        // 关闭加载提示
        this.loading = false
      }
    },
    // 刷新列表
    async onRefresh() {
      try {
        // 请求数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now() // 刷新时，每次都请求最新数据
        })

        // 追加数据
        const { results } = data.data
        this.list.unshift(...results)

        // 关闭加载中
        this.isRefreshLoading = false
        this.refreshSuccessText = `刷新成功, 更新了${results.length}条数据 `
      } catch (err) {
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    },
    // 从文章列表中移除指定 id 的文章
    removeArticle(id) {
      // 1. 对原数组进行 filter 方法的过滤
      this.list = this.list.filter((item) => item.art_id !== id)

      // 2. 判断剩余数据的文章数量是否小于 10
      if (this.list.length < 10) {
        // 主动请求下一页的数据
        this.onLoad()
      }
    }
  },
  created() {
    // 首次加载列表
    this.onLoad()
  }
}
</script>

<style lang="less" scoped>
// 为什么列表滚动会互相影响，是因为都是body在滚动，所以只要给每个组件设置自己的容器
.article-list {
  // 百分比是相对父元素影响的，vh是相对视口的，使用起来更简单
  height: 79vh;
  overflow-y: auto;
}
</style>
