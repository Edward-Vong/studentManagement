import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/LandingPage.css";


const LandingPage = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div className="landing-page-container">
            <div className="logo-container">
                <img alt="EduControl Logo" className="logo"/>
            </div>
            <div className="button-container">
                <button className="login-button" onClick={handleLoginClick}>
                    Login
                </button>
                <button className="signup-button" onClick={handleSignUpClick}>
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default LandingPage;
