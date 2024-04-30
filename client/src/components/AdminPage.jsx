import { useState, useEffect } from 'react';
import UserTable from './UserTable';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import NavBar from './Navbar';

const AdminPage = () => {
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editableUser, setEditableUser] = useState(null);

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
            {/* Edit Modal */}
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
//     const [classes, setClasses] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [searchQuery, setSearchQuery] = useState('');
//     const classesPerPage = 10;

//     useEffect(() => {
//         // Dummy data generation
//         const dummyData = Array.from({ length: 100 }, (_, index) => ({
//         id: index + 1,
//         name: `Class ${index + 1}`
//         }));
//         setClasses(dummyData);
//     }, []);

//     const indexOfLastClass = currentPage * classesPerPage;
//     const indexOfFirstClass = indexOfLastClass - classesPerPage;
//     let filteredClasses = classes.filter((classItem) =>
//         classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     const handleDelete = (id) => {
//         // Dummy delete function
//         setClasses(classes.filter((classItem) => classItem.id !== id));
//     };

//     const handleEdit = (id) => {
//         // Dummy edit function
//         console.log(`Editing class with id: ${id}`);
//     };

//     const handleSearch = (e) => {
//         setSearchQuery(e.target.value);
//         setCurrentPage(1); // Reset page thing when search changes
//     };

//     return (
//         <div className="container mx-auto mt-8">

//             <h2 className="text-2xl font-bold mb-4">Classes</h2>

//             <div className="mb-4">
//                 <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 placeholder="Search for a class..."
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//             </div>

//             <ul>
//                 {currentClasses.map((classItem) => (

//                 <li key={classItem.id} className="py-2 flex items-center justify-between">

//                     <span>{classItem.name}</span>

//                     <div>

//                         <button
//                             onClick={() => handleEdit(classItem.id)}
//                             className="px-3 py-1 mr-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
//                             Edit
//                         </button>

//                         <button
//                             onClick={() => handleDelete(classItem.id)}
//                             className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
//                             Delete
//                         </button>

//                     </div>

//                 </li>
//                 ))}

//             </ul>

//             <Pagination
//                 itemsPerPage={classesPerPage}
//                 totalItems={filteredClasses.length}
//                 paginate={paginate}
//                 currentPage={currentPage} />

//         </div>
//     );
// };

    // const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    // const pageNumbers = [];

    // for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    //     pageNumbers.push(i);
    // }

    // return (
    //     <nav className="mt-4">

    //         <ul className="flex space-x-2">

    //             {pageNumbers.map((number) => (

    //             <li key={number}>
    //                 <button
    //                 onClick={() => paginate(number)}
    //                 className={`px-3 py-1 rounded-md ${
    //                     currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
    //                 } hover:bg-blue-600 hover:text-white`} >

    //                 {number}

    //                 </button>

    //             </li>
    //             ))}

    //         </ul>

    //     </nav>
    // );
// };

// export default AdminPage;
