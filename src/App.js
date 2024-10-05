import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import CoursePage from './pages/CoursePage/CoursePage';
import RegistrationForm from './pages/RegistrationPage/RegistrationForm'
import AdminRoutes from './routes/AdminRoutes';
import styles from './App.module.css';

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  return (
    <Router>
      <div className={styles.app}>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes setUserRole={setUserRole} />} />
          <Route
            path="*"
            element={
              <>
                <Header userRole={userRole} setUserRole={setUserRole} />
                <main className={styles.mainContent}>
                  <Routes>
                    <Route exact path="/" element={<LandingPage />} />
                    <Route path="/courses/:id" element={<CoursePage />} />
                    <Route path="/register/:courseId" element={<RegistrationForm />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;