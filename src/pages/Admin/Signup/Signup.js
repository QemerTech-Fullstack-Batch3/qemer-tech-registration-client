// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import adminApi from '../../../api/adminApi';
// import styles from './Signup.module.css';

// const AdminSignUp = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       const response = await adminApi.signup({
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//       });
//       setSuccess(response.data.message);
//       setTimeout(() => {
//         navigate('/admin/login');
//       }, 3000);
//     } catch (error) {
//       setError(error.response?.data || 'An error occurred during signup');
//     }
//   };

//   return (
//     <div className={styles.signupContainer}>
//       <form className={styles.signupForm} onSubmit={handleSubmit}>
//         <h2>Admin Sign Up</h2>
//         {error && <div className={styles.error}>{error}</div>}
//         {success && <div className={styles.success}>{success}</div>}
//         <div className={styles.inputGroup}>
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className={styles.inputGroup}>
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className={styles.inputGroup}>
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className={styles.inputGroup}>
//           <label htmlFor="confirmPassword">Confirm Password</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit" className={styles.submitButton}>Sign Up</button>
//         <div className={styles.loginLink}>
//           Already have an account? <Link to="/admin/login">Sign in</Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdminSignUp;