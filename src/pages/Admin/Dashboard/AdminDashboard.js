import React, { useState } from 'react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const renderContent = () => {
    switch(activeTab) {
      case 'courses':
        return <CourseManagement />;
      case 'registrations':
        return <RegistrationManagement />;
      case 'schedules':
        return <ScheduleManagement />;
      case 'admins':
        return <AdminManagement />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <nav className={styles.sidebar}>
        <button onClick={() => setActiveTab('courses')}>Courses</button>
        <button onClick={() => setActiveTab('registrations')}>Registrations</button>
        <button onClick={() => setActiveTab('schedules')}>Schedules</button>
        <button onClick={() => setActiveTab('admins')}>Admins</button>
      </nav>
      <main className={styles.content}>
        {renderContent()}
      </main>
    </div>
  );
};

const CourseManagement = () => (
  <div>
    <h2>Course Management</h2>
    {/* Add course management functionality here */}
  </div>
);

const RegistrationManagement = () => (
  <div>
    <h2>Registration Management</h2>
    {/* Add registration management functionality here */}
  </div>
);

const ScheduleManagement = () => (
  <div>
    <h2>Schedule Management</h2>
    {/* Add schedule management functionality here */}
  </div>
);

const AdminManagement = () => (
  <div>
    <h2>Admin Management</h2>
    {/* Add admin management functionality here */}
  </div>
);

export default AdminDashboard;