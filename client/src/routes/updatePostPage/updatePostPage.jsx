// routes/updatePostPage/UpdatePostPage.jsx
import { useState, useEffect } from "react";
import "./updatePostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import { UploadWidget } from "../../components/uploadWidget/uploadWidget";
import { useLoaderData, useNavigate, } from "react-router-dom";

export const UpdatePostPage = () => {
  const post = useLoaderData();

  const [value, setValue] = useState(post.postDetail.desc);

  // PROPERTY IMAGES
  const [images, setImages] = useState(post.images || []);

  // CURRENT IMAGE BEING PREVIEWED
  const [currentImage, setCurrentImage] = useState(0);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // KEEP CURRENT IMAGE INDEX VALID
  useEffect(() => {
    if (images.length === 0) {
      setCurrentImage(0);
    } else if (currentImage >= images.length) {
      setCurrentImage(images.length - 1);
    }
  }, [images]);

  // PREVENT MOUSE WHEEL FROM CHANGING NUMBER INPUT
  const preventNumberScroll = (e) => {
    e.currentTarget.blur();
  };

  // NEXT IMAGE
  const nextImage = () => {
    if (images.length === 0) return;

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // PREVIOUS IMAGE
  const previousImage = () => {
    if (images.length === 0) return;

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // DELETE CURRENT IMAGE
  const deleteCurrentImage = () => {
    setImages((prev) => {
      const updated = prev.filter(
        (_, index) => index !== currentImage
      );

      if (updated.length === 0) {
        setCurrentImage(0);
      } else if (currentImage >= updated.length) {
        setCurrentImage(updated.length - 1);
      }

      return updated;
    });
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
      console.error(err);

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
                Title <span className="required">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                defaultValue={post.title}
                autoComplete="off"
                required
              />
            </div>

            {/* PRICE */}
            <div className="item">
              <label htmlFor="price">
                Price <span className="required">*</span>
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                defaultValue={post.price}
                autoComplete="off"
                onWheel={preventNumberScroll}
                required
              />
            </div>

            {/* ADDRESS */}
            <div className="item">
              <label htmlFor="address">
                Address <span className="required">*</span>
              </label>

              <input
                id="address"
                name="address"
                type="text"
                defaultValue={post.address}
                autoComplete="street-address"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="item description">
              <label id="descriptionLabel">
                Description <span className="required">*</span>
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
                City <span className="required">*</span>
              </label>

              <input
                id="city"
                name="city"
                type="text"
                defaultValue={post.city}
                autoComplete="address-level2"
                required
              />
            </div>

            {/* BEDROOM */}
            <div className="item">
              <label htmlFor="bedroom">
                Bedroom Number <span className="required">*</span>
              </label>

              <input
                id="bedroom"
                name="bedroom"
                type="number"
                min={1}
                step={1}
                defaultValue={post.bedroom}
                autoComplete="off"
                onWheel={preventNumberScroll}
                required
              />
            </div>

            {/* BATHROOM */}
            <div className="item">
              <label htmlFor="bathroom">
                Bathroom Number <span className="required">*</span>
              </label>

              <input
                id="bathroom"
                name="bathroom"
                type="number"
                min={1}
                step={1}
                defaultValue={post.bathroom}
                autoComplete="off"
                onWheel={preventNumberScroll}
                required
              />
            </div>

            {/* LATITUDE */}
            <div className="item">
              <label htmlFor="latitude">
                Latitude <span className="required">*</span>
              </label>

              <input
                id="latitude"
                name="latitude"
                type="text"
                defaultValue={post.latitude}
                autoComplete="off"
                required
              />
            </div>

            {/* LONGITUDE */}
            <div className="item">
              <label htmlFor="longitude">
                Longitude <span className="required">*</span>
              </label>

              <input
                id="longitude"
                name="longitude"
                type="text"
                defaultValue={post.longitude}
                autoComplete="off"
                required
              />
            </div>

            {/* TYPE */}
            <div className="item">
              <label htmlFor="type">
                Type <span className="required">*</span>
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
                Property <span className="required">*</span>
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
                Utilities Policy <span className="required">*</span>
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
                Pet Policy <span className="required">*</span>
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
                autoComplete="off"
              />
            </div>

            {/* SIZE */}
            <div className="item">
              <label htmlFor="size">
                Total Size (sqft) <span className="required">*</span>
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
          Property Images <span className="required">*</span>
        </h2>

        <p className="imageHint">
          Upload at least one image.
        </p>

        {/* IMAGE PREVIEW */}
        <div className="imageList">

          {images.length > 0 && (
            <div className="imageItem">

              <img
                src={images[currentImage]}
                alt="Property"
              />

              {/* DELETE */}
              <button
                type="button"
                className="deleteImage"
                onClick={deleteCurrentImage}
              >
                ✕
              </button>

              {/* NAVIGATION */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="prevButton"
                    onClick={previousImage}
                  >
                    ❮
                  </button>

                  <button
                    type="button"
                    className="nextButton"
                    onClick={nextImage}
                  >
                    ❯
                  </button>

                  <div className="imageCounter">
                    {currentImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* UPLOAD BUTTON */}
        <div className="uploadContainer">
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