import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './RegistrationPage.module.css';
import courseApi from '../../api/courseApi';
import registrationApi from '../../api/registrationApi';

const RegistrationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  gender: Yup.string().required('Gender is required'),
  phone: Yup.string().required('Phone number is required'),
  havePc: Yup.string().required('This field is required'),
  CityOfResidence: Yup.string().required('City of residence is required'),
});

const RegistrationPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const response = await courseApi.getCourseInfo(courseId);
        setCourse(response.data.course);
      } catch (error) {
        console.error('Error fetching course info:', error);
        setErrorMessage('Failed to load course information. Please try again later.');
      }
    };
    fetchCourseInfo();
  }, [courseId]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const registrationData = { ...values, courseId };
      const response = await registrationApi.registerForCourse(registrationData);
      console.log('Success:', response.data);
      setConfirmationMessage('Registration successful! Thank you for registering.');
      resetForm();
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.response?.data || 'An error occurred during registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.registrationPage}>
      <h1>Course Registration</h1>
      {course && <h2>{course.courseName}</h2>}
      {confirmationMessage && (
        <div className={styles.confirmationMessage}>
          {confirmationMessage}
        </div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
      <Formik
        initialValues={{ fullName: '', gender: '', phone: '', havePc: '', CityOfResidence: '' }}
        validationSchema={RegistrationSchema}
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
              <label htmlFor="gender">Gender</label>
              <Field as="select" name="gender">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
              <ErrorMessage name="gender" component="div" className={styles.error} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <Field type="tel" name="phone" />
              <ErrorMessage name="phone" component="div" className={styles.error} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="havePc">Do you have a PC?</label>
              <Field as="select" name="havePc">
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Field>
              <ErrorMessage name="havePc" component="div" className={styles.error} />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="CityOfResidence">City of Residence</label>
              <Field as="select" name="CityOfResidence">
                <option value="">Select city</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Outside Addis Ababa">Outside Addis Ababa</option>
              </Field>
              <ErrorMessage name="CityOfResidence" component="div" className={styles.error} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationPage;