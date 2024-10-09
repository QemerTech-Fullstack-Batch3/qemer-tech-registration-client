import React, { useState, useEffect } from 'react';
import styles from './PackageManagement.module.css';
import packageApi from '../../../../api/packageApi';
import courseApi from '../../../../api/courseApi';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newPackage, setNewPackage] = useState({ packageName: '', description: '', courses: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchCourses();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await packageApi.getPackagesWithCourse();
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
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
    const { name, value } = e.target;
    setNewPackage({ ...newPackage, [name]: value });
  };

  const handleCourseSelection = (e) => {
    const { value, checked } = e.target;
    setNewPackage(prevState => ({
      ...prevState,
      courses: checked
        ? [...prevState.courses, value]
        : prevState.courses.filter(id => id !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await packageApi.updatePackage(editingPackageId, newPackage);
      } else {
        await packageApi.createPackage(newPackage);
      }
      setNewPackage({ packageName: '', description: '', courses: [] });
      setIsEditing(false);
      setEditingPackageId(null);
      setShowForm(false);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleEdit = async (pkg) => {
    try {
      const response = await packageApi.getPackageById(pkg._id);
      const packageData = response.data;
      setNewPackage({
        packageName: packageData.packageName,
        description: packageData.description,
        courses: packageData.courses.map(course => course._id)
      });
      setIsEditing(true);
      setEditingPackageId(pkg._id);
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching package details for editing:', error);
    }
  };

  const handleCancel = () => {
    setNewPackage({ packageName: '', description: '', courses: [] });
    setIsEditing(false);
    setEditingPackageId(null);
    setShowForm(false);
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await packageApi.deletePackage(packageId);
        if (response.status === 200) {
          alert('Package deleted successfully');
          fetchPackages();
        } else {
          alert("Couldn't delete the package. Please try again.");
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        alert("Couldn't delete the package. Please try again.");
      }
    }
  };
  return (
    <div className={styles.packageManagement}>
      <h2 className={styles.title}>Package Management</h2>

      <div className={styles.packageList}>
        <h3>Existing Packages</h3>
        {packages.map(pkg => (
          <div key={pkg._id} className={styles.packageItem}>
            <h4>{pkg.packageName}</h4>
            <p>{pkg.description}</p>
            <h5>Courses:</h5>
            <ul>
              {pkg.courses.map(course => (
                <li key={course._id}>{course.courseName}</li>
              ))}
            </ul>
            <button onClick={() => handleEdit(pkg)} className={styles.editButton}>Edit</button>
            <button onClick={() => handleDelete(pkg._id)} className={styles.deleteButton}>Delete</button>
          </div>
        ))}
      </div>

      {!showForm && (
        <div>
          <h2>Create New Package</h2>
          <button onClick={() => setShowForm(true)} className={styles.addButton}>
            Add Package
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.packageForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Package Name</label>
            <input
              type="text"
              name="packageName"
              value={newPackage.packageName}
              onChange={handleInputChange}
              placeholder="Package Name"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={newPackage.description}
              onChange={handleInputChange}
              placeholder="Description"
              required
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Courses</label>
            <div className={styles.checkboxGroup}>
              {courses.map(course => (
                <label key={course._id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={course._id}
                    checked={newPackage.courses.includes(course._id)}
                    onChange={handleCourseSelection}
                    className={styles.checkbox}
                  />
                  <span>{course.courseName}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton}>
              {isEditing ? 'Update Package' : 'Create Package'}
            </button>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PackageManagement;