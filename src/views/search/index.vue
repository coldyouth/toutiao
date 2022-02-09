<template>
  <div class="search-container">
    <!-- 顶部的搜索栏 -->
    <!-- 包一个form标签是为了让输入法响应出搜索按钮 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        background="#3296fa"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if=" isResultShow" :search-text="searchText"></search-result>

    <!-- 关键字联想 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"></search-suggestion>

    <!-- 搜索历史 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories=[]"
      @search="onSearch"
    ></search-history>
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data() {
    return {
      // 搜索内容
      searchText: '',
      // 是否显示搜索结果
      isResultShow: false,
      //  保存历史记录
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  methods: {
    onSearch(val) {
      // 让搜索框同步显示点击了的建议
      this.searchText = val

      // 保存历史记录,不要有重复，最新的排前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)

      // 显示搜索框
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  },
  watch: {
    searchHistories(val) {
      setItem('TOUTIAO_SEARCH_HISTORIES', val)
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
