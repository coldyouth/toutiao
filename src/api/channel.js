/*
 请求频道模块
*/

import request from '@/utils/request.js'

// 获取全部频道
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/v1_0/channels'
  })
}

// 更新用户的频道
export const updateUserChannelAPI = channels => {
  return request({
    method: 'put',
    url: '/v1_0/user/channels',
    data: {
      channels
    }
  })
}
