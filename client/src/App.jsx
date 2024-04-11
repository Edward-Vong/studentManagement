import { Outlet } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import AdminPage from "./components/AdminPage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <LandingPage />
    </div>
  );
};
export default App