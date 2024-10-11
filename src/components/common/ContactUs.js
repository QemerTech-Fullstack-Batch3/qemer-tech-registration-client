import React, { useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './ContactUs.module.css';
import emailjs from '@emailjs/browser';

const ContactSchema = Yup.object().shape({
  user_name: Yup.string().required('Full name is required'),
  user_email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string().required('Message is required'),
});

const ContactUs = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await emailjs.sendForm(
        'service_y77h9i4',
        'template_s4dbzth',
        form.current,{
          publicKey: '0k8ZpPT0X_t-H7xFP'
        }
      );
      alert('Message sent successfully!');
      resetForm();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactUs} id="contact-us">
      <div className={styles.contactInfo}>
        <h2>Contact Us</h2>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>
      <Formik
        initialValues={{ user_name: '', user_email: '', message: '' }}
        validationSchema={ContactSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form ref={form} className={styles.form}>
            <div className={styles.formGroup}>
              <Field type="text" name="user_name" placeholder="Full Name" />
              <ErrorMessage name="user_name" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <Field type="email" name="user_email" placeholder="Email" />
              <ErrorMessage name="user_email" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <Field as="textarea" name="message" placeholder="Your Message" />
              <ErrorMessage name="message" component="div" className={styles.error} />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactUs;

