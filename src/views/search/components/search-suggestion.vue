<template>
  <div class="search-suggestion">
    <!-- 如果服务器返回列表的第一个元素为null就不渲染 -->
    <div v-if="suggestions[0]">
      <van-cell
        v-for="(text,index) in suggestions"
        :key="index"
        icon="search"
        @click="$emit('search',text)"
      >
        <div slot="title" v-html="highlight(text)"></div>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search.js'
export default {
  name: 'SearchSuggestion',
  props: {
    // 搜索框关键字
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 搜索联想列表
      suggestions: [],
      // 搜索防抖定时器
      timerId: null
    }
  },
  watch: {
    searchText: {
      // 值发生改变就会固定调用handler函数
      handler(val) {
        // 防抖操作: 1清除上次的定时器 2如果关键字为空不开启定时器 3开启定时器发请求
        clearTimeout(this.timerId)
        if (val.trim().length === 0) return
        this.timerId = setTimeout(() => {
          this.loadSearchSuggestions(val)
        }, 500)
      },
      // 该回调会在侦听开始之后立即被调用，防止第一个字母由于模板未渲染而不调用函数的情况。
      immediate: true
    }
  },
  methods: {
    // 请求建议列表数据
    async loadSearchSuggestions(val) {
      try {
        const { data } = await getSearchSuggestions(val.trim())
        this.suggestions = data.data.options
        console.log('搜索建议是', data)
      } catch (err) {
        this.$toast('获取搜索建议失败')
      }
    },
    // 关键词高亮
    highlight(text) {
      const highlightText = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightText)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
