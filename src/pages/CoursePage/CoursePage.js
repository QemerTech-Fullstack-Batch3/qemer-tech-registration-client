import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './CoursePage.module.css';

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
  const courses = [
    { id: 1, courseName: "Basic Academic Package", price: 3500, duration: "3 months", description: "The Basic Academic Package is tailored for students seeking online tutorial classes led by our skilled instructors based in the United States. Each tutor is available for three one-hour sessions per week for online class." },
    { id: 2, courseName: "Advanced Academic Package", price: 4500, duration: "3 months", description: "The Advanced Academic Package is tailored for students seeking online tutorial classes led by our skilled instructors based in the United States. Each tutor is available for three one-hour sessions per week for online classes, with additional in-person offers available on weekends." },
    { id: 3, courseName: "Premium Academic Package", price: 6000, duration: "3 months", description: "The Premium Academic Package is tailored for students seeking online tutorial classes led by our skilled instructors based in the United States. Each tutor is available for three one-hour sessions per week for online classes, with additional in-person offers available on weekends." },
  ];

  return (
    <div className={styles.coursePage}>
      <header className={styles.header}>
        <h1>{type === 'online' ? 'Online' : 'In-Person'} Courses</h1>
        <p>Explore our range of {type} courses designed to help you achieve your academic goals.</p>
      </header>
      <div className={styles.courseList}>
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursePage;