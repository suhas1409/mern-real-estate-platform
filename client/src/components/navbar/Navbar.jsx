import React, { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fetchNotifications = useNotificationStore(
    (state) => state.fetch
  );

  const number = useNotificationStore(
    (state) => state.number
  );

  // FETCH NOTIFICATIONS
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, fetchNotifications]);

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="logo" />
          <span>SuhasEstate</span>
        </Link>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Property
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Add Property
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          ❤️ Favorites
        </NavLink>
      </div>

      {/* RIGHT */}
      <div className="right">
        {currentUser ? (
          <div className="user">
            <div className="userInfo">
              <img
                src={currentUser.avatar || "/noavatar.png"}
                alt="user"
              />

              <span className="username">
                {currentUser.username}
              </span>
            </div>

            <Link className="profile" to="/profile">
              {number > 0 && (
                <div className="notification">
                  {number}
                </div>
              )}

              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>

            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}

        {/* MOBILE MENU ICON */}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt="menu"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>

        {/* MOBILE MENU */}
        <div className={open ? "menu active" : "menu"}>
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link to="/list" onClick={() => setOpen(false)}>
            Property
          </Link>

          <Link to="/add" onClick={() => setOpen(false)}>
            Add Property
          </Link>

          <Link
            to="/favorites"
            onClick={() => setOpen(false)}
          >
            ❤️ Favorites
          </Link>

          {currentUser ? (
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};