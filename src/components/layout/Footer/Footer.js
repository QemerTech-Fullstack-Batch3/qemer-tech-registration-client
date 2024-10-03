import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Qemer</h3>
          <p>Empowering students with quality education</p>
        </div>
        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Contact</h3>
          <p>Email: info@qemer.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2024 Qemer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;