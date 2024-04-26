import { useState } from 'react'
import './App.css'
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import AdminPage from "./components/AdminPage";
import StudentPage from './components/StudentPage';
import InstructorPage from './components/InstructorPage';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <InstructorPage />
    </div>
  );
};
export default App

