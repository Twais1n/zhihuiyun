import request from '@/utils/request'

export const getCustomerList = (params) => request.get('/api/customers/page', { params })
export const getVipLevels = (params) => request.get('/api/vip-type', { params })
export const getFollowUpList = (params) => request.get('/api/customer/followup', { params })
export const getVipLevelCount = (params) => request.get('/api/vip/typeCount', { params })
export const getSalespersonList = (params) => request.get('/api/vip/salespersons', { params })
