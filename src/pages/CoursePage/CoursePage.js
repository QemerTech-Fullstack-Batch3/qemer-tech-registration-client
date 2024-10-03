import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CoursePage.module.css';
import packageApi from '../../api/packageApi';

const CoursePage = () => {
  const [packageDetails, setPackageDetails] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await packageApi.getPackageById(id);
        setPackageDetails(response.data);
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const countDaysPerWeek = (daysOfWeek) => {
    if (!daysOfWeek || !Array.isArray(daysOfWeek)) return 'N/A';
    return daysOfWeek.filter(day => day.isSelected).length || 'N/A';
  };
  const navigate = useNavigate();

  const handleGetStarted = (courseId) => {
    navigate(`/register/${courseId}`);
  };
  if (!packageDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.coursePage}>
      <h1 className={styles.pageTitle}>{packageDetails.packageName}</h1>
      <p className={styles.packageDescription}>{packageDetails.description}</p>
      <h2 className={styles.packageTitle}>{packageDetails.packageName} packages:</h2>
      <div className={styles.programGrid}>
        {packageDetails.courses.map(course => (
          <div key={course._id} className={styles.programCard}>
            <div className={styles.priceGroup}>
              <h2 className={styles.coursePrice}>{course.price} ETB</h2>
              <p className={styles.priceSubtext}>per student, per Package</p>
              <h3 className={styles.courseName}>{course.courseName}</h3>
            </div>
            <div className={styles.infoGroup}>
              <p className={styles.courseDescription}>{course.description}</p>
              <div className={styles.durationGroup}>
                <p className={styles.courseDuration}>
                  <i className="fas fa-clock"></i> {course.duration}
                </p>
                <p className={styles.daysPerWeek}>
                  <i className="fas fa-calendar-alt"></i> {countDaysPerWeek(course.daysOfWeek)} days/week
                </p>
              </div>
            </div>
            <p className={`${styles.registrationStatus} ${styles[course.courseRegistrationStatus.toLowerCase()]}`}>
              {course.courseRegistrationStatus}
            </p>
            <button
              className={styles.getStartedBtn}
              onClick={() => handleGetStarted(course._id)}
            >
              Get started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;