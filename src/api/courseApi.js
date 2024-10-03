import api from './apiConfig'
const courseApi = {
  getCourses: () => api.get('/course/getcourses'),
  getCourseInfo: (id) => api.get(`/course/getspecificcourse/${id}`),
  createCourse: (courseData) => api.post('/course/createcourse', courseData),
  editCourse: (id, courseData) => api.patch(`/course/editcourse/${id}`, courseData),
  // updateStatus: (courseId) => api.patch(`/course/updatestatus/${courseId}`)

}
export default courseApi