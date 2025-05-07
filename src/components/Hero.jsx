import React from 'react';
import '../styles/Hero.css'; 

const Hero = () => {
    return (
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">Welcome to Our Store</h1>
              <p className="hero-subtitle">
                Discover top-quality products delivered to your door.
              </p>
              <button className="hero-button">Shop Now</button>
            </div>
          </div>
        </section>
      );
};

export default Hero;
