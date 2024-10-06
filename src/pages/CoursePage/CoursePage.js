import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CoursePage.module.css';
import packageApi from '../../api/packageApi';
import scheduleApi from '../../api/scheduleApi';

const CoursePage = () => {
  const [packageDetails, setPackageDetails] = useState(null)
  const [schedules, setSchedules] = useState({})
  const { id } = useParams();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await packageApi.getPackageById(id);
        setPackageDetails(response.data);

        // Fetch schedules for all courses in the package
        const schedulePromises = response.data.courses.map(course =>
          scheduleApi.getScheduleOfACourse(course._id)
        );
        const scheduleResponses = await Promise.all(schedulePromises);
        const scheduleData = {};
        scheduleResponses.forEach((response, index) => {
          scheduleData[response.data.courseId] = response.data;
        });
        setSchedules(scheduleData);
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const countDaysPerWeek = (courseId) => {
    const schedule = schedules[courseId];
    if (!schedule || !schedule.dayOfWeek) return 'N/A';
    return schedule.dayOfWeek.length;
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
                  <i className="fas fa-clock"></i>
                  <span className={styles.numberHighlight}>
                    {course.duration.split(' ')[0]}
                  </span>
                  {course.duration.split(' ').slice(1).join(' ')}
                </p>
                <p className={styles.daysPerWeek}>
                  <i className="fas fa-calendar-alt"></i>
                  <span className={styles.numberHighlight}>
                    {countDaysPerWeek(course._id)}
                  </span>
                  days per week
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