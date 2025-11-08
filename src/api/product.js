import request from "@/utils/request";



export const getProduct= (params) => request.get('/api/product/query', { params });

export const addProduct = (data) => request.post('/api/product/add', data);
