import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes setUserRole={setUserRole} />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;