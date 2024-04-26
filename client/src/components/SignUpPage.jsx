import React, { useState } from 'react';
import "../styles/SignUpPage.css";

const SignUpPage = () => {
    const [userType, setUserType] = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [password, setPassword] = useState('');

    //signup handler
    const handleSignUp = async (e) => {
        e.preventDefault();
        
        //user sign up info
        const userData = {
            userType: userType,
            schoolId: schoolId,
            password: password
        };

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Error signing up user');
            }

            console.log('User signed up successfully');
            
        } catch (error) {
            console.error('Error signing up user:', error.message);
            
        }
    };

    return (
        <div className="SignUpMain">

            <div className="SignUp">

                <h2>Sign Up</h2>

                <div className="userType">

                    <label>User Type</label>
                    <select
                        id="userType"
                        className="userTypeDD"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                    >
                        <option value="">Select User Type</option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>

                </div>

                <form onSubmit={handleSignUp}>
                    <div className="inputBoxes">
                        <label>School ID</label>
                        <input
                            type="text"
                            id="schoolId"
                            className="schoolIdIN"
                            value={schoolId}
                            onChange={(e) => setSchoolId(e.target.value)}
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
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
