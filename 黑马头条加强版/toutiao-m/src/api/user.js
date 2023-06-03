import request from '@/units/request'
export const loginAPI = (data) => {
  return request.post('/api/login', data)
}
