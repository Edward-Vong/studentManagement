import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import AdminPage from "./components/AdminPage";
import StudentPage from './components/StudentPage';
import InstructorPage from './components/InstructorPage';

function App() {
  const [count, setCount] = useState(0);

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/instructor" element={<InstructorPage />} />
      </Routes>
  );
}

export default App;
