import React, { useState } from 'react';

    const SignUpPage = () => {
    const [userType, setUserType] = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log('User Type:', userType);
        console.log('School ID:', schoolId);
        console.log('Password:', password);
    };

    return (
        <div className="flex justify-center items-center h-screen">

        <div className="w-96">

            <h2 className="text-2xl mb-4">Sign Up</h2>

            <div className="mb-4">
            <label htmlFor="userType" className="block mb-1">User Type</label>
            <select
                id="userType"
                className="w-full p-2 border rounded"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
            >
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="administrator">Administrator</option>
            </select>
            </div>

            <form onSubmit={handleSignUp}>

            <div className="mb-4">
                <label htmlFor="schoolId" className="block mb-1">School ID</label>
                <input
                type="text"
                id="schoolId"
                className="w-full p-2 border rounded"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block mb-1">Password</label>
                <input
                type="password"
                id="password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>

            </form>

        </div>

        </div>
    );
};

export default SignUpPage;
