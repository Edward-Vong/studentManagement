import { NavLink } from "react-router-dom";
import "../styles/LandingPage.css"; 

export default function LandingPage() {
    return (
        <div className="landing-page-container">
            <div className="logo-container">
                <img alt="EduControl_Logo" className="logo" src="../assets/EduContol.png" />
            </div>
            <div className="button-container">
                <NavLink to="/login" className="login-button">
                    Login
                </NavLink>
                <NavLink to="/signup" className="signup-button">
                    Sign Up
                </NavLink>
            </div>
        </div>
    );
}