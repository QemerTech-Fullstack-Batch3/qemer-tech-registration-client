import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseApi from '../../api/courseApi';
import styles from './CoursePage.module.css';

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const response = await courseApi.getCourseInfo(id);
        setCourse(response.data.course);
        setPrograms(response.data.programs || []);
      } catch (error) {
        console.error('Error fetching course info:', error);
      }
    };
    fetchCourseInfo();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.coursePage}>
      <h1>{course.courseName}</h1>
      <p>{course.description}</p>
      
      <h2>Available Programs</h2>
      <div className={styles.programGrid}>
        {programs.map((program) => (
          <div key={program._id} className={styles.programCard}>
            <h3>{program.programName}</h3>
            <p>Schedule: {program.schedule}</p>
            <p>Duration: {program.duration}</p>
            <p>Price: ${program.price}</p>
            <Link to={`/register/${program._id}`} className={styles.registerBtn}>
              Register
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;