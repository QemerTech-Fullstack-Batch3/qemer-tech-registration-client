import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import InPerson from '../../assets/InPerson.jpg'
import Online2 from '../../assets/Online2.jpg'
import hero from '../../assets/hero.jpg'
const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Qemer</h1>
          <p>Empowering students with quality education</p>
        </div>
        <div className={styles.heroImage}>
          {/* Add your hero image here */}
        </div>
      </section>
      
      <section className={styles.courseTypes}>
        <div className={styles.courseType}>
          <div className={styles.courseTypeImage}>
            <img src={InPerson} alt="InPerson"/>
          </div>
          <div className={styles.courseTypeContent}>
            <h2>In-Person Courses</h2>
            <p>Experience hands-on learning with our expert instructors.</p>
            <Link to="/courses/in-person" className={styles.learnMoreBtn}>Learn More</Link>
          </div>
        </div>
        
        <div className={styles.courseType}>
          <div className={styles.courseTypeImage}>
          <img src={Online2} alt="Online"/>
          </div>
          <div className={styles.courseTypeContent}>
            <h2>Online Courses</h2>
            <p>Flexible learning from the comfort of your home.</p>
            <Link to="/courses/online" className={styles.learnMoreBtn}>Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;