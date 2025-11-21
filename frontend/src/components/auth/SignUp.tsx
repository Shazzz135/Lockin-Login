import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Card";

function SignUp() {
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
        setSuccess(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.firstname || !form.lastname || !form.email || !form.password || !form.confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Invalid email format.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError(null);

        // Proceed with form submission (e.g., API call)
        try {
          const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              firstname: form.firstname,
              lastname: form.lastname,
              email: form.email,
              password: form.password,
              count: 0
            })
          });

          const data = await response.json();
          if (response.ok) {
            setSuccess("User created successfully");
            setForm({
              firstname: "",
              lastname: "",
              email: "",
              password: "",
              confirmPassword: ""
            });
            setTimeout(() => {
              navigate("/home");
            }, 1000);
          } else {
            setError(data.message || "Signup Failed");
          }
        } catch (err) {
            setError("Network error. Please try again.");
        }
    }   

    const isFormValid = 
        form.firstname.trim() !== "" &&
        form.lastname.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
        form.password.length >= 8 &&
        form.password === form.confirmPassword;

    return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <input
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="border rounded p-2 w-32"
            required
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            className="border rounded p-2 w-32"
            required
            placeholder="Last Name"
          />
        </div>
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
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          className="border rounded p-2 w-64"
          required
          placeholder="Confirm Password"
        />
        {success && (
          <div className="text-green-500 text-sm text-center">{success}</div>
        )}
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2"
          disabled={!isFormValid}
          style={{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? "pointer" : "not-allowed" }}
        >
          Sign Up
        </button>
      </form>
    </Card>
  );
}

export default SignUp;
