import React, { useState, useEffect } from 'react';
import courseApi from '../../../../api/courseApi';
import scheduleApi from '../../../../api/scheduleApi';
import styles from './ScheduleManagement.module.css';

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

  const getDayName = (day) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[day - 1];
  };

  return (
    <div className={styles.scheduleManagement}>
      <h2 className={styles.title}>Schedule Management</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="courseId" className={styles.label}>Course</label>
          <select id="courseId" name="courseId" value={newSchedule.courseId} onChange={handleInputChange} required className={styles.select}>
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.courseName}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="startDate" className={styles.label}>Start Date</label>
          <input id="startDate" type="date" name="startDate" value={newSchedule.startDate} onChange={handleInputChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="endDate" className={styles.label}>End Date</label>
          <input id="endDate" type="date" name="endDate" value={newSchedule.endDate} onChange={handleInputChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dayOfWeek" className={styles.label}>Days of Week</label>
          <select id="dayOfWeek" name="dayOfWeek" multiple value={newSchedule.dayOfWeek} onChange={handleInputChange} required className={styles.select}>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
            <option value="7">Sunday</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="startTime" className={styles.label}>Start Time</label>
          <input id="startTime" type="time" name="startTime" value={newSchedule.startTime} onChange={handleInputChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="endTime" className={styles.label}>End Time</label>
          <input id="endTime" type="time" name="endTime" value={newSchedule.endTime} onChange={handleInputChange} required className={styles.input} />
        </div>
        <button type="submit" className={styles.button}>Add Schedule</button>
      </form>
      <div className={styles.scheduleList}>
        <h3>Existing Schedules</h3>
        {schedules.map(schedule => (
          <div key={schedule._id} className={styles.scheduleItem}>
            <div className={styles.scheduleInfo}>
              <div className={styles.courseName}>{courses.find(course => course._id === schedule.courseId)?.courseName || 'Unknown Course'}</div>
              <div className={styles.scheduleDetails}>
                {new Date(schedule.startDate).toLocaleDateString()} to {new Date(schedule.endDate).toLocaleDateString()}
                <br />
                {schedule.startTime} - {schedule.endTime}
              </div>
              <div className={styles.dayOfWeek}>
                {schedule.dayOfWeek.map(day => (
                  <span key={day} className={styles.day}>{getDayName(day)}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleManagement;