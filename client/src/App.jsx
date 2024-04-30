
import { Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import AdminPage from "./components/AdminPage";
import StudentPage from './components/StudentPage';
import InstructorPage from './components/InstructorPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute component={AdminPage} roles={['Admin']} />} />
        <Route path="/student" element={<ProtectedRoute component={StudentPage} roles={['Student']} />} />
        <Route path="/instructor" element={<ProtectedRoute component={InstructorPage} roles={['Instructor']} />} />
      </Routes>
  );
}

export default App;
