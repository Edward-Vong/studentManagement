import { Table } from 'react-bootstrap';

const UserTable = ({ users, userType, handleEdit, handleDelete }) => {
    return (
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
            <tr key={user.UserID}>
                <td>{user.UserID}</td>
                <td>{user.FirstName} {user.LastName}</td>
                <td>{user.Email}</td>
                <td>
                <button className="btn btn-primary btn-sm mr-2" style={{ marginRight: '10px' }} onClick={() => handleEdit(user)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.UserID, userType)}>Delete</button>
                </td>
            </tr>
            ))}
        </tbody>
        </Table>
    );
};

export default UserTable;
