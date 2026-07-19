//component/card/Card.jsx
import React, { useContext, useState, useEffect } from "react";
import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import "./card.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

export const Card = ({item, onRemoveSaved, isOwner = false, onDelete}) => {

  const [saved, setSaved] = useState(
    item?.isSaved ?? false
  );

  const { currentUser } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const isMyProperty = currentUser?.id === item.userId;

  useEffect(() => {
    setSaved(item?.isSaved ?? false);
  }, [item]);

  // SAVE / UNSAVE PROPERTY
  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await apiRequest.post(
        "/users/save",
        {
          postId: item.id,
        }
      );

      if (res.data.message === "Post saved") {
        setSaved(true);
      } else if (
        res.data.message === "Post removed from saved list"
      ) {
        setSaved(false);

        if (onRemoveSaved) {
          onRemoveSaved(item.id);
        }
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // OPEN CHAT
  const handleChatToggle = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await apiRequest.post(
        "/chats",
        {
          receiverId: item.userId,
        }
      );

      navigate("/profile", {
        state: {
          openChatId: res.data.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE PROPERTY
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      await apiRequest.delete(
        `/posts/${item.id}`
      );

      alert("Property deleted successfully");

      // Remove instantly from UI
      if (onDelete) {
        onDelete(item.id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete property");
    }
  };

  return (
    <div className="card">
      {/* IMAGE */}
      <Link
        to={`/${item.id}`}
        className="imageContainer"
      >
        <img
          src={
            item.images?.[0] ||
            "/no-image.png"
          }
          alt={item.title}
        />
      </Link>

      {/* DETAILS */}
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>
            {item.title}
          </Link>
        </h2>

        <p className="address">
          <img
            src="/pin.png"
            alt="location"
          />
          <span>{item.address}</span>
        </p>

        <p className="price">
          Rs. {item.price}
        </p>

        <div className="bottom">
          {/* FEATURES */}
          <div className="features">
            <div className="feature">
              <img
                src="/bed.png"
                alt="bedroom"
              />
              <span>
                {item.bedroom} bedroom
              </span>
            </div>

            <div className="feature">
              <img
                src="/bath.png"
                alt="bathroom"
              />
              <span>
                {item.bathroom} bathroom
              </span>
            </div>
          </div>

          {/* ICONS */}
          <div className="icons">
            {isOwner ? (
              <>
                <button
                  className="editBtn"
                  aria-label="Edit property"
                  onClick={() =>
                    navigate(`/update/${item.id}`)
                  }
                >
                  <Pencil size={18} />
                </button>

                <button
                  className="deleteBtn"
                  aria-label="Delete property"
                  onClick={handleDelete}
                >
                  <Trash2 size={18} />
                </button>
              </>
            ) : isMyProperty ? (
              <>
                <button
                  className="editBtn"
                  aria-label="Edit property"
                  onClick={() =>
                    navigate(`/update/${item.id}`)
                  }
                >
                  <Pencil size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="favoriteBtn"
                  aria-label={saved ? "Remove from favorites" : "Add to favorites"}
                  onClick={handleSave}
                >
                  <Heart
                    size={22}
                    strokeWidth={2}
                    fill={saved ? "#ff4d6d" : "none"}
                    color={saved ? "#ff4d6d" : "#999"}
                  />
                </button>

                <button
                  className="chatBtn"
                  aria-label="Chat with property owner"
                  onClick={handleChatToggle}
                >
                  <MessageCircle
                    size={22}
                    strokeWidth={2}
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};