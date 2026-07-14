import React, { useContext } from "react";
import "./homePage.scss";
import { SearchBar } from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      {/* HERO SECTION */}
      <div className="homePage">
        <div className="textContainer">
          <div className="wrapper">
            <h1 className="title">
              Find Real Estate & Get Your Dream Place
            </h1>

            <p>
              Discover verified properties, connect with owners,
              and find your perfect home easily.
            </p>

            <SearchBar />

            <div className="boxes">
              <div className="box">
                <h1>15+</h1>
                <h2>Years Experience</h2>
              </div>
              <div className="box">
                <h1>20+</h1>
                <h2>Awards</h2>
              </div>
              <div className="box">
                <h1>1500+</h1>
                <h2>Properties</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="imgContainer">
          <img src="/bg.png" alt="Real estate banner" />
        </div>
      </div>

      {/* FEATURED */}
      <section className="featured">
        <div className="container">
          <h2>Featured Properties</h2>
          <p>Explore the best listings available</p>

          <Link to="/list" className="btn">
            View All Properties →
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section className="why">
        <div className="container">
          <h2>Why Choose SuhasEstate</h2>

          <div className="features">
            <div className="feature">🔍 Easy Search</div>
            <div className="feature">📍 Verified Listings</div>
            <div className="feature">💬 Real-time Chat</div>
            <div className="feature">⚡ Fast Process</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Start Your Property Journey Today</h2>
          <p>Find, buy, or rent your perfect home with ease.</p>
          <Link to="/list" className="btn">
            Browse Properties
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footerContainer">
          <div className="col">
            <h3>SuhasEstate</h3>
            <p>Your trusted platform to buy, sell, and rent properties easily.</p>
          </div>

          <div className="col">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/list">Properties</Link>
            {currentUser ? (
              <Link to="/profile">Profile</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>

          <div className="col">
            <h3>Contact</h3>
            <p>Email: suhaskbbhavsar45@gmail.com</p>
            <p>Phone: +91 93708 50437</p>
          </div>
        </div>

        <div className="bottom">
          © 2026 SuhasEstate. All rights reserved.
        </div>
      </footer>
    </>
  );
};