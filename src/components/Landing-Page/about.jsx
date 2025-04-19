import React from 'react';
import '../../Styles/About.css';
import { MapPin } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-header">
          <h2>
            About <span className="highlight">NearbyMedi</span>
          </h2>
          <p className="section-subheading">
            Your medicine finder platform
          </p>
        </div>

        <div className="about-card">
          <div className="about-image">
            <img
              src={"/images/pharmacy-location.jpg"}
              alt="Finding medicines at nearby pharmacies"
              className="main-image"
            />
          </div>
          
          <div className="about-content">
            <h3>What is NearbyMedi?</h3>
            
            <p className="intro-text">
              NearbyMedi helps you find medicines at nearby pharmacies based on your location.
            </p>
            
            <div className="about-description">
              <p>
                Simply enter a medicine name and your location (or use GPS), and we'll show you which 
                nearby pharmacies have the medicine in stock. No more calling around or visiting 
                multiple stores to find what you need.
              </p>
            </div>
            
            <div className="about-tagline">
              <MapPin size={24} className="tagline-icon" />
              <p>The fastest way to find medicines near you</p>
            </div>
            
            <div className="about-cta">
              <button className="cta-button">
                Find Medicines Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
