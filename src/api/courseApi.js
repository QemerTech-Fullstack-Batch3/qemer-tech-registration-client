import api from './apiConfig';

const courseApi = {
  createCourse: (courseData) => api.post('/course/createcourse', courseData),
  getCourses: () => api.get('/course/getcourses'),
  getCourseInfo: (id) => api.get(`/course/getspecificcourse/${id}`),
  editCourse: (id, courseData) => api.patch(`/course/editcourse/${id}`, courseData),
  updateCourseStatus: (courseId) => api.patch(`/course/updatestatus/${courseId}`),
  deleteCourseCollection: () => api.delete('/course/deletecoursecollection'),
};

export default courseApi;