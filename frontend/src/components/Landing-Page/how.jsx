import React, { useEffect } from "react";
import "../../Styles/How.css";
import { Search, MapPin, Navigation } from "lucide-react";

import searchGif from "../../assets/GIF_20250420_125300_777.gif";
import pharmacyGif from "../../assets/GIF_20250420_125817_801.gif";
import directionsGif from "../../assets/GIF_20250420_125946_308.gif";


const How = () => {
  useEffect(() => {
    // Add intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(".animate-pop");
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="how" className="how-section">
      <div className="container">
        <div className="how-header animate-pop">
          <h2 className="how-title">
            Find Your Medicines with{" "}
            <span className="highlight">NearbyMedi</span>
          </h2>

          <p className="how-description">
            Quickly locate medicines at nearby pharmacies and get directions -
            all in one place.
          </p>
        </div>

        <div className="how-visual-container">
          <div className="step-item animate-pop">
            <div className="gif-container">
              {/* Using imported GIF */}
              <img
                src={searchGif}
                alt="Searching for medicine"
                className="step-gif"
              />
            </div>

            <div className="step-content">
              <div className="step-number">1</div>
              <h3>Search for Medicines</h3>
              <p>
                To find the medicine you need, simply type its name—either brand
                or generic—into the search bar. As you type, suggestions will
                appear to help you quickly select the right option. Click on
                your medicine from the list to view detailed information or
                availability.
              </p>
            </div>
          </div>

          <div className="step-item animate-pop">
            <div className="gif-container">
              {/* Using imported GIF */}
              <img
                src={pharmacyGif}
                alt="Finding nearby pharmacies"
                className="step-gif"
              />
            </div>

            <div className="step-content">
              <div className="step-number">2</div>
              <h3>See Nearby Pharmacies</h3>
              <p>
                Quickly find nearby pharmacies that have your medicines in stock
                by entering the medicine name and your location. This saves you
                time and helps you get what you need without hassle.
              </p>
            </div>
          </div>

          <div className="step-item animate-pop">
            <div className="gif-container">
              {/* Using imported GIF */}
              <img
                src={directionsGif}
                alt="Getting directions to pharmacy"
                className="step-gif"
              />
            </div>

            <div className="step-content">
              <div className="step-number">3</div>
              <h3>Get Directions</h3>
              <p>
                Get clear, turn-by-turn directions to your chosen pharmacy for a
                quick and hassle-free visit. Real-time navigation ensures you
                reach your destination easily and on time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default How;