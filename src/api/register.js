import request from '@/utils/request';

export const RegisterApi = (data) => request.post('/api/user/register', data);

