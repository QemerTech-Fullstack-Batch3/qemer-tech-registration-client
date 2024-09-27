import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logoTemp from '../../../assets/image.png'
import { Link as ScrollLink } from 'react-scroll';
import { logout } from '../../../utils/auth';

const Header = ({ userRole }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logoTemp} alt="Qemer Logo" />
        <span>Qemer</span>
      </div>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <ScrollLink to="contact-us" smooth={true} duration={500}>Contact Us</ScrollLink>
        {userRole === 'admin' ? (
          <div className={styles.userMenu}>
            <Link to="/admin/dashboard" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
              Admin
            </Link>
            {showUserMenu && (
              <ul className={styles.dropdownMenu} onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
              </ul>
            )}
          </div>
        ) : userRole !== 'student' && (
          <Link to="/admin/login">Admin Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;