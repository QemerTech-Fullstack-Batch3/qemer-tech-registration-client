import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CoursePage.module.css';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import packageApi from '../../api/packageApi';

const CoursePage = () => {
  const [packageDetails, setPackageDetails] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleGetStarted = (courseId) => {
    navigate(`/register/${courseId}`);
  };

  if (!packageDetails) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.coursePage}>
      <h1 className={styles.pageTitle}>{packageDetails.packageName}</h1>
      <p className={styles.packageDescription}>{packageDetails.description}</p>
      <h2 className={styles.packageTitle}>{packageDetails.packageName} packages:</h2>

      <div className={styles.programGrid}>
        {packageDetails.courses.map(course => {
          const isRegistrationOpen = course.courseRegistrationStatus === 'On Registration';
          const isInProgress = course.courseRegistrationStatus === 'On Progress';
          const isEnded = course.courseRegistrationStatus === 'Ended';

          return (
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
                    <span className={styles.numberHighlight}>
                      {course.duration.split(' ')[0]}
                    </span>
                    {course.duration.split(' ').slice(1).join(' ')}
                  </p>
                  <p className={styles.daysPerWeek}>
                    <span className={styles.numberHighlight}>
                      {course.dayOfWeek.length}
                    </span>
                    days per week
                  </p>
                </div>
                <div className={styles.dateGroup}>
                  <div className={styles.dateInfo}>
                    <span className={styles.dateLabel}>Start Date</span>
                    <span className={styles.dateValue}>
                      {new Date(course.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className={styles.dateInfo}>
                    <span className={styles.dateLabel}>End Date</span>
                    <span className={styles.dateValue}>
                      {new Date(course.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p className={`${styles.registrationStatus} ${styles[course.courseRegistrationStatus.toLowerCase().replace(' ', '')]}`}>
                {course.courseRegistrationStatus}
              </p>
              {isRegistrationOpen && (
                <button
                  className={styles.getStartedBtn}
                  onClick={() => handleGetStarted(course._id)}
                >
                  Get started
                </button>
              )}
              {isInProgress && (
                <p className={styles.closedMessage}>
                  Registration is closed. The course is currently in progress.
                </p>
              )}
              {isEnded && (
                <p className={styles.closedMessage}>
                  Registration is closed. The course has ended.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePage;