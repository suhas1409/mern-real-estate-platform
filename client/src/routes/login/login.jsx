import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

export const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post(
        "/auth/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      updateUser(res.data.user);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      {/* FORM CONTAINER */}
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>

          <input
            name="username"
            type="text"
            placeholder="Username"
            minLength={3}
            maxLength={20}
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
            className="loginButton"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Logging in..."
              : "Login"}
          </button>

          {error && (
            <span className="error">
              {error}
            </span>
          )}

          <Link to="/register">
            Don't you have an account?
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