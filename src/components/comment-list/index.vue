<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <!-- <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item.content"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    />-->
    <comment-item v-for="(item, index) in list" :key="index" :comment="item"></comment-item>
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment.js'
import CommentItem from '@/components/commment-item/index.vue'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    // 来源：文章id或评论id
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 评论列表
    list: {
      type: Array,
      // 数组或对象的默认值需要用工厂函数传入
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      error: false,
      offset: null // 获取评论数据的偏移量，值为 last_id 的值，表示从此 id 的数据向后取，
    }
  },
  methods: {
    // 获取文章的评论列表
    async onLoad() {
      try {
        // 1，请求数据
        const { data } = await getComments({
          type: 'a',
          source: this.source,
          offset: this.offset
        })
        console.log('评论列表', data)
        // 2，将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 获取评论数量
        this.$emit('onload-success', data.data)
        // 3，将loading设置为false
        this.loading = false
        // 4，判断是否结束。没有就获取下一页数据。结束了就将finished设置为true
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  },
  created() {
    this.onLoad()
  }
}
</script>
<style lang="less" scoped>
</style>
