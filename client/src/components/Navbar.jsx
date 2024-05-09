import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const handleSignOut = () => {
        // Clear local storage
        localStorage.clear();
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand>EduControl FreakNite University 😜</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Link to="/login">
                    <Button variant="outline-danger" onClick={handleSignOut}>Sign Out</Button>
                </Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
