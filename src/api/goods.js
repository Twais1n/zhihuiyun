import request from '@/utils/request'

export const getGoodsList = (params) => request.get('/api/goods', { params })