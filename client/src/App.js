// Import necessary modules and components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
import ApplicationStatus from "./pages/ApplicationStatus";
import BailApply from "./pages/BailApply";
import BailSumary from "./pages/BailSumary";
function App() {
  return (
    <div className="bg-slategray min-h-screen">

  
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:applicationNo" element={<BailSumary />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="/application" element={ApplicationStatus}/>
        <Route path="/apply-bail" element={<BailApply/>}/>
        <Route path="/bail-summary" element={<BailSumary/>}/>
      </Routes>
    
    </div>
  );
}

export default App;
