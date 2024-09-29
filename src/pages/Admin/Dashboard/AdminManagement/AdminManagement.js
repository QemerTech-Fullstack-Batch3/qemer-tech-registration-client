import React, { useState, useEffect } from 'react';
import styles from './AdminManagement.module.css';
import adminApi from '../../../../api/adminApi';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [registrars, setRegistrars] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [adminsResponse, registrarsResponse, pendingResponse] = await Promise.all([
        adminApi.getAdmins(),
        adminApi.getRegistrars(),
        adminApi.getUsersInPending()
      ]);
      setAdmins(adminsResponse.data.admins);
      setRegistrars(registrarsResponse.data.Registrar);
      setPendingUsers(pendingResponse.data.UsersInPending);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleAssignRole = async (adminId, role) => {
    try {
      await adminApi.assignRole(adminId, role);
      fetchAdminData();
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  return (
    <div className={styles.adminManagement}>
      <h2 className={styles.title}>Admin Management</h2>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Pending Users</h3>
        {pendingUsers.length === 0 ? (
          <p className={styles.emptyMessage}>No pending users</p>
        ) : (
          <ul className={styles.userList}>
            {pendingUsers.map(user => (
              <li key={user._id} className={styles.userItem}>
                <div className={styles.userInfo}>
                  <span className={styles.username}>{user.username}</span>
                  <span className={styles.email}>{user.email}</span>
                </div>
                <div className={styles.actions}>
                  <button 
                    onClick={() => handleAssignRole(user._id, 'Admin')}
                    className={`${styles.button} ${styles.adminButton}`}
                  >
                    Assign Admin
                  </button>
                  <button 
                    onClick={() => handleAssignRole(user._id, 'Registrar')}
                    className={`${styles.button} ${styles.registrarButton}`}
                  >
                    Assign Registrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Active Admins</h3>
        {admins.length === 0 ? (
          <p className={styles.emptyMessage}>No active admins</p>
        ) : (
          <ul className={styles.userList}>
            {admins.map(admin => (
              <li key={admin._id} className={styles.userItem}>
                <span className={styles.username}>{admin.username}</span>
                <span className={styles.email}>{admin.email}</span>
                <span className={styles.role}>{admin.role}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Active Registrars</h3>
        {registrars.length === 0 ? (
          <p className={styles.emptyMessage}>No active registrars</p>
        ) : (
          <ul className={styles.userList}>
            {registrars.map(registrar => (
              <li key={registrar._id} className={styles.userItem}>
                <span className={styles.username}>{registrar.username}</span>
                <span className={styles.email}>{registrar.email}</span>
                <span className={styles.role}>{registrar.role}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;