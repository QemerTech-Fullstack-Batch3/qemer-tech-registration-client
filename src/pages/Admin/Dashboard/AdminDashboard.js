import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';
import courseApi from '../../../api/courseApi';
import adminApi from '../../../api/adminApi';
import registrationApi from '../../../api/registrationApi';
import scheduleApi from '../../../api/scheduleApi';

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

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ courseName: '', duration: '', description: '', price: '', learningMode: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseApi.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseApi.createCourse(newCourse);
      setNewCourse({ courseName: '', duration: '', description: '', price: '', learningMode: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div>
      <h2>Course Management</h2>
      <form onSubmit={handleSubmit}>
        <input name="courseName" value={newCourse.courseName} onChange={handleInputChange} placeholder="Course Name" required />
        <input name="duration" value={newCourse.duration} onChange={handleInputChange} placeholder="Duration" required />
        <textarea name="description" value={newCourse.description} onChange={handleInputChange} placeholder="Description" required />
        <input name="price" value={newCourse.price} onChange={handleInputChange} placeholder="Price" required />
        <select name="learningMode" value={newCourse.learningMode} onChange={handleInputChange} required>
          <option value="">Select Learning Mode</option>
          <option value="Online">Online</option>
          <option value="InPerson">In Person</option>
        </select>
        <button type="submit">Add Course</button>
      </form>
      <ul>
        {courses.map(course => (
          <li key={course._id}>{course.courseName} - {course.learningMode}</li>
        ))}
      </ul>
    </div>
  );
};

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

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ courseId: '', startDate: '', endDate: '', dayOfWeek: [], startTime: '', endTime: '' });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchSchedules();
    fetchCourses();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await scheduleApi.getSchedules();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseApi.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'dayOfWeek') {
      const value = Array.from(e.target.selectedOptions, option => option.value);
      setNewSchedule({ ...newSchedule, [e.target.name]: value });
    } else {
      setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await scheduleApi.createSchedule(newSchedule);
      setNewSchedule({ courseId: '', startDate: '', endDate: '', dayOfWeek: [], startTime: '', endTime: '' });
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <div>
      <h2>Schedule Management</h2>
      <form onSubmit={handleSubmit}>
        <select name="courseId" value={newSchedule.courseId} onChange={handleInputChange} required>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.courseName}</option>
          ))}
        </select>
        <input type="date" name="startDate" value={newSchedule.startDate} onChange={handleInputChange} required />
        <input type="date" name="endDate" value={newSchedule.endDate} onChange={handleInputChange} required />
        <select name="dayOfWeek" multiple value={newSchedule.dayOfWeek} onChange={handleInputChange} required>
          <option value="1">Monday</option>
          <option value="2">Tuesday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
          <option value="6">Saturday</option>
          <option value="7">Sunday</option>
        </select>
        <input type="time" name="startTime" value={newSchedule.startTime} onChange={handleInputChange} required />
        <input type="time" name="endTime" value={newSchedule.endTime} onChange={handleInputChange} required />
        <button type="submit">Add Schedule</button>
      </form>
      <ul>
        {schedules.map(schedule => (
          <li key={schedule._id}>{schedule.courseId} - {schedule.startDate} to {schedule.endDate}</li>
        ))}
      </ul>
    </div>
  );
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [adminsResponse, pendingResponse] = await Promise.all([
        adminApi.getAdmins(),
        adminApi.getUsersInPending()
      ]);
      setAdmins(adminsResponse.data.admins);
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
    <div>
      <h2>Admin Management</h2>
      <h3>Pending Users</h3>
      <ul>
        {pendingUsers.map(user => (
          <li key={user._id}>
            {user.username} - {user.email}
            <button onClick={() => handleAssignRole(user._id, 'Admin')}>Assign Admin</button>
            <button onClick={() => handleAssignRole(user._id, 'Registrar')}>Assign Registrar</button>
          </li>
        ))}
      </ul>
      <h3>Active Admins</h3>
      <ul>
        {admins.map(admin => (
          <li key={admin._id}>{admin.username} - {admin.email} - {admin.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;