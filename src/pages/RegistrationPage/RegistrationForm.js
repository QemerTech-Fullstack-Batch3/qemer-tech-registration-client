import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RegistrationForm.module.css';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import courseApi from '../../api/courseApi';
import registrationApi from '../../api/registrationApi';

const RegistrationForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    phone: '',
    havePc: '',
    CityOfResidence: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchCourseInfo = async () => { 
      try {
        const response = await courseApi.getCourseInfo(courseId);
        if (response.data && response.data.course) {
          setCourse(response.data.course);
        } else {
          setError('Invalid course data received');
        }
      } catch (error) {
        console.error('Error fetching course info:', error);
        setError('Failed to load course information. Please try again later.');
      }
    };
    fetchCourseInfo();
  }, [courseId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const registrationData = { ...formData, courseId };
      if (course.learningMode !== 'InPerson') {
        delete registrationData.CityOfResidence;
      }
      const response = await registrationApi.registerForCourse(registrationData);
      setSuccessMessage(response.data.data);
    } catch (error) {
      console.error('Error registering for course:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while registering. Please try again.');
      }
    }
  };
  const SuccessMessage = ({ message }) => (
    <div className={styles.successMessage}>
      <h3>{message.title}</h3>
      <p>{message.message}</p>
      {message.nextSteps && message.nextSteps.length > 0 && (
        <>
          <ul>
            {message.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
  if (!course) {
    return <LoadingSpinner />;  
  }

  return (
    <div className={styles.registrationForm}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      {successMessage ? (
        <SuccessMessage message={successMessage} />
      ) : (
        <>
          <h2>Register for {course.courseName}</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="havePc">Do you have a PC?</label>
              <select
                id="havePc"
                name="havePc"
                value={formData.havePc}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {course.learningMode === 'InPerson' && (
              <div className={styles.formGroup}>
                <label htmlFor="CityOfResidence">City of Residence</label>
                <select
                  id="CityOfResidence"
                  name="CityOfResidence"
                  value={formData.CityOfResidence}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select City</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Outside Addis Ababa">Outside Addis Ababa</option>
                </select>
              </div>
            )}
            <button type="submit" className={styles.submitButton}>
              Register
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default RegistrationForm;