import request from '@/utils/request';

export const getOfflineOrders = (params) => request.get('/api/offline/orders/query', { params });
export const getOfflineReturns = (params) => request.get('/api/offline/returns/query', { params });