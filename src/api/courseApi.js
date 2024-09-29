// src/api/courseApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/course'; 

const courseApi = {
  getCourses: () => axios.get(`${BASE_URL}/getcourses`),
  getCourseInfo: (id) => axios.get(`${BASE_URL}/getcourseinfo/${id}`),
  createCourse: (courseData) => axios.post(`${BASE_URL}/createcourse`, courseData),
  editCourse: (id, courseData) => axios.put(`${BASE_URL}/editcourse/${id}`, courseData),
};

export default courseApi;