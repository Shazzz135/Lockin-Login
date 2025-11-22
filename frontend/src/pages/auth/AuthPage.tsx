import { Routes, Route } from "react-router-dom";
import SignUp from "../../components/auth/SignUp";
import Login from "../../components/auth/Login";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-900 to-gray-400 flex items-center justify-center">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}