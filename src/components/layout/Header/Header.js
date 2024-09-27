import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
// import logo from '../assets/qemer-logo.png'; // Make sure to add your logo file
import logoTemp from '../../../assets/image.png'
const Header = ({ userRole }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logoTemp} alt="Qemer Logo" />
        <span>Qemer</span>
      </div>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/contact">Contact Us</Link>
        {userRole === 'admin' && (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;