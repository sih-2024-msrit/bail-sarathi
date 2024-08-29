// Import necessary modules and components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="bg-white min-h-screen">

    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
