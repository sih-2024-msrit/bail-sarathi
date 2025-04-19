// Import necessary modules and components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login"
// import ApplicationStatus from "./pages/ApplicationStatus";
import BailApply from "./pages/BailApply";
import BailSumary from "./pages/BailSumary";
import ChatbotModal from "./components/ChatbotModal";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="relative dm-serif bg-slategray min-h-screen">
      <ChatbotModal/>
  
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<Login/>}/>
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/:applicationNo" 
          element={
            <ProtectedRoute>
              <BailSumary />
            </ProtectedRoute>
          } 
        />
        {/* <Route path="/application" element={ApplicationStatus}/> */}
        <Route 
          path="/apply-bail" 
          element={
            <ProtectedRoute>
              <BailApply />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/bail-summary" 
          element={
            <ProtectedRoute>
              <BailSumary />
            </ProtectedRoute>
          }
        />
      </Routes>
    
    </div>
  );
}

export default App;
