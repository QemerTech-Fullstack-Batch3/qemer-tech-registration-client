import React, { useState, useEffect, useRef } from 'react';
import styles from './RegistrationManagement.module.css';
import registrationApi from '../../../../api/registrationApi';
import courseApi from '../../../../api/courseApi';

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState({});
  const detailsSectionRef = useRef(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await registrationApi.getRegisters();
      const registrationsWithCourses = await Promise.all(
        response.data.map(async (registration) => {
          const courseResponse = await courseApi.getCourseInfo(registration.courseId);
          return { ...registration, course: courseResponse.data.course };
        })
      );
      setRegistrations(registrationsWithCourses);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setIsViewingDetails(true);
    setTimeout(() => {
      if (detailsSectionRef.current) {
        detailsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCloseDetails = () => {
    setIsViewingDetails(false);
    setSelectedRegistration(null);
  };

  const groupedRegistrations = registrations.reduce((acc, registration) => {
    const courseName = `${registration.course.courseName} (Start: ${new Date(registration.course.startDate).toLocaleDateString()}, End: ${new Date(registration.course.endDate).toLocaleDateString()})`;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(registration);
    return acc;
  }, {});

  const handleToggleRegistrations = (courseName) => {
    setShowRegistrations(prev => ({
      ...prev,
      [courseName]: !prev[courseName]
    }));
  };

  return (
    <div className={styles.registrationManagement}>
      <h2 className={styles.title}>Registration Management</h2>

      <div className={styles.content}>
        {Object.keys(groupedRegistrations).map(courseInfo => (
          <div key={courseInfo} className={styles.categorySection}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.courseInfo}>{courseInfo.split(' (')[0]}</span>
              <span className={styles.courseDates}>{courseInfo.split(' (')[1]}</span>
            </h3>
            <button
              onClick={() => handleToggleRegistrations(courseInfo)}
              className={`${styles.viewRegistersButton} ${showRegistrations[courseInfo] ? styles.hide : ''}`}
            >
              {showRegistrations[courseInfo] ? 'Hide Registers' : 'View Registers'}
            </button>
            {showRegistrations[courseInfo] && (
              <ul className={styles.registrationList}>
                {groupedRegistrations[courseInfo].map(registration => (
                  <li key={registration._id} className={styles.registrationItem}>
                    <div className={styles.registrationInfo}>
                      <h4>{registration.fullName}</h4>
                      <p>Registration Date: {new Date(registration.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.registrationActions}>
                      <button onClick={() => handleViewDetails(registration)} className={styles.viewButton}>
                        View Details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {isViewingDetails && selectedRegistration && (
        <div className={styles.detailsSection} ref={detailsSectionRef}>
          <h3>Registration Details</h3>
          <button onClick={handleCloseDetails} className={styles.closeButton}>Close</button>
          <div className={styles.detailsContent}>
            <p><strong>Full Name:</strong> {selectedRegistration.fullName}</p>
            <p><strong>Gender:</strong> {selectedRegistration.gender}</p>
            <p><strong>Phone:</strong> {selectedRegistration.phone}</p>
            <p><strong>Has PC:</strong> {selectedRegistration.havePc}</p>
            <p><strong>City of Residence:</strong> {selectedRegistration.CityOfResidence}</p>
            <p><strong>Course:</strong> {selectedRegistration.course.courseName}</p>
            <p><strong>Learning Mode:</strong> {selectedRegistration.course.learningMode}</p>
            <p><strong>Registration Date:</strong> {new Date(selectedRegistration.registrationDate).toLocaleString()}</p>
            <p><strong>Payment Status:</strong> {selectedRegistration.paymentStatus}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationManagement;