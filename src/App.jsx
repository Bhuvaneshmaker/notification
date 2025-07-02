import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';
import EmployeeListPage from './pages/EmployeeListPage';
import Navigation from './components/Navigation';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/employee" element={<EmployeeListPage />} />
      </Routes>
      
      {/* Toast Notifications */}
      <ToastContainer
        position="center"
        gravity="top"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;