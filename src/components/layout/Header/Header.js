import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

import { Link as ScrollLink } from 'react-scroll';
import { logout } from '../../../utils/auth';

const Header = ({ userRole, setUserRole, showNavLinks = true }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setUserRole(null);
    navigate('/admin/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {/* <img src={logo} alt="Qemer Logo" /> */}
        <span>Qemer</span>
      </div>
      {showNavLinks && (
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <ScrollLink to="contact-us" smooth={true} duration={500}>Contact Us</ScrollLink>
        </nav>
      )}
      {userRole && (
        <nav className={styles.nav}>
          <a href="/admin/login" onClick={handleLogout} className={styles.navLink}>Logout</a>
        </nav>
      )}
    </header>
  );
};
export default Header;