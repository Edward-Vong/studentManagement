import { useState, useEffect } from 'react';
import UserTable from './UserTable';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import NavBar from './Navbar';
import CourseTable from './CourseTable';

const AdminPage = () => {
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editableUser, setEditableUser] = useState(null);

    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [courses, setCourses] =useState([]);
    const [editableCourse, setEditableCourse] = useState(null);


    const fetchCourses = async () => {
        try {
          const courseRes = await fetch('http://localhost:3000/courses');
          const courseData = await courseRes.json();
          setCourses(courseData.courses);
        } catch (error) {
          console.error('Error fetching course information:', error);
        }
      };

    const fetchUsers = async () => {
        try {
            const studentsRes = await fetch('http://localhost:3000/students');
            const studentsData = await studentsRes.json();
            setStudents(studentsData.students);

            const instructorsRes = await fetch('http://localhost:3000/instructors');
            const instructorsData = await instructorsRes.json();
            setInstructors(instructorsData.instructors);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

useEffect(() => {
    fetchUsers();
    fetchCourses();
}, []);

const handleEdit = (user) => {
    // Open modal to edit user
    setEditableUser(user);
    setShowEditModal(true);
};

const handleDelete = async (userId) => {
    // Send Delete request and update state
    if (window.confirm('Are you sure you want to delete this user?')) {
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
        })
            .then( res => {
                if (res.ok) {
                fetchUsers(); // Refresh users after deletion
            } else {
                throw new Error('Failed to delete this user');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
};

const handleCloseModal = () => {
    setShowEditModal(false);
};

const handleSaveChanges = () => {
    const updatedUser = {
        FirstName: document.getElementById('formBasicFirstName').value,
        LastName: document.getElementById('formBasicLastName').value,
        Email: document.getElementById('formBasicEmail').value,
        Role: editableUser.Role,
    };

    console.log('Updated User:', updatedUser);

    fetch(`http://localhost:3000/users/${editableUser.UserID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log('Success: ', data);
            setShowEditModal(false);
            fetchUsers();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const handleEditCourse = (course) => {
    setEditableCourse(course);
    setShowEditCourseModal(true);
};


const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
        try {
            const res = await fetch(`http://localhost:3000/courses/${courseId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchCourses(); // Refresh courses after deletion
            } else {
                throw new Error('Failed to delete this course');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

const handleCloseCourseModal = () => {
    setShowEditCourseModal(false);
};

const handleSaveCourseChanges = async () => {
    const updatedCourse = {
        CourseName: document.getElementById('formBasicCourseName').value,
        DepartmentID: document.getElementById('formBasicDepartmentID').value,
        CourseCapacity: document.getElementById('formBasicCourseCapacity').value,
        credits: document.getElementById('formBasicCredits').value,
        Description: document.getElementById('formBasicDescription').value,
    };

    try {
        const res = await fetch(`http://localhost:3000/courses/${editableCourse.CourseID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCourse),
        });
        if (res.ok) {
            setShowEditCourseModal(false);
            fetchCourses();
        } else {
            throw new Error('Failed to update course');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


const [newCourse, setNewCourse] = useState({
    CourseName: '',
    DepartmentID: '',
    CourseCapacity: '',
    credits: '',
    Description: '',
    StartTime: '',
    EndTime: '',
    DaysOfWeek: '',
    RoomID: '',
    InstructorID: ''
});


// Function to handle input change
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prevState => ({
        ...prevState,
        [name]: value
    }));
};

// Function to handle form submission for adding a new course
const handleAddCourse = async () => {
    try {
        const res = await fetch('http://localhost:3000/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCourse),
        });
        if (res.ok) {
            // Refresh course list after adding new course
            fetchCourses();
            // Reset form fields
            setNewCourse({
                CourseName: '',
                DepartmentID: '',
                CourseCapacity: '',
                credits: '',
                Description: '',
                StartTime: '',
                EndTime: '',
                DaysOfWeek: '',
                RoomID: '',
                InstructorID: ''
            });
            // Close modal
            setShowAddCourseModal(false);
        } else {
            throw new Error('Failed to add new course');
        }
        console.log('After updating:', newCourse); 
    } catch (error) {
        console.error('Error:', error);
    }
};



    return (
        <>
        <NavBar />
        <Container>
            <Row className="my-4">
                <Col>
                    <h2>Students</h2>
                    <UserTable users={students} userType="students" handleEdit={handleEdit} handleDelete={handleDelete} />
                </Col>
            </Row>
            <Row className="my-4">
                <Col>
                    <h2>Instructors</h2>
                    <UserTable users={instructors} userType="instructors" handleEdit={handleEdit} handleDelete={handleDelete} />
                </Col>
            </Row>

            <Button variant="primary" onClick={() => setShowAddCourseModal(true)}>Add New Course</Button>

            {/* Modal for adding new course */}
            <Modal show={showAddCourseModal} onHide={() => setShowAddCourseModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                    <Form.Group controlId='formBasicCourseName'>
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control type="text" name="CourseName" value={newCourse.CourseName} onChange={handleInputChange} placeholder="Course Name" />
                    </Form.Group>
                    <Form.Group controlId='formBasicDepartmentID'>
                        <Form.Label>Department ID</Form.Label>
                        <Form.Control type="text" name="DepartmentID" value={newCourse.DepartmentID} onChange={handleInputChange} placeholder="Department ID" />
                    </Form.Group>
                    <Form.Group controlId='formBasicCourseCapacity'>
                        <Form.Label>Course Capacity</Form.Label>
                        <Form.Control type="text" name="CourseCapacity" value={newCourse.CourseCapacity} onChange={handleInputChange} placeholder="Course Capacity" />
                    </Form.Group>
                    <Form.Group controlId='formBasicCredits'>
                        <Form.Label>Credits</Form.Label>
                        <Form.Control type="text" name="credits" value={newCourse.credits} onChange={handleInputChange} placeholder="Credits" />
                    </Form.Group>
                    <Form.Group controlId='formBasicDescription'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="Description" value={newCourse.Description} onChange={handleInputChange} placeholder="Description" />
                    </Form.Group>
                    <Form.Group controlId='formBasicStartTime'>
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control type="text" name="StartTime" value={newCourse.StartTime} onChange={handleInputChange} placeholder="00:00:00" />
                    </Form.Group>
                    <Form.Group controlId='formBasicEndTime'>
                        <Form.Label>End Time</Form.Label>
                        <Form.Control type="text" name="EndTime" value={newCourse.EndTime} onChange={handleInputChange} placeholder="24:00:00" />
                    </Form.Group>
                    <Form.Group controlId='formBasicDaysOfWeek'>
                        <Form.Label>Days Of The Week</Form.Label>
                        <Form.Control type="text" name="DaysOfWeek" value={newCourse.DaysOfWeek} onChange={handleInputChange} placeholder="MTWRF" />
                    </Form.Group>
                    <Form.Group controlId='formBasicRoomID'>
                        <Form.Label>Room ID</Form.Label>
                        <Form.Control type="number" name="RoomID" value={newCourse.RoomID} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId='formBasicInstructorID'>
                        <Form.Label>Instructor ID</Form.Label>
                        <Form.Control type="number" name="InstructorID" value={newCourse.InstructorID} onChange={handleInputChange} />
                    </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddCourseModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddCourse}>Add Course</Button>
                </Modal.Footer>
            </Modal>

            <Row className="my-4">
                <Col>
                    <h2>Courses</h2>
                    <CourseTable courses={courses} handleEdit={handleEditCourse} handleDelete={handleDeleteCourse} />
                </Col>
            </Row>
            {/* Edit Modal for Courses */}
            <Modal show={showEditCourseModal} onHide={handleCloseCourseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form>
                            <Form.Group controlId='formBasicCourseName'>
                                <Form.Label>Course Name</Form.Label>
                                <Form.Control type="text" placeholder="Course Name" defaultValue={editableCourse?.CourseName} />
                            </Form.Group>
                            <Form.Group controlId='formBasicDepartmentID'>
                                <Form.Label>Department ID</Form.Label>
                                <Form.Control type="text" placeholder="Department ID" defaultValue={editableCourse?.DepartmentID} />
                            </Form.Group>
                            <Form.Group controlId='formBasicCourseCapacity'>
                                <Form.Label>Course Capacity</Form.Label>
                                <Form.Control type="text" placeholder="Course Capacity" defaultValue={editableCourse?.CourseCapacity} />
                            </Form.Group>
                            <Form.Group controlId='formBasicCredits'>
                                <Form.Label>Credits</Form.Label>
                                <Form.Control type="text" placeholder="Credits" defaultValue={editableCourse?.credits} />
                            </Form.Group>
                            <Form.Group controlId='formBasicDescription'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Description" defaultValue={editableCourse?.Description} />
                            </Form.Group>
                        </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCourseModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveCourseChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            {/* Edit Modal for Users */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='formBasicFirstName'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="First Name" defaultValue={editableUser?.FirstName} />
                        </Form.Group>
                        <Form.Group controlId='formBasicLastName'>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Last Name" defaultValue={editableUser?.LastName} />
                        </Form.Group>
                        <Form.Group controlId='formBasicEmail'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" defaultValue={editableUser?.Email} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
    </Container>
    </>
    )
}

export default AdminPage;
