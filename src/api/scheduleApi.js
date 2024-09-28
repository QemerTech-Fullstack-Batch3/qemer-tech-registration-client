import api from './apiConfig';

const scheduleApi = {
  createSchedule: (scheduleData) => api.post('/schedule/createschedule', scheduleData),
  getSchedules: () => api.get('/schedule/getschedules'),
  getSchedule: (id) => api.get(`/schedule/getschedule/${id}`),
  getScheduleOfACourse: (id) => api.get(`/schedule/getscheduleofacourse/${id}`),
  deleteScheduleCollection: () => api.delete('/schedule/deleteschedulecollection'),
};

export default scheduleApi;