import React, { useState, useEffect } from 'react';
import styles from './AdminManagement.module.css';
import adminApi from '../../../../api/adminApi';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [registrars, setRegistrars] = useState([]);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    password: '',
    role: '', // Default role is empty
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [adminsResponse, registrarsResponse] = await Promise.all([
        adminApi.getAdmins(),
        adminApi.getRegistrars(),
      ]);
      setAdmins(adminsResponse.data.admins);
      setRegistrars(registrarsResponse.data.Registrar);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Failed to fetch admin data. Please check your connection or try again later.');
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminData.username || !newAdminData.email || !newAdminData.password || !newAdminData.role) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await adminApi.createAdmin(newAdminData);
      alert('Admin created successfully!');
      setNewAdminData({ username: '', email: '', password: '', role: '' });
      setIsCreatingAdmin(false);
      fetchAdminData();
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Failed to create admin. Please check the input and try again.');
    }
  };

  if (!admins.length || !registrars.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.adminManagement}>
      <h2 className={styles.title}>Admin Management</h2>

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

      <div className={styles.createSection}>
        <h2>Create Admin</h2>
        {!isCreatingAdmin && (
          <button onClick={() => setIsCreatingAdmin(true)} className={styles.createButton}>
            Create New Admin
          </button>
        )}
        {isCreatingAdmin && (
          <form className={styles.createAdminForm}>
            <input
              type="text"
              placeholder="Username"
              value={newAdminData.username}
              onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
              required
              className={styles.formInput}
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdminData.email}
              onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
              required
              className={styles.formInput}
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdminData.password}
              onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
              required
              className={styles.formInput}
            />
            <select
              value={newAdminData.role}
              onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value })}
              className={styles.formSelect}
              required
            >
              <option value="" disabled>Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Registrar">Registrar</option>
            </select>
            <div className={styles.formButtons}>
              <button type="button" onClick={handleCreateAdmin} className={styles.submitButton}>
                Add Admin
              </button>
              <button type="button" onClick={() => setIsCreatingAdmin(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;