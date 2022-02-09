<template>
  <div>
    <van-cell
      class="article-item"
      :to="{
    name:'article',
    params:{
      articleId:article.art_id
    }
  }"
    >
      <!-- 左侧标题 -->
      <div slot="title" class="title, van-multi-ellipsis--l2">{{article.title}}</div>

      <!-- 标题下方内容 -->
      <div slot="label">
        <!-- 下方图片 -->
        <div v-if="article.cover.type === 3" class="cover-wrap">
          <div class="cover-item" :key="index" v-for="(img, index) in article.cover.images">
            <van-image class="cover-item-img" :src="img" fit="cover" />
          </div>
        </div>

        <!-- 下方描述 -->
        <div class="label-info-wrap">
          <div>
            <span>{{article.aut_name}}</span>
            <span>{{article.comm_count}}评论</span>
            <span>{{article.pubdate | relativeTime}}</span>
          </div>
          <!-- 关闭按钮,注意防止事件冒泡 -->
          <van-icon name="cross" @click.stop="isActionShow=true" />
        </div>
      </div>

      <!-- 右侧图片 -->
      <van-image
        class="right-cover"
        v-if="article.cover.type===1"
        slot="default"
        fit="cover"
        width="100"
        height="100"
        :src="article.cover.images[0]"
      />
    </van-cell>

    <!-- 反馈的动作面板，通过get-container属性挂载到body上 -->
    <van-action-sheet
      v-model="isActionShow"
      cancel-text="取消"
      @close="isFirst = true"
      get-container="body"
    >
      <!-- 第一级反馈面板 -->
      <div v-if="isFirst">
        <van-cell
          :key="index"
          v-for="(action,index) in actions"
          :title="action.name"
          clickable
          class="center-title"
          @click="onCellClick(action.name)"
        />
      </div>
      <div v-else>
        <van-cell
          :key="item.type"
          v-for="item in reports"
          :title="item.label"
          clickable
          title-class="center-title"
          @click="reportArticle(item.type)"
        ></van-cell>
        <van-cell title="返回" clickable title-class="center-title" @click="isFirst = true" />
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
// 导入二级反馈面板xuanx
import { reports } from '@/api/report.js'
import { dislikeArticleAPI, reportArticleAPI } from '@/api/article.js'
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 控制反馈面板
      isActionShow: false,

      isFirst: true,

      // 第一个面板的可选项列表
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],

      // 第二个面板的可选项列表
      reports
    }
  },
  methods: {
    // 监听一级反馈面板选项
    async onCellClick(name) {
      if (name === '不感兴趣') {
        this.isActionShow = false
        // 调用 API 接口，将文章设置为不感兴趣
        try {
          const { data: res } = await dislikeArticleAPI(this.article.art_id)
          if (res.message === 'OK') {
            // TODO：炸楼的操作，触发自定义的事件，将文章 id 发送给父组件
            this.$emit('remove-article', this.article.art_id)
          }
        } catch (err) {
          this.$toast.fail('不感兴趣操作失败')
        }
      } else if (name === '拉黑作者') {
        this.isActionShow = false
      } else if (name === '反馈垃圾内容') {
        // TODO：展示二级反馈面板
        this.isFirst = false
      }
    },
    // 举报文章（形参 type 是举报的类型值）
    async reportArticle(type) {
      // 1. 发起举报文章的请求
      const { data: res } = await reportArticleAPI(this.article.art_id, type)
      if (res.message === 'OK') {
        // 2. 炸楼操作，触发自定义事件，把文章 Id 发送给父组件
        this.$emit('remove-article', this.article.art_id)
      }
      // 3. 关闭动作面板
      this.isActionShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__title {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right-cover {
    width: 100%;
    height: 146px;
  }

  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .label-info-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
// 反馈面板居中
.center-title {
  text-align: center;
}
</style>
