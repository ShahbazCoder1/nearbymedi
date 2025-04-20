import React, { useEffect } from 'react';
import '../../Styles/pharmaListing.css';
import { Users, ChevronRight, Activity, Users2, BarChart3 } from 'lucide-react';
import dash from "../../assets/dash.png";

const PharmacyListing = () => {
  useEffect(() => {
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    // Observe all elements with reveal class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
    
    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="list-pharmacy" className="pharmacy-section">
      <div className="overlay"></div>
      <div className="pharmacy-content">
        <div className="pharmacy-text">
          <div className="pharmacy-header reveal">
            <Users size={28} className="pharmacy-icon" />
            <span className="pharmacy-label">Partner With Us</span>
          </div>
          <h2 className="pharmacy-title reveal">Growing Your Pharmacy Business Made Simple</h2>
          <p className="pharmacy-subtitle reveal">
          Join our trusted network of pharmacies and expand your customer base effortlessly. NearByMedi helps you showcase your available medicines, store location, and real-time open/closed status—making it easy for patients nearby to find exactly what they need.
          </p>
          
          <div className="benefits-container reveal">
            <div className="benefit-item">
              <Activity className="benefit-icon" size={22} />
              <div className="benefit-text">
                <h4>Real-Time Stock Visibility</h4>
                <p>Keep your medicine availability updated to ensure customers see what’s in stock. Regular updates build trust and help patients find their medicines reliably.</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <Users2 className="benefit-icon" size={22} />
              <div className="benefit-text">
                <h4>Store Location & Status</h4>
                <p>Show your pharmacy’s location and real-time open/closed status to help customers find you easily and plan their visits. Clear, up-to-date info boosts convenience, trust, and satisfaction.</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <BarChart3 className="benefit-icon" size={22} />
              <div className="benefit-text">
                <h4>Easy Inventory Management</h4>
                <p>Quickly add, update, or upload your medicine inventory with ease using Excel. Manage your listings accurately and save time effortlessly.</p>
              </div>
            </div>
          </div>
          
          <div className="cta-container reveal">
            <a href="#" className="pharmacy-cta primary-cta">
              List Your Pharmacy <ChevronRight size={18} className="cta-icon" />
            </a>
            <a href="#" className="pharmacy-cta secondary-cta">
              Learn More
            </a>
          </div>
        </div>
        
        <div className="pharmacy-visuals">
          <div className="pharmacy-image-container reveal">
            <div className="image-border"></div>
            <img 
              src={dash} 
              alt="Pharmacy dashboard" 
              className="pharmacy-visual"
            />
            <div className="pharmacy-badge">
              <span className="badge-number">1000+</span>
              <span className="badge-text">Pharmacies Registered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PharmacyListing;