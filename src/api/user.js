// 用户相关请求模块
import request from '@/utils/request'
import axios from 'axios'

// 登录请求
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 获取验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户基本信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
  })
}

// 获取用户频道
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}

// 关注作者
export const addFollow = (target) => {
  return request({
    method: 'post',
    url: '/v1_0/user/followings',
    data: { target }
  })
}

// 取消关注文章的作者
export const deleteFollow = (authorId) => {
  return request({
    method: 'delete',
    url: `/v1_0/user/followings/${authorId}`
  })
}

// 获取用户的简介信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// 修改用户简介,修改名称，只需提交 {name: 'xxx'} 即可,修改生日，只需提交 {birthday: '2012-12-12'} 即可
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

// 修改用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}

// 换取 Token 的 API（形参中的 refreshToken 用来换取新 token）
export const exchangeTokenAPI = refreshToken => {
  return axios({
    method: 'PUT',
    url: 'http://www.liulongbin.top:8000/v1_0/authorizations',
    headers: { Authorization: `Bearer ${refreshToken}` }
  })
}
