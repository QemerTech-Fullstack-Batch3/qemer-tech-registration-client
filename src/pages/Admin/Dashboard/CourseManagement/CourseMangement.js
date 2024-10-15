import React, { useState, useEffect, useRef } from 'react';
import styles from './CourseMangement.module.css'
import courseApi from '../../../../api/courseApi'

const CourseManagement = ({ userRole }) => {
  const formSectionRef = useRef(null);
  const [courses, setCourses] = useState([]);

  const [newCourse, setNewCourse] = useState({
    courseName: '',
    duration: '',
    description: '',
    price: '',
    courseRegistrationStatus: 'On Registration',
    learningMode: '',
    spotLimit: '',
    startDate: '',
    endDate: '',
    dayOfWeek: [],
    time: ''
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

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
    if (name === 'learningMode') {
      setNewCourse(prevState => ({
        ...prevState,
        [name]: value,
        spotLimit: value === 'Online' ? '' : prevState.spotLimit
      }));
    } else {
      setNewCourse(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting course data:', newCourse);
      if (isEditing) {
        await courseApi.editCourse(selectedCourse._id, newCourse);
      } else {
        await courseApi.createCourse(newCourse);
      }
      fetchCourses();
      setShowForm(false);
      setNewCourse({
        courseName: '',
        duration: '',
        description: '',
        price: '',
        courseRegistrationStatus: 'On Registration',
        learningMode: '',
        spotLimit: '',
        startDate: '',
        endDate: '',
        dayOfWeek: [],
        time: ''
      });
      setIsEditing(false);
      alert(isEditing ? 'Course updated successfully!' : 'Course created successfully!');
    } catch (error) {
      console.error('Error submitting course:', error);
      console.log('Error response:', error.response);
      alert(`Error ${isEditing ? 'updating' : 'creating'} course: ${error.response ? error.response.data : error.message}`);
    }
  };

  const handleViewDetails = async (courseId) => {
    try {
      const response = await courseApi.getCourseInfo(courseId);
      setSelectedCourseDetails(response.data.course);
      setIsViewingDetails(true);
      setIsEditing(false);
      setShowForm(false);
      setTimeout(() => {
        const detailsSection = document.querySelector(`.${styles.courseDetailsContainer}`);
        if (detailsSection) {
          detailsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleEdit = async (courseId) => {
    try {
      const response = await courseApi.getCourseInfo(courseId);
      const courseData = response.data.course;
      
      // Format dates
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      const dayNameToNumber = {
        'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
        'Friday': 5, 'Saturday': 6, 'Sunday': 7
      };
      const dayOfWeek = Array.isArray(courseData.dayOfWeek)
      ? courseData.dayOfWeek.map(day => dayNameToNumber[day] || day)
      : [];
      setNewCourse({
        ...courseData,
        startDate: formatDate(courseData.startDate),
        endDate: formatDate(courseData.endDate),
        dayOfWeek: dayOfWeek
      });
      
      setSelectedCourse(courseData);
      setIsEditing(true);
      setShowForm(true);
      setTimeout(() => {
        if (formSectionRef.current) {
          formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching course details for editing:', error);
    }
  };


  const handleCreateNewCourse = () => {
    setIsEditing(false);
    setNewCourse({
      courseName: '',
      duration: '',
      description: '',
      price: '',
      courseRegistrationStatus: 'On Registration',
      learningMode: '',
      spotLimit: '',
      startDate: '',
      endDate: '',
      dayOfWeek: [],
      time: ''
    });
    setShowForm(true);
    setTimeout(() => {
      const formSection = document.querySelector(`.${styles.formSection}`);
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };


  const handleCancelForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedCourse(null);
    setNewCourse({
      courseName: '',
      duration: '',
      description: '',
      price: '',
      courseRegistrationStatus: 'On Registration',
      learningMode: '',
      spotLimit: '',
      startDate: '',
      endDate: '',
      dayOfWeek: [],
      time: ''
    });
  };


  const handleDayOfWeekChange = (e) => {
    const { value, checked } = e.target;
    const dayNumber = parseInt(value, 10);
    setNewCourse(prevState => ({
      ...prevState,
      dayOfWeek: checked
        ? [...new Set([...prevState.dayOfWeek, dayNumber])]
        : prevState.dayOfWeek.filter(day => day !== dayNumber)
    }));
  };
  const getDayName = (day) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (typeof day === 'number') {
      return days[day - 1];
    }
    return day;
  };
  if (!['SuperAdmin', 'Admin'].includes(userRole)) {
    return <div>You don't have permission to manage courses.</div>;
  }

  return (
    <div className={styles.courseManagement}>
      <h2 className={styles.title}>Course Management</h2>

      <div className={styles.listSection}>
        <h2>Course List</h2>
        <ul className={styles.courseList}>
          {courses.map(course => (
            <li key={course._id} className={styles.courseItem}>
              <div className={styles.courseInfo}>
                <h3 className={styles.courseName}>{course.courseName}</h3>
                <div className={styles.courseDetails}>
                  <span className={`${styles.badge} ${styles.learningMode}`}>
                    {course.learningMode}
                  </span>
                  <span className={`${styles.badge} ${styles.status}`}>
                    {course.courseRegistrationStatus}
                  </span>
                </div>
                <div className={styles.courseDates}>
                  <span className={styles.dateLabel}>Starts:</span> {course.startDate}
                  <span className={styles.dateLabel}>Ends:</span> {course.endDate}
                </div>
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

      {isViewingDetails && selectedCourseDetails && (
        <div className={styles.courseDetailsContainer}>
          <h2>Course Details</h2>
          <div className={styles.courseDetails}>
            <p><strong>Name:</strong> {selectedCourseDetails.courseName}</p>
            <p><strong>Duration:</strong> {selectedCourseDetails.duration}</p>
            <p><strong>Description:</strong> {selectedCourseDetails.description}</p>
            <p><strong>Price:</strong> {selectedCourseDetails.price}</p>
            <p><strong>Learning Mode:</strong> {selectedCourseDetails.learningMode}</p>
            <p><strong>Registration Status:</strong> {selectedCourseDetails.courseRegistrationStatus}</p>
            {selectedCourseDetails.learningMode !== 'Online' && (
              <p><strong>Spot Limit:</strong> {selectedCourseDetails.spotLimit}</p>
            )}
            <p><strong>Start Date: </strong>{selectedCourseDetails.startDate}</p>
            <p><strong>End Date: </strong>{selectedCourseDetails.endDate}</p>
            <p><strong>Days:</strong></p>
            <div className={styles.dayOfWeek}>
              {Array.isArray(selectedCourseDetails.dayOfWeek)
                ? selectedCourseDetails.dayOfWeek.map(day => (
                  <span key={day} className={styles.day}>{getDayName(day)}</span>
                ))
                : <span className={styles.day}>{getDayName(selectedCourseDetails.dayOfWeek)}</span>
              }
            </div>
            <p><strong>Time: </strong>{selectedCourseDetails.time}</p>
          </div>
          <button onClick={() => setIsViewingDetails(false)} className={styles.closeButton}>
            Close
          </button>
        </div>
      )}
      {!showForm && (
        <div className={styles.createSection}>
          <h2>Create New Course</h2>
          <button onClick={handleCreateNewCourse} className={styles.createButton}>
            Create New Course
          </button>
        </div>
      )}
      {showForm && (
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
              <option value="On Registration">On Registration</option>
              <option value="On Progress">On Progress</option>
              <option value="Ended">Ended</option>
            </select>
            {newCourse.learningMode === 'InPerson' && (
              <input
                name="spotLimit"
                type="number"
                value={newCourse.spotLimit}
                onChange={handleInputChange}
                placeholder="Spot Limit"
                required
                className={styles.formInput}
              />
            )}
            <div className={styles.dateContainer}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate" className={styles.label}>Start Date</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={newCourse.startDate}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="endDate" className={styles.label}>End Date</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={newCourse.endDate}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formGroupDayOfWeek}>
              <label className={styles.label}>Days of the Week:</label>
              <div className={styles.dayOfWeekContainer}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <label key={day} className={styles.dayOfWeekItem}>
                    <input
                      type="checkbox"
                      name="dayOfWeek"
                      value={index + 1}
                      checked={newCourse.dayOfWeek.includes(index + 1)}
                      onChange={handleDayOfWeekChange}
                    />
                    <span>{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.label}>Time</label>
              <input
                id="time"
                name="time"
                type="time"
                value={newCourse.time}
                onChange={handleInputChange}
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton}>
                {isEditing ? 'Update Course' : 'Add Course'}
              </button>
              <button type="button" onClick={handleCancelForm} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CourseManagement;