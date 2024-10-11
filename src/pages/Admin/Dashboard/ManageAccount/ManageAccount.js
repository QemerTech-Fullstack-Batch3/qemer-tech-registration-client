import React, { useState } from 'react';
import styles from './ManageAccount.module.css';
import adminApi from '../../../../api/adminApi';

const ManageAccount = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    try {
      await adminApi.changeAdminPassword({ currentPassword: oldPassword, newPassword });
      alert('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please check your current password and try again.');
    }
  };

  return (
    <div className={styles.manageAccount}>
      <h2>Manage Account</h2>
      {isChangingPassword ? (
        <div className={styles.changePasswordSection}>
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className={styles.formInput}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.formInput}
          />
          <button onClick={handleChangePassword} className={styles.button}>
            Change Password
          </button>
          <button onClick={() => setIsChangingPassword(false)} className={styles.button}>
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setIsChangingPassword(true)} className={styles.button}>
          Change Password
        </button>
      )}
    </div>
  );
};

export default ManageAccount;