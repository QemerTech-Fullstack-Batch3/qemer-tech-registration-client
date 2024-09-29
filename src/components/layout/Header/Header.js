import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logoTemp from '../../../assets/image.png'
import { Link as ScrollLink } from 'react-scroll';
import { logout } from '../../../utils/auth';

const Header = ({ userRole, setUserRole }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setUserRole(null);
    navigate('/');
  };

  // const isAdminUser = ['Admin', 'Registrar', 'SuperAdmin'].includes(userRole);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logoTemp} alt="Qemer Logo" />
        <span>Qemer</span>
      </div>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <ScrollLink to="contact-us" smooth={true} duration={500}>Contact Us</ScrollLink>
        {userRole ? (
          <a href="/" onClick={handleLogout} className={styles.navLink}>Logout</a>
        ) : (
          <Link to="/admin/login" className={styles.navLink}>Admin Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;