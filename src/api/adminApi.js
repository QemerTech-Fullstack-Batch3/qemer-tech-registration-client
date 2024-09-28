import api from './apiConfig';

const adminApi = {
  loginSuperAdmin: (email, password) => api.post('/user/loginSuperAdmin', { email, password }),
  signup: (userData) => api.post('/user/signup', userData),
  login: (email, password) => api.post('/user/login', { email, password }),
  getUsersInPending: () => api.get('/user/getuserinpending'),
  assignRole: (adminId, role) => api.patch(`/user/assignrole/${adminId}`, { role }),
  getAdmins: () => api.get('/user/getadmins'),
  getRegistrars: () => api.get('/user/getregistrars'),
};

export default adminApi;