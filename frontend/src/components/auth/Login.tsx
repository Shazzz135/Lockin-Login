import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../Card";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
        const data = await response.json();
        console.log('Login response:', { status: response.status, data });
        if (response.ok) {
            setSuccess("Login Successful!");
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setForm({
              email: "",
              password: "",
            });
            setTimeout(() => {
              navigate("/home");
            }, 1000);
        } else {
            console.error('Login failed:', data);
            setError(data.message || data.error || "Login failed.");
        }
        } catch (error) {
            console.error('Network error:', error);
            setError("An error occurred. Please try again.");
        }
    }

    return (
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded p-2 w-64"
              required
              placeholder="Email Address"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border rounded p-2 w-64"
              required
              placeholder="Password"
            />
            {success && <p className="text-green-500 text-center">{success}</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 text-white rounded p-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={form.email.trim() === "" || form.password.trim() === ""}
            >
              Login
            </button>
            <div className="text-center mt-2 text-blue-600">
                Don't have an account? <Link className = "underline" to="../signup">Sign Up</Link>
            </div>
          </form>
        </Card>
      );

    }

export default Login;