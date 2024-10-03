import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

  if (!packageDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.coursePage}>
      <h1>{packageDetails.packageName}</h1>
      <p className={styles.packageDescription}>{packageDetails.description}</p>
      <h2 className={styles.packageTitle}>{packageDetails.packageName} packages:</h2>
      <div className={styles.programGrid}>
        {packageDetails.courses.map(course => (
          <div key={course._id} className={styles.programCard}>
            <h3>{course.courseName}</h3>
            <p className={styles.courseDescription}>{course.description}</p>
            <div className={styles.courseDetails}>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Price:</strong> ${course.price}</p>
              <p><strong>Learning Mode:</strong> {course.learningMode}</p>
            </div>
            <div className={`${styles.registrationStatus} ${styles[course.courseRegistrationStatus.toLowerCase()]}`}>
              {course.courseRegistrationStatus}
            </div>
            <button className={styles.registerBtn}>Register</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;