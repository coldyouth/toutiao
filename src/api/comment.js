import request from '@/utils/request'

// 获取文章的评论列表

export const getComments = (params) => {
  return request({
    method: 'get',
    url: '/v1_0/comments',
    params
  })
}

// 为评论点赞, target是评论的 id
export const addCommentLike = target => {
  return request({
    method: 'post',
    url: '/v1_0/comment/likings',
    data: { target }
  })
}

// 取消为评论点赞
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

// 为指定的文章发表新评论,target:文章的 id,content:评论的内容
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
