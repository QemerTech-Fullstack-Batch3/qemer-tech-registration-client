import api from './apiConfig';

const packageApi = {
  createPackage: (packageData) => api.post('/package/createpackage', packageData),
  getPackages: () => api.get('/package/getpackages'),
  getPackagesWithCourse: () => api.get('/package/getpackageswithcourses'),
  getPackageById: (id) => api.get(`/package/getpackage/${id}`),
  updatePackage: (id, packageData) => api.patch(`/package/updatepackage/${id}`, packageData),
  deletePackage: (id) => api.delete(`/package/deletepackage/${id}`)
};

export default packageApi;