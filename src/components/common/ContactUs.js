import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './ContactUs.module.css';

const ContactSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  message: Yup.string().required('Message is required'),
});

const ContactUs = () => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Here you would typically send the form data to your backend
    console.log(values);
    alert('Message sent successfully!');
    setSubmitting(false);
    resetForm();
  };

  return (
    <div className={styles.contactUs} id="contact-us">
      <h2>Contact Us</h2>
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', phone: '', message: '' }}
        validationSchema={ContactSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.formGroup}>
              <Field type="text" name="firstName" placeholder="First Name" />
              <ErrorMessage name="firstName" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <Field type="text" name="lastName" placeholder="Last Name" />
              <ErrorMessage name="lastName" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <Field type="tel" name="phone" placeholder="Phone Number" />
              <ErrorMessage name="phone" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <Field as="textarea" name="message" placeholder="Your Message" />
              <ErrorMessage name="message" component="div" className={styles.error} />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Send Message
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactUs;