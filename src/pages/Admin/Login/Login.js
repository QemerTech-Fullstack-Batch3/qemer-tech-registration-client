import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import styles from './Login.module.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const AdminLogin = ({ setUserRole, showNavLinks}) => {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await adminApi.login(values.email, values.password);
      if (['Admin', 'Registrar', 'SuperAdmin'].includes(response.data.role)) {
        localStorage.setItem('userToken', response.data.accessToken);
        localStorage.setItem('userRole', response.data.role);
        setUserRole(response.data.role);
        navigate('/admin/dashboard');
      } else {
        setLoginError('Access denied. Only admin users can log in.');
      }
    } catch (error) {
      setLoginError('Invalid email or password');
      console.error('Login error:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.loginPage}>
      <h1>Admin Login</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>

            {loginError && <div className={styles.error}>{loginError}</div>}

            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminLogin;