import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Publish from "./pages/Publish";
import LoginModal from "./components/LoginModal";
import MyNotices from "./pages/MyNotices";

function App() {
  // State to manage the login modal visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Blurred overlay */}
      {isLoginOpen && (
        <div
          className="fixed inset-0 z-10 backdrop-blur-sm transition-all duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className={isLoginOpen ? "pointer-events-none select-none" : ""}>
        <Routes>
          <Route
            path="/"
            element={<Home onLoginClick={() => setIsLoginOpen(true)} />}
          />
          <Route path="/publish" element={<Publish />} />
          <Route path="/mynotices" element={<MyNotices />} />
        </Routes>
      </div>

      {/* Modal */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
}

export default App;
