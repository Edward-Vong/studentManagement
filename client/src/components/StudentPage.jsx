import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Pagination, Button } from 'react-bootstrap';
import NavBar from './Navbar';

const StudentPage = () => {
  const [courses, setCourses] = useState([]);
  //const [courseInstances, setCourseInstances] = useState([]);

  //for the IDs needed to pass into enrollments
  const [studentID, setStudentID] = useState('');
  //const [courseInstanceID, setCourseInstanceID] = useState('');

  //for search bar
  const [searchTerm, setSearchTerm] = useState('');

  //for pagination
  const [coursesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);



    // Fetch studentID when component mounts
    const fetchStudentID = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/studentID', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Pass the JWT token from localStorage
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStudentID(data.studentID);
        } else {
          throw new Error('Failed to fetch studentID');
        }
      } catch (error) {
        console.error('Error fetching studentID:', error);
      }
    };

  useEffect(() => {
    fetchStudentID(); 
  }, []);


  // const fetchCourseInstanceIDs = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/courseinstances');
  //     if (response.ok) {
  //       const data = await response.json();
  //       // Extract CourseInstanceIDs from the response data and store them in state
  //       const instanceIDs = data.courseInstances.map(instance => instance.CourseInstanceID);
  //       setCourseInstanceID(instanceIDs);
  //     } else {
  //       throw new Error('Failed to fetch course instance IDs');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching course instance IDs:', error);
  //   }
  // };
  
  // useEffect(() => {
  //   fetchCourseInstanceIDs();
  // }, []);


  //done: getting course information
  //todo: get course instance info
  //todo: get course room info
  const fetchCourses = async () => {
    try {
      const courseRes = await fetch('http://localhost:3000/courses');
      const courseData = await courseRes.json();
      setCourses(courseData.courses);
    } catch (error) {
      console.error('Error fetching course information:', error);
    }
  };
  
  // const fetchCourseInstances = async () => {
  //   try {
  //     const courseInstRes = await fetch('http://localhost:3000/courseinstances');
  //     const courseInstData = await courseInstRes.json();
  //     setCourseInstances(courseInstData.courseInstances);
  //   } catch (error) {
  //     console.error('Error fetching course instances:', error);
  //   }
  // };

  useEffect(() => {
    fetchCourses();
    // fetchCourseInstances();
  }, []);

  useEffect(() => {
    console.log('Courses:', courses); // Add this line
  }, [courses]);


  //for adding/enrolling into courses
  const handleEnroll = async (CourseID) => {
    console.log('Student ID:', studentID);
    console.log('CourseID:', CourseID);

    try {
      const response = await fetch('http://localhost:3000/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentID: studentID, courseID: CourseID}),
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


  //for the search bar
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  //filtering courses based on ^^^^
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
                <Button onClick={() => handleEnroll(course.CourseID)}>Enroll</Button>
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