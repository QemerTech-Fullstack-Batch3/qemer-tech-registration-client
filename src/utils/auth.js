export const logout = () => {
  // Clear any authentication tokens or user data from localStorage
  localStorage.removeItem('userToken');
  localStorage.removeItem('userRole');
  
  // Redirect to the home page
  window.location.href = '/';
};