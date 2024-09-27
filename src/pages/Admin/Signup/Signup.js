import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './Signup.module.css';

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const AdminSignUp = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    // Handle admin sign up logic here
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div className={styles.signUpPage}>
      <h1>Admin Sign Up</h1>
      <Formik
        initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <Field type="text" name="fullName" />
              <ErrorMessage name="fullName" component="div" className={styles.error} />
            </div>

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

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminSignUp;