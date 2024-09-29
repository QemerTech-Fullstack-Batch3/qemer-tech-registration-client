import React, { useState, useEffect } from 'react';
import styles from './CourseMangement.module.css'
import courseApi from '../../../../api/courseApi'
const CourseManagement = ({ userRole }) => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    duration: '',
    description: '',
    price: '',
    learningMode: '',
    courseRegistrationStatus: 'OnRegistration',
    spotLimit: '',
    schedule: {
      startDate: '',
      endDate: '',
      dayOfWeek: [],
      time: ''
    }
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

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
    const { name, value } = e.target;
    if (name.startsWith('schedule.')) {
      const scheduleField = name.split('.')[1];
      setNewCourse(prevState => ({
        ...prevState,
        schedule: {
          ...prevState.schedule,
          [scheduleField]: value
        }
      }));
    } else {
      setNewCourse(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleDayOfWeekChange = (e) => {
    const { value, checked } = e.target;
    setNewCourse(prevState => ({
      ...prevState,
      schedule: {
        ...prevState.schedule,
        dayOfWeek: checked
          ? [...prevState.schedule.dayOfWeek, value]
          : prevState.schedule.dayOfWeek.filter(day => day !== value)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await courseApi.editCourse(selectedCourse._id, newCourse);
      } else {
        await courseApi.createCourse(newCourse);
      }
      setNewCourse({
        courseName: '',
        duration: '',
        description: '',
        price: '',
        learningMode: '',
        courseRegistrationStatus: 'OnRegistration',
        spotLimit: '',
        schedule: {
          startDate: '',
          endDate: '',
          dayOfWeek: [],
          time: ''
        }
      });
      setIsEditing(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleViewDetails = async (courseId) => {
    try {
      const response = await courseApi.getCourseInfo(courseId);
      setSelectedCourse(response.data.course);
      setIsViewingDetails(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleEdit = async (courseId) => {
    try {
      const response = await courseApi.getCourseInfo(courseId);
      const courseData = response.data.course;
      setSelectedCourse(courseData);
      setNewCourse({
        ...courseData,
        schedule: response.data.schedule || {
          startDate: '',
          endDate: '',
          dayOfWeek: [],
          time: ''
        }
      });
      setIsEditing(true);
      setIsViewingDetails(false);
    } catch (error) {
      console.error('Error fetching course details for editing:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedCourse(null);
    setNewCourse({
      courseName: '',
      duration: '',
      description: '',
      price: '',
      learningMode: '',
      courseRegistrationStatus: 'OnRegistration',
      spotLimit: '',
      schedule: {
        startDate: '',
        endDate: '',
        dayOfWeek: [],
        time: ''
      }
    });
  };

  const handleCloseDetails = () => {
    setIsViewingDetails(false);
    setSelectedCourse(null);
  };

  if (!['SuperAdmin', 'Admin'].includes(userRole)) {
    return <div>You don't have permission to manage courses.</div>;
  }

  return (
    <div className={styles.courseManagement}>
      <div className={styles.formSection}>
        <h2>{isEditing ? 'Edit Course' : 'Create New Course'}</h2>
        <form onSubmit={handleSubmit} className={styles.courseForm}>
          <input
            name="courseName"
            value={newCourse.courseName}
            onChange={handleInputChange}
            placeholder="Course Name"
            required
            className={styles.formInput}
          />
          <input
            name="duration"
            value={newCourse.duration}
            onChange={handleInputChange}
            placeholder="Duration"
            required
            className={styles.formInput}
          />
          <textarea
            name="description"
            value={newCourse.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className={styles.formTextarea}
          />
          <input
            name="price"
            type="number"
            value={newCourse.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
            className={styles.formInput}
          />
          <select
            name="learningMode"
            value={newCourse.learningMode}
            onChange={handleInputChange}
            required
            className={styles.formSelect}
          >
            <option value="">Select Learning Mode</option>
            <option value="Online">Online</option>
            <option value="InPerson">In Person</option>
          </select>
          <select
            name="courseRegistrationStatus"
            value={newCourse.courseRegistrationStatus}
            onChange={handleInputChange}
            required
            className={styles.formSelect}
          >
            <option value="OnRegistration">On Registration</option>
            <option value="OnProgress">On Progress</option>
            <option value="ended">Ended</option>
          </select>
          <input
            name="spotLimit"
            type="number"
            value={newCourse.spotLimit}
            onChange={handleInputChange}
            placeholder="Spot Limit"
            required
            className={styles.formInput}
          />
          <h3>Schedule</h3>
          <div className={styles.scheduleSection}>
            <div className={styles.formGroup}>
              <label htmlFor="schedule.startDate">Start Date:</label>
              <input
                id="schedule.startDate"
                name="schedule.startDate"
                type="date"
                value={newCourse.schedule.startDate}
                onChange={handleInputChange}
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="schedule.endDate">End Date:</label>
              <input
                id="schedule.endDate"
                name="schedule.endDate"
                type="date"
                value={newCourse.schedule.endDate}
                onChange={handleInputChange}
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Days of the Week:</label>
              <div className={styles.dayOfWeekContainer}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <div key={day} className={styles.dayOfWeekItem}>
                    <input
                      type="checkbox"
                      id={`day-${index + 1}`}
                      name="schedule.dayOfWeek"
                      value={index + 1}
                      checked={newCourse.schedule.dayOfWeek.includes(String(index + 1))}
                      onChange={handleDayOfWeekChange}
                    />
                    <label htmlFor={`day-${index + 1}`}>{day}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="schedule.time">Time:</label>
              <input
                id="schedule.time"
                name="schedule.time"
                type="time"
                value={newCourse.schedule.time}
                onChange={handleInputChange}
                required
                className={styles.formInput}
              />
            </div>
          </div>
          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton}>
              {isEditing ? 'Update Course' : 'Add Course'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className={styles.cancelButton}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.listSection}>
        <h2>Course List</h2>
        <ul className={styles.courseList}>
          {courses.map(course => (
            <li key={course._id} className={styles.courseItem}>
              <div className={styles.courseInfo}>
                <h3>{course.courseName}</h3>
                <p>Learning Mode: {course.learningMode}</p>
                <p>Status: {course.courseRegistrationStatus}</p>
              </div>
              <div className={styles.courseActions}>
                <button onClick={() => handleViewDetails(course._id)} className={styles.viewButton}>
                  View Details
                </button>
                <button onClick={() => handleEdit(course._id)} className={styles.editButton}>
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {isViewingDetails && selectedCourse && (
        <div className={styles.courseDetails}>
          <h3>Course Details</h3>
          <p><strong>Name:</strong> {selectedCourse.courseName}</p>
          <p><strong>Duration:</strong> {selectedCourse.duration}</p>
          <p><strong>Description:</strong> {selectedCourse.description}</p>
          <p><strong>Price:</strong> {selectedCourse.price}</p>
          <p><strong>Learning Mode:</strong> {selectedCourse.learningMode}</p>
          <p><strong>Registration Status:</strong> {selectedCourse.courseRegistrationStatus}</p>
          <p><strong>Spot Limit:</strong> {selectedCourse.spotLimit}</p>
          {selectedCourse.schedule && (
            <div>
              <h4>Schedule</h4>
              <p><strong>Start Date:</strong> {new Date(selectedCourse.schedule.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(selectedCourse.schedule.endDate).toLocaleDateString()}</p>
              <p><strong>Days:</strong> {selectedCourse.schedule.dayOfWeek.map(day => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1]).join(', ')}</p>
              <p><strong>Time:</strong> {selectedCourse.schedule.time}</p>
            </div>
          )}
          <button onClick={handleCloseDetails} className={styles.closeButton}>
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;