import api from './apiConfig';

const registrationApi = {
  registerForCourse: (registrationData) => api.post('/registration/registerforcourse', registrationData),
  getRegisters: () => api.get('/registration/getregisters'),
  getStudentRegistrationInfo: (id) => api.get(`/registration/getregistrationinfo/${id}`),
  deleteRegistration: (id) => api.delete(`/registration/deleteregisters/${id}`),
  deleteRegistrationCollection: () => api.delete('/registration/deleteregistrationcollection'),
};

export default registrationApi;