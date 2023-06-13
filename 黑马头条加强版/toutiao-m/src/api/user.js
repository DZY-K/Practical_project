import request from '@/units/request'

// export const loginAPI = (data) => {
// return request.post('/v1_0/authorizations', data)
// }
// 用户请求登录模块
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})
// 发送验证码模块
// 每分钟发一次
export const sendSms = mobile => request({
  url: `/v1_0/sms/codes/${mobile}`,
  method: 'GET'
})
// 获取用户个人信息
export const userInfoAPI = () => request({
  url: '/v1_0/user',
  method: 'GET'
  // 请求参数
  // 接口需要授权才能访问
  // token的数据格式 ：Bearer token数据 ，Bearer后面有空格
})
// 获取用户频道列表
export const channelAPI = () => request({
  url: '/v1_0/user/channels',
  method: 'GET'
  // 请求参数
  // 接口需要授权才能访问
  // token的数据格式 ：Bearer token数据 ，Bearer后面有空格
})
// 关注用户
export const addFollow = (target) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target
  }
})
// 取消用户
export const deleteFollow = (target) => request({
  url: `/v1_0/user/followings/${target}`,
  method: 'DELETE'
})
