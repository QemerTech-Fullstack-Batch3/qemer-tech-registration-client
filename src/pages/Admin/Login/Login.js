import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const AdminLogin = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    // Handle admin login logic here
    console.log(values);
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