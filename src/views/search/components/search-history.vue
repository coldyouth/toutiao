<template>
  <div class="search-history">
    <van-cell title="搜索历史" icon="location-o">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span>完成</span>
      </div>

      <van-icon v-else name="delete-o" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item,index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-if="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 控制进入删除状态
      isDeleteShow: false
    }
  },
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态,删除数据
        this.searchHistories.splice(index, 1)
      } else {
        // 直接搜索数据
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
