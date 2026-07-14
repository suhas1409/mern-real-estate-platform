import { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import apiRequest from "../../lib/apiRequest";

export const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      {/* FORM CONTAINER */}
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>

          <input
            name="username"
            type="text"
            placeholder="Username"
            minLength={3}
            maxLength={20}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
          />

          <div className="passwordContainer">
            <input
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              minLength={6}
              required
            />

            <button
              type="button"
              className="eyeButton"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          </div>

          <button
            className="registerButton"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Registering..."
              : "Register"}
          </button>

          {error && (
            <span className="error">
              {error}
            </span>
          )}

          <Link to="/login">
            Do you have an account?
          </Link>
        </form>
      </div>

      {/* IMAGE CONTAINER */}
      <div className="imgContainer">
        <img
          src="/bg.png"
          alt="Real estate"
        />
      </div>
    </div>
  );
};