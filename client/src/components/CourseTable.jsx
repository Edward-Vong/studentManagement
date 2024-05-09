import { Table } from 'react-bootstrap';

const CourseTable = ({ courses, handleEdit, handleDelete }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {courses.map(course => (
                    <tr key={course.CourseID}>
                        <td>{course.CourseID}</td>
                        <td>{course.CourseName}</td>
                        <td>{course.credits}</td>
                        <td>{course.Description}</td>
                        <td>
                            <button className="btn btn-primary btn-sm mr-2" style={{ marginRight: '10px' }} onClick={() => handleEdit(course)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course.CourseID)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default CourseTable;
