import React, { useState } from 'react';
import styles from './AdminDashboard.module.css';
import { FaBook, FaUserGraduate, FaUsersCog, FaBoxOpen } from 'react-icons/fa';

import CourseManagement from './CourseManagement/CourseMangement';
import RegistrationManagement from './RegistrationManagement/RegistrationManagement';
import AdminManagement from './AdminManagement/AdminManagement';
import PackageManagement from './PackageManagement/PackageManagement';
import ManageAccount from './ManageAccount/ManageAccount';

const AdminDashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('courses');

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return <CourseManagement userRole={userRole} />;
      case 'registrations':
        return <RegistrationManagement />;
      case 'packages':
        return <PackageManagement />;
      case 'admins':
        return userRole === 'SuperAdmin' ? <AdminManagement /> : null;
      case 'account':
        return userRole !== 'SuperAdmin' ? <ManageAccount /> : null;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className={styles.adminDashboard}>
        <nav className={styles.sidebar}>
          <ul>
            <li className={activeTab === 'courses' ? styles.active : ''}>
              <button onClick={() => setActiveTab('courses')}>
                <FaBook /> Courses
              </button>
            </li>
            <li className={activeTab === 'registrations' ? styles.active : ''}>
              <button onClick={() => setActiveTab('registrations')}>
                <FaUserGraduate /> Registrations
              </button>
            </li>
            <li className={activeTab === 'packages' ? styles.active : ''}>
              <button onClick={() => setActiveTab('packages')}>
                <FaBoxOpen /> Packages
              </button>
            </li>
            {userRole === 'SuperAdmin' && (
              <li className={activeTab === 'admins' ? styles.active : ''}>
                <button onClick={() => setActiveTab('admins')}>
                  <FaUsersCog /> Admin Management
                </button>
              </li>
            )}
            {userRole !== 'SuperAdmin' && (
              <li className= {activeTab === 'account' ? styles.active: ''}>
                <button onClick ={() => setActiveTab('account')}>
                  <FaUsersCog /> Manage Account
                </button>
              </li>
            )}
          </ul>
        </nav>
        <main className={styles.content}>
          {renderContent()}
        </main>
      </div>
      );
};

export default AdminDashboard;