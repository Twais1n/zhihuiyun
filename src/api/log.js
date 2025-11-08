import request from '@/utils/request';

export const LoginApi = (data) => request.post('/api/user/login', data);

export const ChangePasswordApi = (data) => request.post('/api/user/change-password', data);
