import React, { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import styles from './CoursePage.module.css';
import courseApi from '../../api/courseApi';

const CourseCard = ({ course }) => (
  <div className={styles.courseCard}>
    <h3>{course.courseName}</h3>
    <p className={styles.description}>{course.description}</p>
    <div className={styles.courseInfo}>
      <p><strong>Price:</strong> {course.price} ETB</p>
      <p><strong>Duration:</strong> {course.duration}</p>
    </div>
    <Link to={`/register/${course.id}`} className={styles.getStartedBtn}>Get started</Link>
  </div>
);

const CoursePage = () => {
  const { type } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        const filteredCourses = response.data.filter(course => {
          const normalizedType = type.toLowerCase().replace('-', '');
          const normalizedLearningMode = course.learningMode.toLowerCase().replace(' ', '');
          return normalizedLearningMode === normalizedType;
        });
        setCourses(filteredCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, [type]);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.coursePage}>
      <header className={styles.header}>
        <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Courses</h1>
        <p>Explore our range of {type} courses designed to help you achieve your academic goals.</p>
      </header>
      <div className={styles.courseList}>
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursePage;