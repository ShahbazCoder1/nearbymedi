import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Header.css';
import { UserCircle } from 'lucide-react';
import Logo from '../assets/logo1.png'; 

const Header = ({ isDashboard }) => {
  return (
    <header className={`main-header ${isDashboard ? 'dashboard-header' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              <img 
                src={Logo} 
                alt="Medicare Logo"
                className="logo-image"
              />
            </Link>
          </div>
          <h1 className="header-title">NearByMedi</h1>
          <div className="line"></div>
          <nav className={`header-nav ${isDashboard ? 'hidden' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#list-pharmacy">For Pharmacies</a></li>
              <li><a href="#faq">FAQs</a></li>
            </ul>
          </nav>
        </div>
        
        <div className="header-right">
          <button className="profile-button account-btn" aria-label="Account">
            <UserCircle size={22} className="profile-icon" />
            <span className="profile-text">Account</span>
          </button>
          
          <div className="auth-buttons">
            <button className="sign-in-btn">Sign In</button>
            <button className="sign-up-btn">Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;