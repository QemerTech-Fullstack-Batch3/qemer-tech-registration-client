import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import hero from '../../assets/hero.jpg';
import courseApi from '../../api/courseApi';
import ContactUs from '../../components/common/ContactUs';

const LandingPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className={styles.landingPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Qemer</h1>
          <p>Empowering students with quality education</p>
        </div>
        <div className={styles.heroImage}>
          {/* <img src={hero} alt="Hero" /> */}
        </div>
      </section>

      <section className={styles.ourServices}>
        <h2>Our Services</h2>
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <div key={course._id} className={styles.courseCard}>
              <h3>{course.courseName}</h3>
              <div className={styles.courseInfo}>
                <p className={styles.courseDescription}>{course.description}</p>
                <div className={styles.courseDetails}>
                  <span><strong>Duration:</strong> {course.duration}</span>
                  <span><strong>Status:</strong> {course.courseRegistrationStatus}</span>
                </div>
              </div>
              <Link to={`/courses/${course._id}`} className={styles.getStartedBtn}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>
      <ContactUs />
    </div>
  );
};

export default LandingPage;