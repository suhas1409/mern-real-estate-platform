// routes/updatePostPage/UpdatePostPage.jsx

import { useState } from "react";
import "./updatePostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import { UploadWidget } from "../../components/uploadWidget/uploadWidget";
import {
  useLoaderData,
  useNavigate,
} from "react-router-dom";

export const UpdatePostPage = () => {
  const post = useLoaderData();

  const [value, setValue] = useState(
    post.postDetail.desc
  );

  const [images, setImages] = useState(
    post.images || []
  );

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const navigate = useNavigate();

  // PREVENT MOUSE WHEEL FROM CHANGING NUMBER INPUT
  const preventNumberScroll = (e) => {
    e.currentTarget.blur();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const formData = new FormData(e.target);

    const inputs = Object.fromEntries(
      formData
    );

    // DESCRIPTION VALIDATION
    const cleanDescription = value
      .replace(/<(.|\n)*?>/g, "")
      .trim();

    if (!cleanDescription) {
      setError("Description is required");
      return;
    }

    // IMAGE VALIDATION
    if (images.length === 0) {
      setError(
        "Please upload at least one property image"
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await apiRequest.put(
        `/posts/${post.id}`,
        {
          postData: {
            title: inputs.title.trim(),

            price: Number(inputs.price),

            address: inputs.address.trim(),

            city: inputs.city.trim(),

            bedroom: Number(
              inputs.bedroom
            ),

            bathroom: Number(
              inputs.bathroom
            ),

            type: inputs.type,

            property: inputs.property,

            latitude: inputs.latitude.trim(),

            longitude:
              inputs.longitude.trim(),

            images,
          },

          postDetail: {
            desc: value,

            utilities: inputs.utilities,

            pet: inputs.pet,

            income: inputs.income.trim(),

            size: Number(inputs.size),

            school: inputs.school
              ? Number(inputs.school)
              : 0,

            bus: inputs.bus
              ? Number(inputs.bus)
              : 0,

            restaurant: inputs.restaurant
              ? Number(inputs.restaurant)
              : 0,
          },
        }
      );

      navigate("/profile");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Failed to update property"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="updatePostPage">
      {/* LEFT CONTAINER */}
      <div className="formContainer">
        <h1>Edit Property</h1>

        <div className="wrapper">
          <form
            id="updatePostForm"
            onSubmit={handleSubmit}
          >
            {/* TITLE */}
            <div className="item">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                defaultValue={post.title}
                required
              />
            </div>

            {/* PRICE */}
            <div className="item">
              <label htmlFor="price">
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                defaultValue={post.price}
                onWheel={preventNumberScroll}
                required
              />
            </div>

            {/* ADDRESS */}
            <div className="item">
              <label htmlFor="address">
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                defaultValue={post.address}
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="item description">
              <label htmlFor="desc">
                Description
              </label>

              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
              />
            </div>

            {/* CITY */}
            <div className="item">
              <label htmlFor="city">
                City
              </label>

              <input
                id="city"
                name="city"
                type="text"
                defaultValue={post.city}
                required
              />
            </div>

            {/* BEDROOM */}
            <div className="item">
              <label htmlFor="bedroom">
                Bedroom Number
              </label>

              <input
                id="bedroom"
                name="bedroom"
                type="number"
                min={1}
                step={1}
                defaultValue={post.bedroom}
                onWheel={preventNumberScroll}
                required
              />
            </div>

            {/* BATHROOM */}
            <div className="item">
              <label htmlFor="bathroom">
                Bathroom Number
              </label>

              <input
                id="bathroom"
                name="bathroom"
                type="number"
                min={1}
                step={1}
                defaultValue={post.bathroom}
                onWheel={preventNumberScroll}
                required
              />
            </div>

            {/* LATITUDE */}
            <div className="item">
              <label htmlFor="latitude">
                Latitude
              </label>

              <input
                id="latitude"
                name="latitude"
                type="text"
                defaultValue={post.latitude}
                required
              />
            </div>

            {/* LONGITUDE */}
            <div className="item">
              <label htmlFor="longitude">
                Longitude
              </label>

              <input
                id="longitude"
                name="longitude"
                type="text"
                defaultValue={post.longitude}
                required
              />
            </div>

            {/* TYPE */}
            <div className="item">
              <label htmlFor="type">
                Type
              </label>

              <select
                id="type"
                name="type"
                defaultValue={post.type}
                required
              >
                <option value="rent">
                  Rent
                </option>

                <option value="buy">
                  Buy
                </option>
              </select>
            </div>

            {/* PROPERTY */}
            <div className="item">
              <label htmlFor="property">
                Property
              </label>

              <select
                id="property"
                name="property"
                defaultValue={post.property}
                required
              >
                <option value="apartment">
                  Apartment
                </option>

                <option value="house">
                  House
                </option>

                <option value="condo">
                  Condo
                </option>

                <option value="land">
                  Land
                </option>
              </select>
            </div>

            {/* UTILITIES */}
            <div className="item">
              <label htmlFor="utilities">
                Utilities Policy
              </label>

              <select
                id="utilities"
                name="utilities"
                defaultValue={
                  post.postDetail.utilities
                }
                required
              >
                <option value="owner">
                  Owner is responsible
                </option>

                <option value="tenant">
                  Tenant is responsible
                </option>

                <option value="shared">
                  Shared
                </option>
              </select>
            </div>

            {/* PET POLICY */}
            <div className="item">
              <label htmlFor="pet">
                Pet Policy
              </label>

              <select
                id="pet"
                name="pet"
                defaultValue={
                  post.postDetail.pet
                }
                required
              >
                <option value="allowed">
                  Allowed
                </option>

                <option value="not-allowed">
                  Not Allowed
                </option>
              </select>
            </div>

            {/* INCOME */}
            <div className="item">
              <label htmlFor="income">
                Income Policy
              </label>

              <input
                id="income"
                name="income"
                type="text"
                defaultValue={
                  post.postDetail.income || ""
                }
              />
            </div>

            {/* SIZE */}
            <div className="item">
              <label htmlFor="size">
                Total Size (sqft)
              </label>

              <input
                id="size"
                name="size"
                type="number"
                min={1}
                step={1}
                defaultValue={
                  post.postDetail.size
                }
                onWheel={preventNumberScroll}
                required
              />
            </div>

            {/* SCHOOL */}
            <div className="item">
              <label htmlFor="school">
                School Distance (m)
              </label>

              <input
                id="school"
                name="school"
                type="number"
                min={0}
                step={1}
                defaultValue={
                  post.postDetail.school ?? 0
                }
                onWheel={preventNumberScroll}
              />
            </div>

            {/* BUS */}
            <div className="item">
              <label htmlFor="bus">
                Bus Stop Distance (m)
              </label>

              <input
                id="bus"
                name="bus"
                type="number"
                min={0}
                step={1}
                defaultValue={
                  post.postDetail.bus ?? 0
                }
                onWheel={preventNumberScroll}
              />
            </div>

            {/* RESTAURANT */}
            <div className="item">
              <label htmlFor="restaurant">
                Restaurant Distance (m)
              </label>

              <input
                id="restaurant"
                name="restaurant"
                type="number"
                min={0}
                step={1}
                defaultValue={
                  post.postDetail.restaurant ??
                  0
                }
                onWheel={preventNumberScroll}
              />
            </div>

            {/* DESKTOP UPDATE BUTTON */}
            <button
              className="sendButton desktopSubmit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Updating Property..."
                : "Update Property"}
            </button>

            {/* ERROR */}
            {error && (
              <span className="error">
                {error}
              </span>
            )}
          </form>
        </div>
      </div>

      {/* RIGHT CONTAINER */}
      <div className="sideContainer">
        <h2 className="imageTitle">
          Property Images
        </h2>

        <div className="imageList">
          {images.map((image, index) => (
            <img
              src={image}
              key={image}
              alt={`Property ${index + 1}`}
            />
          ))}
        </div>

        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dlxb4iac7",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>

      {/* MEDIUM / SMALL UPDATE BUTTON */}
      <div className="mobileSubmitContainer">
        <button
          className="sendButton mobileSubmit"
          type="submit"
          form="updatePostForm"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Updating Property..."
            : "Update Property"}
        </button>
      </div>
    </div>
  );
};