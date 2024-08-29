// Import necessary modules and components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
function App() {
  return (
    <div className="bg-white min-h-screen">

  
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    
    </div>
  );
}

export default App;
