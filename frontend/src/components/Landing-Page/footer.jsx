import React from "react";
import "../../Styles/Footer.css";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <h2>
                  NearbyMedi
                </h2>
              </div>
              <p className="footer-description">
                Your trusted platform for finding medicines at nearby
                pharmacies. Making healthcare accessible, one search at a time.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">
                  <Facebook size={18} />
                </a>
                <a href="#" className="social-link">
                  <Twitter size={18} />
                </a>
                <a href="#" className="social-link">
                  <Instagram size={18} />
                </a>
                <a href="#" className="social-link">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#how">How It Works</a>
                </li>
                <li>
                  <a href="#list-pharmacy">For Pharmacies</a>
                </li>
                <li>
                  <a href="#faq">FAQs</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Contact Support</a>
                </li>
                <li>
                  <a href="#">Feedback</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} NearbyMedi. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
