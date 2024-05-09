import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/SignUpPage.css";

const SignUpPage = () => {
    // Renamed userType to role to match the database schema
    const [role, setRole] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //for nagivating to login page
    const navigate = useNavigate();
        const handleLoginClick = () => {
        navigate('/login');
    };

    // Signup handler
    const handleSignUp = async (e) => {
        e.preventDefault();

        // Reset error message
        setError('');

        // Check if email and password are not empty
        if (email === '' || password === '') {
           console.error('Email and password are required');
            return;
        }

        // Check if password is at least 8 characters long
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        // Construct userData object to match the database schema
        const userData = {
            Role: role,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password
        };

        // POST request to the server
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            //if req response is NOT good
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                //else req response is good
                //and get redirected to login page
                } else {
                    navigate('/login');
                    console.log('User signed up successfully');

                }
            } catch (error) {
                console.error('Error during sign up:', error.message);
            }
    };

    return (
        <div className="SignUpMain">

            <div className="SignUp">

                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>

                <div >
                    <div className="userType">
                        <label>User Type</label>
                        <select
                            id="role"
                            className="userTypeDD"
                            value={role}
                            onChange={(e) => {
                                console.log(e.target.value); // This should log the selected value
                                setRole(e.target.value);
                            }}
                        >
                            <option value="">Select User Type</option>
                            <option value="Student">Student</option>
                            <option value="Instructor">Instructor</option>
                        </select>
                    </div>

                    <div className="inputBoxes">
                    <label>First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className="firstNameIN"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="inputBoxes">
                        <label>Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            className="lastNameIN"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="inputBoxes">
                        <label>Email</label>
                        <input
                            type="email"
                            id="email"
                            className="emailIN"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        </div>

                    <div className="inputBoxes">
                        <label>Password</label>
                        <input
                            type="password"
                            id="password"
                            className="passwordIN"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <div className="error">{error}</div>}
                    </div>
                </div>

                <div className="mt-5">
                    <button className="signup-button" type="submit">Sign Up</button>
                </div>
                </form>

            </div>

            <div className="redirect">
                <h4>Already have an account?</h4>
                <button className="login-button" onClick={handleLoginClick}>
                        Login
                </button>
            </div>
        </div>
    );

};

export default SignUpPage;
