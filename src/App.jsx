import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import NewSession from "@/components/pages/NewSession";
import History from "@/components/pages/History";
import SessionDetail from "@/components/pages/SessionDetail";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-session" element={<NewSession />} />
          <Route path="/history" element={<History />} />
          <Route path="/session/:id" element={<SessionDetail />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;