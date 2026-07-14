import React, { useEffect, useState } from "react";
import "./favoritesPage.scss";
import { List } from "../../components/list/list";
import apiRequest from "../../lib/apiRequest";

export const FavoritesPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favorites");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await apiRequest.get(
          "/users/profilePosts"
        );

        setSavedPosts(
          res.data.savedPosts || []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveSaved = (postId) => {
    setSavedPosts((prev) =>
      prev.filter(
        (post) => post.id !== postId
      )
    );
  };

  const buyProperties = savedPosts.filter(
    (post) => post.type === "buy"
  ).length;

  const rentProperties = savedPosts.filter(
    (post) => post.type === "rent"
  ).length;

  if (loading) {
    return (
      <div className="favoritesPage">
        <div className="loading">
          Loading favorites...
        </div>
      </div>
    );
  }

  return (
    <div className="favoritesPage">
      {/* MOBILE AND MEDIUM SWITCH */}
      <div className="favoritesSwitch">
        <button
          className={
            activeTab === "favorites"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("favorites")
          }
        >
          ❤️ Favorites
        </button>

        <button
          className={
            activeTab === "stats"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("stats")
          }
        >
          📊 Stats
        </button>
      </div>

      {/* LEFT SIDE */}
      <div
        className={`details ${
          activeTab !== "favorites"
            ? "hideSection"
            : ""
        }`}
      >
        <div className="wrapper">
          <div className="title">
            <h1>
              ❤️ Favorites ({savedPosts.length})
            </h1>
          </div>

          {savedPosts.length === 0 ? (
            <div className="emptyState">
              <h2>No Saved Properties</h2>

              <p>
                Save properties from listings to
                see them here.
              </p>
            </div>
          ) : (
            <List
              posts={savedPosts}
              onRemoveSaved={handleRemoveSaved}
            />
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className={`statsContainer ${
          activeTab !== "stats"
            ? "hideSection"
            : ""
        }`}
      >
        <div className="wrapper">
          <div className="statCard">
            <h2>{savedPosts.length}</h2>
            <p>Total Favorites</p>
          </div>

          <div className="statCard">
            <h2>{buyProperties}</h2>
            <p>Buy Properties</p>
          </div>

          <div className="statCard">
            <h2>{rentProperties}</h2>
            <p>Rent Properties</p>
          </div>

          <div className="tips">
            <h3>Tips</h3>

            <ul>
              <li>
                Compare multiple properties before
                buying.
              </li>

              <li>
                Contact owners directly through
                chat.
              </li>

              <li>
                Save properties to revisit later.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};