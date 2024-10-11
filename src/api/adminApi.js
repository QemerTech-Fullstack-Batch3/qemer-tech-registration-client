import api from './apiConfig';

const adminApi = {
  login: (email, password) => api.post('/user/login', { email, password }),
  createAdmin: (data) => api.post('/user/createadmin', {data}),
  getAdmins: () => api.get('/user/getadmins'),
  getRegistrars: () => api.get('/user/getregistrars'),
  changeAdminPassword: (data) => api.patch('/user/changeadminpassword', data), 
};

export default adminApi;