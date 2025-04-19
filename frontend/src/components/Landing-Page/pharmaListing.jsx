import React, { useEffect } from 'react';
import '../../Styles/pharmaListing.css';
import { Users, ChevronRight, Activity, Users2, BarChart3 } from 'lucide-react';

const PharmacyListing = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

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
            Join our network of trusted pharmacies and expand your customer base. 
            Our platform helps you manage inventory, connect with patients, 
            and increase your business visibility—all in real-time.
          </p>
          
          <div className="benefits-container reveal">
            <div className="benefit-item">
              <Activity className="benefit-icon" size={22} />
              <div className="benefit-text">
                <h4>Real-time Inventory</h4>
                <p>Update stock levels instantly and automatically</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <Users2 className="benefit-icon" size={22} />
              <div className="benefit-text">
                <h4>Customer Connection</h4>
                <p>Reach patients searching for available medicines</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <BarChart3 className="benefit-icon" size={22} />
              <div className="benefit-text">
                <h4>Analytics Dashboard</h4>
                <p>Track performance with powerful business insights</p>
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
              src="../../assets/pharmacy-dashboard.png" 
              alt="Pharmacy dashboard" 
              className="pharmacy-visual"
            />
            <div className="pharmacy-badge">
              <span className="badge-number">500+</span>
              <span className="badge-text">Pharmacies Registered</span>
            </div>
          </div>
          
          <div className="testimonial-container reveal">
            <div className="testimonial">
              <div className="quote">"Our pharmacy saw a 30% increase in new customers within just three months of joining the platform."</div>
              <div className="author">— Sarah Chen, PharmaCare Plus</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PharmacyListing;