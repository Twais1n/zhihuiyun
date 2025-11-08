import request from '@/utils/request'

export const getIntegralFlow = (params) => {
  return request({
    url: '/api/integral',
    method: 'get',
    params
  })
}