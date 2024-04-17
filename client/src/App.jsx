import { Outlet } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import AdminPage from "./components/AdminPage";

const App = () => {
  return (
    <div className="w-full p-6">
      <AdminPage />
    </div>
  );
};
export default App