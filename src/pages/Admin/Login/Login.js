import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import styles from './Login.module.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const AdminLogin = ({ setUserRole }) => {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await adminApi.login(values.email, values.password);
      localStorage.setItem('userToken', response.data.accessToken);
      setUserRole('Admin');
      navigate('/admin/dashboard');
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
      <div className={styles.signupLink}>
        Don't have an account? <Link to="/admin/signup">Create new account</Link>
      </div>
    </div>
  );
};

export default AdminLogin;