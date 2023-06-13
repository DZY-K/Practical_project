import request from '@/units/request'
// 搜索建议
export const searchSuggest = q => request({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: {
    q
  }
})
// 获取搜索结果
export const searchResult = params => request({
  url: '/v1_0/search',
  method: 'GET',
  params
})
