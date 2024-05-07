import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    //main two that's needed for login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    

    const handleLogin = async (e) => {
        e.preventDefault();

        //log user login inputs
        console.log('Email:', email);
        console.log('Password:', password);

        //Post
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            //if req response is good
            if (response.ok) {
                console.log('User logged in successfully:', data.user);

                // Save the user's role in local storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.user.role);
                localStorage.setItem('id', data.user.id);

                //redirect user to whichever role they're part of
                if (data.user.role === 'Admin') {
                    navigate('/admin');
                } else if (data.user.role === 'Student') {
                    navigate('/student');
                } else if (data.user.role === 'Instructor') {
                    navigate('/instructor');
                }
            } else {
                console.error('Error logging in:', data.message);
            }
        } catch (error) {
            console.error('Error during sign in:', error.message);
        }
    };
    return (
        <div className="logInMain">

            <div className="logIn">

                <h2>Login</h2>

                <form onSubmit={handleLogin}>

                <div className="LPbutton">
                    <label className="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        className="emailIn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="LPbutton">
                    <label className="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="loginIn"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Login</button>

                </form>

                <h4>Need to create an account?</h4>
                <button className="signup-button" onClick={handleSignUpClick}>
                    Sign Up
                </button>

            </div>
            

        </div>
    );
};

export default LoginPage;
