import request from '@/utils/request'

export const getCustomerList = (params) => request.get('/api/customers/query', { params })
export const getVipLevels = (params) => request.get('/api/vip-type', { params })
export const getFollowUpList = (params) => request.get('/api/customer/followup', { params })