import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BecomeAdmin.module.css';

const BecomeAdmin = () => {
  return (
    <div className={styles.becomeAdmin}>
      <h1>Become an Admin</h1>
      <p>If you want to become an admin for Qemer, please sign up here:</p>
      <Link to="/admin/signup" className={styles.signupLink}>Admin Sign Up</Link>
    </div>
  );
};

export default BecomeAdmin;