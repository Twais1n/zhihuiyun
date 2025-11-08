import request from '@/utils/request'

export const getOrderList = (params) => request.get('/api/retail', { params })

export const getOrderDetail = (id) => request.get('/api/retail/' + id)