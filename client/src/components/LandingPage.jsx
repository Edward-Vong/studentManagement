import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (

        <div className="landingpage flex flex-col items-center justify-center h-screen">
        
            <div className="mb-8">
                <img alt="EduControl_Logo" className="" src="src\assets\EduControl.png" />
            </div>

            <div className="flex space-x-4">
                <NavLink to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Login
                </NavLink>
                <NavLink to="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Sign Up
                </NavLink>
            </div>

        </div>

    );
}