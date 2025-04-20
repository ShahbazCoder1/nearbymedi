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
          Find Medicines Near You, Fast
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
            NearByMedi is your smart solution for quickly finding the medicines you need at local pharmacies, right when you need them.
            </p>
            
            <div className="about-description">
              <p>
              Just enter the medicine name and your location (or let GPS do the work), and instantly see which nearby pharmacies have it in stock and are open. Skip the stress of calling around or visiting multiple stores—NearByMedi saves you time and brings peace of mind by connecting you to the right pharmacy, fast.
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