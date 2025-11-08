import request from '@/utils/request'

export const getVoucherList = (params) => request.get('/api/voucher', { params })

export const getVoucherInformation = (params) => {
  return request({
    url: '/api/voucher/information',
    method: 'get',
    params
  })
}