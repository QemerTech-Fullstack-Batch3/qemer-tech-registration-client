import api from './apiConfig'

const scheduleApi = {
  getSchedules: () => api.get('/schedule/getschedules'),
  getSchedule: (id) => api.get(`/schedule/getschedule/${id}`),
  getScheduleOfACourse: (id) => api.get(`/schedule/getscheduleofacourse/${id}`),
  createSchedule: (scheduleData) => api.post('/schedule/createschedule', scheduleData),
  updateSchedule: (id, scheduleData) => api.patch(`/schedule/updateschedule/${id}`, scheduleData),
  deleteSchedule: (id) => api.delete(`/schedule/deleteschedule/${id}`)
};

export default scheduleApi;