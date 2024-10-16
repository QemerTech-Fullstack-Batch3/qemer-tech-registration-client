import React, { useState } from 'react';
import styles from './ManageAccount.module.css';
import adminApi from '../../../../api/adminApi';

const ManageAccount = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    try {
      await adminApi.changePassword({ email, currentPassword: oldPassword, newPassword });
      alert('Password changed successfully!');
      setEmail(''); 
      setOldPassword('');
      setNewPassword('');
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please check your email and current password, and try again.');
    }
  };

  return (
    <div className={styles.manageAccount}>
      <h2>Manage Account</h2>
      {isChangingPassword ? (
        <div className={styles.changePasswordSection}>
          <h3>Change Password</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.formInput}
          />
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
          <button onClick={handleChangePassword} className={styles.submitButton}>
            Change Password
          </button>
          <button onClick={() => setIsChangingPassword(false)} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setIsChangingPassword(true)} className={styles.submitButton}>
          Change Password
        </button>
      )}
    </div>
  );
};

export default ManageAccount;