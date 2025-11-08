import request from '@/utils/request'

// 获取退单列表
export const getRefundList = (params) => request.get('/api/refunds/query', { params })

// 导出退单数据
export const exportRefundData = (params) => request.get('/api/refunds/export', { params, responseType: 'blob' })