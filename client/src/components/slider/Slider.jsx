import React, { useState } from "react";
import "./slider.scss";

export const Slider = ({ images }) => {
  const [imagesIndex, setImageIndex] = useState(null);

  // USE DEFAULT IMAGE IF PROPERTY HAS NO IMAGES
  const sliderImages =
    images?.length > 0
      ? images
      : ["/no-image.png"];

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (imagesIndex === 0) {
        setImageIndex(sliderImages.length - 1);
      } else {
        setImageIndex(imagesIndex - 1);
      }
    } else {
      if (imagesIndex === sliderImages.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imagesIndex + 1);
      }
    }
  };

  return (
    <div className="slider">
      {/* FULL SCREEN SLIDER */}
      {imagesIndex !== null && (
        <div className="fullSlider">
          <div className="arrow">
            <img
              src="/arrow.png"
              alt="Previous"
              onClick={() => changeSlide("left")}
            />
          </div>

          <div className="imgContainer">
            <img
              src={sliderImages[imagesIndex]}
              alt="Property"
            />
          </div>

          <div className="arrow">
            <img
              src="/arrow.png"
              className="right"
              alt="Next"
              onClick={() => changeSlide("right")}
            />
          </div>

          <div
            className="close"
            onClick={() => setImageIndex(null)}
          >
            X
          </div>
        </div>
      )}

      {/* BIG IMAGE */}
      <div className="bigImage">
        <img
          src={sliderImages[0]}
          alt="Property"
          onClick={() => setImageIndex(0)}
        />
      </div>

      {/* SMALL IMAGES */}
      <div className="smallImages">
        {sliderImages.slice(1, 4).map((image, index) => {
          const actualIndex = index + 1;
          const remainingImages = sliderImages.length - 4;
          const isLastThumbnail =
            index === 2 && remainingImages > 0;

          return (
            <div
              className="thumb"
              key={actualIndex}
              onClick={() => setImageIndex(actualIndex)}
            >
              <img
                src={image}
                alt={`Property ${actualIndex + 1}`}
              />

              {isLastThumbnail && (
                <div className="overlay">
                  +{remainingImages} More
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};