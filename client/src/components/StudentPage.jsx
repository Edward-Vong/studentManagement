import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Pagination, Button } from 'react-bootstrap';
import NavBar from './Navbar';

const StudentPage = () => {
  const [courses, setCourses] = useState([]);
  const [courseInstances, setCourseInstances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [studentID, setStudentID] = useState('');
  const [coursesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  //done: getting course information
  //todo: get course instance info
  //todo: get course room info
  const fetchCourses = async () => {
    try {
      const courseRes = await fetch('http://localhost:3000/courses');
      const courseData = await courseRes.json();
      setCourses(courseData.courses); 

      const courseInstRes = await fetch('http://localhost:3000/courseinstances');
      const courseInstData = await courseInstRes.json();
      setCourseInstances(courseInstData.courseInstances); 

    } catch (error) {
      console.error('Error fetching course information:', error);
    }
  };


  //for adding/enrolling into courses
  const handleEnroll = async (courseInstanceID) => {
    try {
      const response = await fetch('http://localhost:3000/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentID: studentID, courseInstanceID: courseInstanceID}),
        });
      if (response.ok) {
        // Enrollment successful
        console.log('Enrollment successful');
      } else {
        console.error('Enrollment failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.CourseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // for moving between page of courses 
  // there's 10 courses per page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <NavBar />
      <h1>FreakNite University: Spring 2024</h1>
      <Row className="my-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search for a course here..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
      </Row>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Course Number</th>
            <th>Course Title</th>
            <th>Units</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map(course => (
            <tr key={course.CourseID}>
              <td>{course.CourseID}</td>
              <td>{course.CourseName}</td>
              <td>{course.credits}</td>
              <td>{course.Description}</td>
              <td>
                <Button onClick={() => handleEnroll(studentID, course.CourseInstanceID)}>Enroll</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row>
        <Col>
          <Pagination>
            {Array.from({ length: Math.ceil(filteredCourses.length / coursesPerPage) }, (_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentPage;