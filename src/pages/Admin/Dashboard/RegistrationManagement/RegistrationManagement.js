import React, { useState, useEffect } from 'react';
import styles from './RegistrationManagement.module.css';
import registrationApi from '../../../../api/registrationApi';
const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await registrationApi.getRegisters();
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  return (
    <div>
      <h2>Registration Management</h2>
      <ul>
        {registrations.map(registration => (
          <li key={registration._id}>{registration.fullName} - {registration.courseId}</li>
        ))}
      </ul>
    </div>
  );
};
export default RegistrationManagement