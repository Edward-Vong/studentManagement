import { useState } from 'react'
import './App.css'
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import AdminPage from "./components/AdminPage";



function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <SignUpPage />
    </div>
  );
};
export default App

