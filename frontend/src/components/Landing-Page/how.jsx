import React, { useEffect } from 'react';
import '../../Styles/How.css';
import { Search, MapPin, Navigation } from 'lucide-react';

const How = () => {
  useEffect(() => {
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-pop');
    animatedElements.forEach(el => observer.observe(el));
    
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="how" className="how-section">
      <div className="container">
        <div className="how-header animate-pop">
          <h2 className="how-title">
            Find Your Medicines with <span className="highlight">NearbyMedi</span>
          </h2>
          
          <p className="how-description">
            Quickly locate medicines at nearby pharmacies and get directions - all in one place.
          </p>
        </div>
        
        <div className="how-visual-container">
          <div className="step-item animate-pop">
            <div className="gif-container">
              {/* Replace with your actual search GIF */}
              <img 
                src="/images/search-medicine.gif" 
                alt="Searching for medicine" 
                className="step-gif"
              />
            </div>
            
            <div className="step-content">
              <div className="step-number">1</div>
              <h3>Search for Medicines</h3>
              <p>Enter the name of the medicine you need in our search bar.</p>
            </div>
          </div>
          
          <div className="step-item animate-pop">
            <div className="gif-container">
              {/* Replace with your actual pharmacy GIF */}
              <img 
                src="/images/nearby-pharmacies.gif" 
                alt="Finding nearby pharmacies" 
                className="step-gif"
              />
            </div>
            
            <div className="step-content">
              <div className="step-number">2</div>
              <h3>See Nearby Pharmacies</h3>
              <p>View pharmacies that have your medicines in stock.</p>
            </div>
          </div>
          
          <div className="step-item animate-pop">
            <div className="gif-container">
              {/* Replace with your actual directions GIF */}
              <img 
                src="/images/get-directions.gif" 
                alt="Getting directions to pharmacy" 
                className="step-gif"
              />
            </div>
            
            <div className="step-content">
              <div className="step-number">3</div>
              <h3>Get Directions</h3>
              <p>Navigate to your chosen pharmacy with turn-by-turn directions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default How;