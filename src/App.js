import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import CoursePage from './pages/CoursePage/CoursePage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import styles from './App.module.css';

function App() {
  // Placeholder for user role, replace with actual authentication logic
  const userRole = 'student'; // or 'admin'

  return (
    <Router>
      <div className={styles.app}>
        <Header userRole={userRole} />
        <main className={styles.mainContent}>
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/courses/:type" element={<CoursePage />} />
            <Route path="/register/:courseId" element={<RegistrationPage />} />
            {userRole === 'admin' && <Route path="/admin" element={<AdminDashboard />} />}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;