import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Pagination, Button, Modal } from 'react-bootstrap';
import NavBar from './Navbar';

const StudentPage = () => {
  const [courses, setCourses] = useState([]);
  //const [courseInstances, setCourseInstances] = useState([]);
  const [coursesWithInstances, setCoursesWithInstances] = useState([]);

  //for the IDs needed to pass into enrollments
  const [studentID, setStudentID] = useState('');
  //const [courseInstanceID, setCourseInstanceID] = useState('');

  //for search bar
  const [searchTerm, setSearchTerm] = useState('');

  //for pagination and moving between course pages
  const [coursesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  //for getting enrollments
  const [enrollments, setEnrollments] = useState([]);

  //for showing error modal/popup when 
  //students that try to re-enroll again
  const [showEnrollmentError, setShowEnrollmentError] = useState(false); 


    // Fetch studentID when the component mounts
    const fetchStudentID = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/studentID', {
          headers: {
            //passing pw token from local storage
            Authorization: `Bearer ${localStorage.getItem('token')}` 
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

  // Fetch courses along with course instances
const fetchCoursesWithInstances = async () => {
  try {
    const response = await fetch('http://localhost:3000/coursesWithInstances');
    if (response.ok) {
      const data = await response.json();
      setCoursesWithInstances(data);
    } else {
      throw new Error('Failed to fetch courses with instances');
    }
  } catch (error) {
    console.error('Error fetching courses with instances:', error);
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
    fetchCoursesWithInstances();
    // fetchCourseInstances();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('http://localhost:3000/enrollments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        //console.log('Enrollments data:', data); 
        //gets enrollments only for the current student user that's signed in
        const userEnrollments = data.filter(enrollment => enrollment.StudentID === studentID);
        setEnrollments(userEnrollments); 
      } else {
        throw new Error('Failed to fetch enrollments');
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      //if error bc am tired of the screen going white
      return []; 
    }
  };
  
  
  useEffect(() => {
    fetchEnrollments();
  }, [studentID]);

  //console.log('Enrollments:', enrollments);

  


  //for adding/enrolling into courses
  const handleEnroll = async (CourseID) => {
    // console.log('Student ID:', studentID);
    // console.log('CourseID:', CourseID);

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
        //calls the fetch so that no need to refresh
        fetchEnrollments();

      } else {
        console.error('Enrollment failed:', response.statusText);
        //show popup error
        //400 error bad req
        if (response.status === 400) {
          setShowEnrollmentError(true);
        }
        
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };


  //for closing the enrollment popup error
  const handleCloseEnrollmentError = () => {
    setShowEnrollmentError(false); 
  };


  //for dropping said courses that you've enrolled into 
  const handleDrop = async (enrollmentID) => {
    try {
      const response = await fetch(`http://localhost:3000/enrollments/${enrollmentID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        // Enrollment deletion successful
        console.log('Enrollment deleted successfully');
        // Update the UI by refetching enrollments
        fetchEnrollments();
      } else {
        // Handle error if enrollment deletion failed
        console.error('Failed to delete enrollment:', response.statusText);
        // Display error message or handle it as per your UI requirements
      }
    } catch (error) {
      // Handle any network errors
      console.error('Error deleting enrollment:', error);
      // Display error message or handle it as per your UI requirements
    }
  };


  //for the search bar
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  //filtering courses based on ^^^^
  //only uses name atm but i want to change it so that 
  //we can only search based on course number
  const filteredCourses = courses.filter(course =>
    course.CourseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // for moving between page of courses 
  // there's 10 courses per page
  //for the last course (get index)
  const indexOfLastCourse = currentPage * coursesPerPage;
  //for first course (get index)
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  //for getting the current 10 courses of a certain page
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  //for moving in between each course page 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <NavBar />
      <h1>FreakNite University: Spring 2024 😜</h1>
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
            <th>Start Time</th>
            <th>End Time</th>
            <th>Days of the Week</th>
            <th>Room Number</th>
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
              <td>{}</td>
              <td>{}</td>
              <td>{}</td>
              <td>{}</td>
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
          
      <h1>Your Current Enrollments</h1>
      <h2>For FreakNite University 😜</h2>
      <h2>🤫🤫🤫🤫🤫🤫🤫🤫🤫🤫</h2>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Course Number</th>
            <th>Course Title</th>
            <th>Units</th>
            <th>Description</th>
            <th>Enrollment Date</th>
            <th>Action </th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (

            <tr key={enrollment.EnrollmentID}>
              <td>{enrollment.CourseInstanceID}</td>
              <td></td>
              <td></td>
              <td></td>
              <td>{new Date(enrollment.EnrollmentDate).toLocaleDateString()}</td>
              <td>
                <Button onClick={() => handleDrop(enrollment.EnrollmentID)}>Drop</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={showEnrollmentError} onHide={handleCloseEnrollmentError}>

        <Modal.Header closeButton>
          <Modal.Title>Enrollment Error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          You have already enrolled for this course. 😜
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEnrollmentError}> Close </Button>
        </Modal.Footer>

      </Modal>
    </Container>
  );
};

export default StudentPage;