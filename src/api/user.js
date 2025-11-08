import request from '@/utils/request';

export const ChangePermissionApi = (data) => request.post('/api/user/permission', data);

export const SearchUserApi = (data) => request.post('/api/user/search', data);

export const ChangePasswordApi = (data) => request.post('/api/user/changePassword', data);