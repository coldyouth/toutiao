import request from '@/utils/request'

// 根据频道 Id 获取文章列表数据

export const getArticles = params => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params
  })
}

// 根据文章 articleId 获取文章的详情

export const getArticleById = articleId => {
  return request({
    method: 'get',
    url: `v1_0/articles/${articleId}`
  })
}

// 收藏文章,target是文章id

export const addCollect = target => {
  return request({
    method: 'post',
    url: '/v1_0/article/colllections',
    data: {
      target
    }
  })
}

// 取消收藏文章

export const deleteCollect = (target) => {
  return request({
    method: 'delete',
    url: `/v1_0/article/colllections/${target}`
  })
}

// 点赞文章,target是文章id

export const addLiking = target => {
  return request({
    method: 'post',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}

// 取消点赞文章

export const deleteLiking = (target) => {
  return request({
    method: 'delete',
    url: `/v1_0/article/likings/${target}`
  })
}

// 将文章设置为不感兴趣（形参 id 是文章的 id）
export const dislikeArticleAPI = id => {
  return request.post('/v1_0/article/dislikes', {
    target: id
  })
}

// 举报文章的 API
export const reportArticleAPI = (target, type) => {
  return request.post('/v1_0/article/reports', {
    target, // 文章的 Id
    type // 举报的类型
  })
}
