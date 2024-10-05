import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import hero from '../../assets/hero2.jpg';
import packageApi from '../../api/packageApi';
import ContactUs from '../../components/common/ContactUs';

const LandingPage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await packageApi.getPackages();
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  return (
    <div className={styles.landingPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Qemer Software technology</h1>
          <p>Empowering your future through technology</p>
        </div>
        <div className={styles.heroImage}>
          <img src={hero} alt="Qemer Tech" />
        </div>
      </section>

      <section className={styles.ourServices}>
        <h2>Our Services</h2>
        <div className={styles.packageGrid}>
          {packages.map(pkg => (
            <div key={pkg._id} className={styles.packageCard}>
              <h3>{pkg.packageName}</h3>
              <p className={styles.packageDescription}>{pkg.description}</p>
              <Link to={`/courses/${pkg._id}`} className={styles.getStartedBtn}>
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