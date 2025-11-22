import AuthPage from "./pages/auth/AuthPage"
import Home from "./pages/Home"
import { Route, Routes, Navigate } from "react-router-dom"



function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-t from-blue-900 to-gray-400 flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App
