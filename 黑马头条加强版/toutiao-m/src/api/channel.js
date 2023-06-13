import request from '@/units/request'
// 获取频道列表
export const channelAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})
// 添加用户频道列表
export const addUserChannel = (channel) => request({
  url: '/v1_0/user/channels',
  method: 'PATCH',
  data: {
    channels: [channel]
  }
})
// 删除用户频道列表
export const deleteUserChannel = (channelId) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})
