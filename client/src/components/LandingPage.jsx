import "../styles/LandingPage.css"; 

const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <div className="logo-container">
                <img alt="EduControl_Logo" className="logo" src="../assets/EduContol.png" />
            </div>
            <div className="button-container">
                <button className="login-button">
                    Login
                </button>
                <button className="signup-button">
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default LandingPage;