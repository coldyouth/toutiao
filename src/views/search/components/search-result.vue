<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <!-- <van-cell v-for="(article,index) in list" :key="index" :title="article.title" /> -->
      <article-item
        v-for="(article,index) in list"
        :key="index"
        :article="article"
        :closable="false"
      ></article-item>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
import ArticleItem from '@/components/article-item'
export default {
  name: 'SearchResult',
  components: {
    ArticleItem
  },
  props: {
    // 搜索关键词
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      // 搜索的结果页码值，从 1 开始
      page: 1,
      // 若列表数据加载失败，将 error 设置成 true 即可显示错误提示，用户点击错误提示后会重新触发 load 事件。
      error: false
    }
  },
  methods: {
    // 加载搜索结果
    async onLoad() {
      try {
        // 异步更新数据
        const { data } = await getSearchResult({
          q: this.searchText,
          page: this.page
        })
        console.log('搜索结果是', data)
        const { results } = data.data
        this.list.push(...results)
        // 本次加载状态结束
        this.loading = false

        // 判断是否还有数据
        if (results.length) {
          this.page++
        } else {
          // 数据全部加载完成
          this.finished = true
        }
      } catch (err) {
        // 显示加载失败并停止loading
        this.error = true
        this.loading = false
      }
    }
  },
  watch: {
    searchText() {
      // 1. 重置关键数据
      this.list = []
      this.loading = false
      this.finished = false
      this.page = 1
      // 2. 请求数据
      this.onLoad()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
