import React, { useState, useEffect, useRef } from 'react';
import styles from './CourseMangement.module.css'
import courseApi from '../../../../api/courseApi'

const CourseManagement = ({ userRole }) => {
  const courseDetailsRef = useRef(null);
  const formSectionRef = useRef(null);
  const [courses, setCourses] = useState([]);

  const [newCourse, setNewCourse] = useState({
    courseName: '',
    duration: '',
    description: '',
    price: '',
    learningMode: '',
    courseRegistrationStatus: 'OnRegistration',
    spotLimit: ''
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
        spotLimit: ''
      });
      setIsEditing(false);
      setSelectedCourse(null);
      fetchCourses();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving course:', error);
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
      setSelectedCourse(courseData);
      setNewCourse(courseData);
      setIsEditing(true);
      setShowForm(true);
      setTimeout(() => {
        const formSection = document.querySelector(`.${styles.formSection}`);
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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
      spotLimit: ''
    });
  };

  const handleCreateNewCourse = () => {
    setIsEditing(false);
    setNewCourse({
      courseName: '',
      duration: '',
      description: '',
      price: '',
      learningMode: '',
      courseRegistrationStatus: 'OnRegistration',
      spotLimit: ''
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
      <h2 className={styles.title}>Course Management</h2>

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
            <p><strong>Spot Limit:</strong> {selectedCourseDetails.spotLimit}</p>
          </div>
          <button onClick={() => setIsViewingDetails(false)} className={styles.closeButton}>
            Close Details
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
              <option value="OnRegistration">On Registration</option>
              <option value="OnProgress">On Progress</option>
              <option value="ended">Ended</option>
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