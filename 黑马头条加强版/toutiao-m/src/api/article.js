import request from '@/units/request'
// 获取文章新闻
export const articlesAPI = (params) => request({
  url: '/v1_0/articles',
  method: 'GET',
  params
})
// 获取新闻文章详情
export const articlesDetails = (articleId) => request({
  url: `/v1_0/articles/${articleId}`,
  method: 'GET'
})
