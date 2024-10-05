export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userRole');
  
  window.location.href = '/admin/login';
};