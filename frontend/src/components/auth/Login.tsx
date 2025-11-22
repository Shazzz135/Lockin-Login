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
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
        const data = await response.json();
        if (response.ok) {
            setSuccess("Login Successful!");
            setForm({
              email: "",
              password: "",
            });
            setTimeout(() => {
              navigate("/home");
            }, 1000);
        } else {
            setError(data.message || "Login failed.");
        }
        } catch (error) {
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
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
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