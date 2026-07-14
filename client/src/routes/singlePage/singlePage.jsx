//routes/singlePage/singlePage.jsx
import "./singlePage.scss";
import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { Slider } from "../../components/slider/Slider";
import { Map } from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

export const SinglePage = () => {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved ?? false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const isOwner = currentUser?.id === post.user?.id;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      await apiRequest.delete(
        `/posts/${post.id}`
      );
  
      alert("Property deleted successfully");
      navigate("/profile"); // Redirect to profile page
    } catch (err) {
      console.error(err);
      alert("Failed to delete property");
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.error(err);
      setSaved((prev) => !prev);
    }
  };

  const handleChat = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await apiRequest.post("/chats", {
        receiverId: post.user.id,
      });

      navigate("/profile", {
        state: {
          openChatId: res.data.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">Rs. {post.price}</div>
              </div>
              <div className="user">
                <img 
                  src={post.user.avatar || "/noavatar.png"} 
                  alt={`${post.user.username} avatar`} 
                />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            {isOwner ? (
              <>
                <button
                  className="editBtn"
                  onClick={() =>
                    navigate(`/update/${post.id}`)
                  }
                >
                  <Pencil size={18} />
                  Edit Property
                </button>

                <button
                  className="deleteBtn"
                  onClick={handleDelete}
                >
                  <Trash2 size={18} />
                  Delete Property
                </button>
              </>
            ) : (
              <>
                <button
                  className="chatBtn"
                  onClick={handleChat}
                >
                  <MessageCircle size={18} />
                  Send Message
                </button>

                <button
                  className="saveBtn"
                  onClick={handleSave}
                >
                  <Heart
                    size={18}
                    fill={saved ? "#ff4d6d" : "none"}
                    color={saved ? "#ff4d6d" : "#666"}
                  />
                  {saved
                    ? "Saved"
                    : "Save Property"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};