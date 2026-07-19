// src/routes/profilePage/ProfilePage.jsx

import React, {
  useContext,
  Suspense,
  useState,
  useEffect,
} from "react";

import "./profilePage.scss";

import { List } from "../../components/list/list";
import { Chat } from "../../components/chat/chat";
import apiRequest from "../../lib/apiRequest";

import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

export const ProfilePage = () => {
  const data = useLoaderData();

  const { updateUser, currentUser } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const [userPosts, setUserPosts] = useState([]);
  const [view, setView] = useState("properties");

  // LOAD USER POSTS
  useEffect(() => {
    let isMounted = true;

    data.postResponse.then((res) => {
      if (isMounted) {
        setUserPosts(res.data.userPosts);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [data]);

  // REMOVE DELETED PROPERTY
  const handleDeletePost = (postId) => {
    setUserPosts((prev) =>
      prev.filter((post) => post.id !== postId)
    );
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      updateUser(null);

      navigate("/");
    }
  };

  return (
    <div className="profilePage">
      {/* VIEW SWITCHER */}
      <div className="profileViewSwitcher">
        <button
          className={
            view === "properties" ? "active" : ""
          }
          onClick={() => setView("properties")}
        >
          My Properties
        </button>

        <button
          className={
            view === "messages" ? "active" : ""
          }
          onClick={() => setView("messages")}
        >
          Messages
        </button>
      </div>

      {/* LEFT SIDE */}
      <div
        className={`details ${
          view === "properties" ? "show" : ""
        }`}
      >
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>

            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>

          <div className="info">
            <span>
              Avatar:
              <img
                src={
                  currentUser.avatar ||
                  "/noavatar.png"
                }
                alt="User avatar"
              />
            </span>

            <span>
              Username:
              <strong>
                {currentUser.username}
              </strong>
            </span>

            <span>
              E-mail:
              <strong>{currentUser.email}</strong>
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="title">
            <h1>My Properties</h1>

            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>

          <h3>
            Total Properties: {userPosts.length}
          </h3>

          <List
            posts={userPosts}
            isOwner={true}
            onDelete={handleDeletePost}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className={`chatContainer ${
          view === "messages" ? "show" : ""
        }`}
      >
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.chatResponse}>
              {(chatResponse) => (
                <Chat chats={chatResponse.data} />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
};