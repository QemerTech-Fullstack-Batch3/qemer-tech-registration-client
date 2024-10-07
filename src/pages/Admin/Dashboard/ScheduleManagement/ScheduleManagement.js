import React, { useState, useEffect, useRef } from 'react';
import courseApi from '../../../../api/courseApi';
import scheduleApi from '../../../../api/scheduleApi';
import styles from './ScheduleManagement.module.css';
import { groupBy } from 'lodash';
const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    courseId: '',
    courseName: '',
    startDate: '',
    endDate: '',
    dayOfWeek: [],
    time: ''
  });


  const [editingSchedule, setEditingSchedule] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    fetchSchedules();
    fetchCourses();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await scheduleApi.getSchedules();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError('Failed to fetch schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await courseApi.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const handleDayOfWeekChange = (e) => {
    const { value, checked } = e.target;
    const dayNumber = parseInt(value, 10);
    setNewSchedule(prevState => ({
      ...prevState,
      dayOfWeek: checked
        ? [...new Set([...prevState.dayOfWeek, dayNumber])]
        : prevState.dayOfWeek.filter(day => day !== dayNumber)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSchedule.courseId || !newSchedule.startDate || !newSchedule.endDate || newSchedule.dayOfWeek.length === 0 || !newSchedule.time) {
      setError('Please fill out all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const scheduleToSend = {
        courseId: newSchedule.courseId,
        startDate: newSchedule.startDate,
        endDate: newSchedule.endDate,
        dayOfWeek: newSchedule.dayOfWeek.map(Number),
        time: newSchedule.time + ':00' // Ensure time is in HH:MM:SS format
      };
      console.log('Sending schedule data:', scheduleToSend);
      let response;
      if (editingSchedule) {
        response = await scheduleApi.updateSchedule(editingSchedule._id, scheduleToSend);
      } else {
        response = await scheduleApi.createSchedule(scheduleToSend);
      }
      console.log('Server response:', response);
      setNewSchedule({ courseId: '', courseName: '', startDate: '', endDate: '', dayOfWeek: [], time: '' });
      setEditingSchedule(null);
      setShowForm(false);
      await fetchSchedules(); // Refresh the schedules list
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError(`Failed to save schedule: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (schedule) => {
    const course = courses.find(c => c._id === schedule.courseId);
    setEditingSchedule(schedule);
    setNewSchedule({
      courseId: schedule.courseId,
      courseName: course ? course.courseName : '',
      startDate: new Date(schedule.startDate).toISOString().split('T')[0],
      endDate: new Date(schedule.endDate).toISOString().split('T')[0],
      dayOfWeek: Array.isArray(schedule.dayOfWeek) ? schedule.dayOfWeek.map(Number) : [Number(schedule.dayOfWeek)],
      time: schedule.time.slice(0, 5) // Remove seconds from time
    });
    setShowForm(true);
    scrollToForm();
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setLoading(true);
      setError('');
      try {
        await scheduleApi.deleteSchedule(scheduleId);
        await fetchSchedules(); // Refresh the schedules list
      } catch (error) {
        console.error('Error deleting schedule:', error);
        setError('Failed to delete schedule. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setNewSchedule({ courseId: '', startDate: '', endDate: '', dayOfWeek: [], time: '' });
    setShowForm(true);
    scrollToForm();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSchedule(null);
    setNewSchedule({ courseId: '', courseName: '', startDate: '', endDate: '', dayOfWeek: [], time: '' });
    if (editingSchedule) {
      scrollToSchedule(editingSchedule.courseId);
    }
  };

  const handleCourseChange = (e) => {
    const courseName = e.target.value;
    const course = courses.find(c => c.courseName === courseName);
    setNewSchedule(prevState => ({
      ...prevState,
      courseName: courseName,
      courseId: course ? course._id : ''
    }));
  };
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSchedule = (courseId) => {
    const scheduleElement = document.getElementById(`schedule-${courseId}`);
    scheduleElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const getDayName = (day) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (typeof day === 'number') {
      return days[day - 1];
    }
    return day;
  };

  return (
    <div className={styles.scheduleManagement}>
      <h2 className={styles.title}>Schedule Management</h2>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.scheduleList}>
        <h2>Existing Schedules</h2>
        {Object.entries(groupBy(schedules, 'courseId')).map(([courseId, courseSchedules]) => (
          <div key={courseId} id={`schedule-${courseId}`} className={styles.courseSchedules}>
            <h4 className={styles.courseName}>{courses.find(course => course._id === courseId)?.courseName || 'Unknown Course'}</h4>
            {courseSchedules.map(schedule => (
              <div key={schedule._id} className={styles.scheduleItem}>
                <div className={styles.scheduleInfo}>
                  <div className={styles.scheduleDetails}>
                    <p><strong>Start Date:</strong> {new Date(schedule.startDate).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(schedule.endDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {schedule.time}</p>
                    <p><strong>Days:</strong></p>
                    <div className={styles.dayOfWeek}>
                      {Array.isArray(schedule.dayOfWeek)
                        ? schedule.dayOfWeek.map(day => (
                          <span key={day} className={styles.day}>{getDayName(day)}</span>
                        ))
                        : <span className={styles.day}>{getDayName(schedule.dayOfWeek)}</span>
                      }
                    </div>
                  </div>
                </div>
                <div className={styles.scheduleActions}>
                  <button onClick={() => handleEdit(schedule)} className={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(schedule._id)} className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {!showForm && (
        <div>
          <h2>Create New Schedule</h2>
          <button onClick={handleAddSchedule} className={styles.addButton}>Create Schedule</button>
        </div>
      )}

      {showForm && (
        <div ref={formRef} className={styles.form}>
          <h2>{editingSchedule ? 'Edit Schedule' : 'Create Schedule'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="courseName" className={styles.label}>Course</label>
              <select
                id="courseName"
                name="courseName"
                value={newSchedule.courseName}
                onChange={handleCourseChange}
                required
                className={styles.select}
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course.courseName}>{course.courseName}</option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate" className={styles.label}>Start Date</label>
                <input id="startDate" type="date" name="startDate" value={newSchedule.startDate} onChange={handleInputChange} required className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="endDate" className={styles.label}>End Date</label>
                <input id="endDate" type="date" name="endDate" value={newSchedule.endDate} onChange={handleInputChange} required className={styles.input} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Days of the Week:</label>
              <div className={styles.dayOfWeekContainer}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <div key={day} className={styles.dayOfWeekItem}>
                    <input
                      type="checkbox"
                      id={`day-${index + 1}`}
                      name="dayOfWeek"
                      value={index + 1}
                      checked={newSchedule.dayOfWeek.includes(index + 1)}
                      onChange={handleDayOfWeekChange}
                    />
                    <label htmlFor={`day-${index + 1}`}>{day}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.label}>Time</label>
              <input id="time" type="time" name="time" value={newSchedule.time} onChange={handleInputChange} required className={styles.input} />
            </div>
            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Saving...' : (editingSchedule ? 'Update Schedule' : 'Add Schedule')}
              </button>
              <button type="button" onClick={handleCancel} className={styles.cancelButton} disabled={loading}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;