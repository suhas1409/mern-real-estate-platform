import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { UploadWidget } from "../../components/uploadWidget/uploadWidget";

export const ProfileUpdatePage = () => {
  const { currentUser, updateUser } =
    useContext(AuthContext);

  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const formData = new FormData(e.target);

    const { username, email, password } =
      Object.fromEntries(formData);

    try {
      setIsSubmitting(true);

      const res = await apiRequest.put(
        `/users/${currentUser.id}`,
        {
          username,
          email,
          password,
          avatar:
            avatar[0] || currentUser.avatar,
        }
      );

      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profileUpdatePage">
      {/* LEFT CONTAINER */}
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>

          <div className="item">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              defaultValue={
                currentUser.username
              }
              required
            />
          </div>

          <div className="item">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
              required
            />
          </div>

          <div className="item">
            <label htmlFor="password">
              New Password
            </label>

            <div className="passwordContainer">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Leave blank to keep current password"
              />

              <button
                type="button"
                className="eyeButton"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
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
          </div>

          <button
            className="updateButton"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Updating..."
              : "Update Profile"}
          </button>

          {error && (
            <span className="error">
              {error}
            </span>
          )}
        </form>
      </div>

      {/* RIGHT CONTAINER */}
      <div className="sideContainer">
        <img
          src={
            avatar[0] ||
            currentUser.avatar ||
            "/noavatar.png"
          }
          alt="Profile avatar"
          className="avatar"
        />

        <UploadWidget
          uwConfig={{
            cloudName: "dlxb4iac7",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 200000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
};