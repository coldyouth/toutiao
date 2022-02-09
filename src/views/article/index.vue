<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" @click-left="onClickLeft" left-arrow title="冷冷头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail markdown-body">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate|relativeTime}}</div>
          <!-- 这种既要用又要改的数据可以简写成v-model
             :is-followed="article.is_followed"
          @updateFollow="article.is_followed = $event"
          -->
          <follow-user :user-id="article.aut_id" v-model="article.is_followed" />
          <!--
            用组件的方式简写
            <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            type="badge"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            @click="onFollow"
          >关注</van-button>-->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <comment-list
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          :list="commentList"
        ></comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <!-- 写评论 -->
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow=true"
          >写评论</van-button>
          <!-- 评论图标 -->

          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
          <!-- 收藏 -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          ></collect-article>
          <!-- 点赞 -->
          <like-article class="btn-item" v-model="article.attitude" :article-id="article.art_id"></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 写评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :target="article.art_id" @post-success="onPostSuccess"></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errorStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'

import FollowUser from '@/components/follow-user/index.vue'
import CollectArticle from '@/components/collect-article/index.vue'
import LikeArticle from '@/components/like-article/index.vue'
import CommentList from '@/components/comment-list/index.vue'
import CommentPost from '@/components/comment-post/index.vue'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      // 文章的详情
      article: {},
      // 加载状态
      loading: true,
      // 404
      errorStatus: 0,
      // 评论数量
      totalCommentCount: 0,
      // 是否显示写评论弹出层
      isPostShow: false,
      // 评论列表
      commentList: []
    }
  },
  created() {
    this.loadArticle()
  },
  methods: {
    // 获取文章的详情
    async loadArticle() {
      this.loading = true
      try {
        // 随机创造失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('abc')
        // }

        // 创造404
        // const { data } = await getArticleById(this.articleIdtttttt)

        // 请求成功
        const { data } = await getArticleById(this.articleId)
        console.log('文章的详情', data)
        this.article = data.data

        // 初始化图像预览(注意数据驱动视图不是立即的，所以需要定时器)
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errorStatus = 404
        }
        this.$toast('获取文章的详情失败')
      }
      this.loading = false
    },
    // 导航栏左箭头返回
    onClickLeft() {
      this.$router.back()
    },
    // 预览图片
    previewImage() {
      console.log('图像预览节点是', this.$refs['article-content'])
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        console.log('图像链接是', images)
        img.onclick = function () {
          ImagePreview({
            images,
            // 起始位置从0开始
            startPosition: index
          })
        }
      })
    },
    // 渲染新评论
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将新评论加到列表
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-badge {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
