import React, { useState, useEffect } from 'react';
import NavBar from './Navbar';

const StudentPage = () => {
  const [courses, setCourses] = useState([]);
  const [courseInstances, setCourseInstances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async () => {
    try {
      const courseRes = await fetch('http://localhost:3000/courses');
      const courseData = await courseRes.json();
      
      setCourses(courseData.courses); 
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // const fetchCourseInstances = async () => {
  //   try {
  //     const courseInstRes = await fetch('http://localhost:3000/courseinstances');
  //     const courseInstData = await courseInstRes.json();
      
  //     setCourseInstances(courseInstData.courseInstances); 
  //   } catch (error) {
  //     console.error('Error fetching courses:', error);
  //   }
  // };

  useEffect(() => {
    fetchCourses();
    // fetchCourseInstances();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.CourseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div>
      <NavBar />
      <h1>All Available Courses</h1>
      <input
        type="text"
        placeholder="Search for a course..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {filteredCourses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course.CourseID}>
                <td>{course.CourseName}</td>
                <td>{course.DepartmentID}</td>
                <td>{course.credits}</td>
                <td>{course.Description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentPage;
