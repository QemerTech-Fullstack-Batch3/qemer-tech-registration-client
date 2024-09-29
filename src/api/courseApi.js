// // src/api/courseApi.js
// import axios from 'axios';

// const BASE_URL = 'http://localhost:5000/course'; 

// const courseApi = {
//   getCourses: () => axios.get(`${BASE_URL}/getcourses`),
//   getCourseInfo: (id) => axios.get(`${BASE_URL}/getspecificcourse/${id}`),
//   createCourse: (courseData) => axios.post(`${BASE_URL}/createcourse`, courseData),
//   editCourse: (id, courseData) => axios.patch(`${BASE_URL}/editcourse/${id}`, courseData),
//   // updatestatus: (cousreId) => axios.patch(`${BASE_URL}/updatestatus/${cousreId}`)
// };

// export default courseApi;

import api from './apiConfig'
const courseApi = {
  getCourses: () => api.get('/course/getcourses'),
  getCourseInfo: (id) => api.get(`/course/getspecificcourse/${id}`),
  createCourse: (courseData) => api.post('/course/createcourse', courseData),
  editCourse: (id, courseData) => api.patch(`/course/editcourse/${id}`, courseData),
  // updateStatus: (courseId) => api.patch(`/course/updatestatus/${courseId}`)

}
export default courseApi