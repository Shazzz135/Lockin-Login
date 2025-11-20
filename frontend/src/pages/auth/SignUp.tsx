import { useSignupForm } from "../../components/auth/signupform";
import Card from "../../components/Card.tsx";

function SignUp() {
  const { form, handleChange, handleSubmit, error } = useSignupForm();

  // Form validation logic
  const isFormValid =
    form.firstname.trim() !== "" &&
    form.lastname.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword;

  return (
    <div>
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="border rounded p-2"
              required
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="border rounded p-2"
              required
              placeholder="Last Name"
            />
          </div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border rounded p-2"
            required
            placeholder="Email Address"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border rounded p-2"
            required
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="border rounded p-2 "
            required
            placeholder="Confirm Password"
          />
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
    </div>
  );
}

export default SignUp;