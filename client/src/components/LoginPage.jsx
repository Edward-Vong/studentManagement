import React, { useState } from 'react';

    const LoginPage = () => {
    const [schoolId, setSchoolId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login submission
        console.log('School ID:', schoolId);
        console.log('Password:', password);
    };

    return (
        <div className="flex justify-center items-center h-screen">

            <div className="w-96">

                <h2 className="text-2xl mb-4">Login</h2>

                <form onSubmit={handleLogin}>

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

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            
                </form>

            </div>
        
        </div>
    );
};

export default LoginPage;