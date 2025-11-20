import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useSignupForm() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password match validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Password length validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // If all validations pass
    setError(null);
    navigate("/")
    // Proceed with submit logic (e.g., API call)
    console.log(form);
  }

  return { form, handleChange, handleSubmit, error };
}