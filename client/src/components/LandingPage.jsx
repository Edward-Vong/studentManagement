import { useNavigate } from 'react-router-dom';
import "../styles/LandingPage.css";
import EduControl from '../../public/assets/EduControl.png';

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
                <img src={EduControl} alt="EduControl Logo" className="logo"/>
            </div>
            <div className="text-container">
                <h1>Welcome to EduControl</h1>
                <h2>Your one-stop solution for education management</h2>
                <p>EduControl is a platform that allows admins, students, and instructors to manage their tasks efficiently. Admins can create, delete, or update students and instructors. Students and instructors get their own personalized views.</p>
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
