// 搜索框请求

import request from '@/utils/request'

// 获取搜索建议
export const getSearchSuggestions = q => {
  return request.get('/v1_0/suggestion', { params: { q } })
}

// 获取搜索结果
export const getSearchResult = params => {
  return request.get('/v1_0/search', { params })
}
