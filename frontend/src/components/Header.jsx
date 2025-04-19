import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import LocationSelector from "./Map/LocationSelector";
import SearchInp from "./Search";
import "../Styles/Header.css";
import { 
  UserCircle, 
  Menu, 
  X, 
  Settings, 
  LogOut, 
  Clock, 
  Heart, 
  Search,
  ChevronDown
} from "lucide-react";

// You would replace this with your actual logo import
import Logo from "../assets/logo1.png";

const Header = ({ isDashboard }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Set to true when user is logged in
  const userDropdownRef = useRef(null);
  
  // Handle click outside user dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleUserDropdown = () => setUserDropdownOpen((prev) => !prev);

  return (
    <header className={`main-header ${isDashboard ? "dashboard-header" : ""}`}>
      <div className="header-container">
        {/* Left Section - Logo and Name */}
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Medicare Logo" className="logo-image" />
            </Link>
          </div>
          <h1 className="header-title">NearbyMedi</h1>
          
          {!isDashboard && (
            <>
              <div className="line"></div>
              <nav className="header-nav">
                <ul className="nav-links">
                  <li>
                    <Link to="/">Home</Link>
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
              </nav>
            </>
          )}
          
          {isDashboard && (
            <div className="location-selector-container">
              <LocationSelector />
            </div>
          )}
        </div>
        
        {/* Center Section - Search Bar (only in dashboard) */}
        {isDashboard && (
          <div className="header-center">
            <SearchInp isDashboard={true} />
          </div>
        )}
        
        {/* Right Section - Auth/User Profile */}
        <div className="header-right">
          {isLoggedIn ? (
            <div className="user-profile-container" ref={userDropdownRef}>
              <button 
                className="user-profile-button" 
                onClick={toggleUserDropdown}
                aria-haspopup="true" 
                aria-expanded={userDropdownOpen}
              >
                <div className="user-avatar">
                  <UserCircle size={24} className="profile-icon" />
                </div>
                <span className="user-name">John Doe</span>
                <ChevronDown size={16} className={`dropdown-chevron ${userDropdownOpen ? 'rotate' : ''}`} />
              </button>
              
              {userDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <span className="user-email">john.doe@example.com</span>
                  </div>
                  <ul className="user-dropdown-menu">
                    <li>
                      <button className="dropdown-item">
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        <Clock size={16} />
                        <span>Search History</span>
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        <Heart size={16} />
                        <span>Saved Pharmacies</span>
                      </button>
                    </li>
                    <li className="divider"></li>
                    <li>
                      <button className="dropdown-item logout">
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="sign-in-btn">Sign In</button>
              <button className="sign-up-btn">Sign Up</button>
            </div>
          )}
          
          {/* Mobile Search Toggle (only in dashboard) */}
          {isDashboard && (
            <button className="mobile-search-toggle">
              <Search size={20} />
            </button>
          )}
          
          {/* Hamburger Menu Toggle */}
          <button
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Search Bar (only in dashboard) */}
      {isDashboard && (
        <div className="mobile-search-container">
          <SearchInp isDashboard={true} />
        </div>
      )}
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {isDashboard && (
            <div className="mobile-location-selector">
              <LocationSelector />
            </div>
          )}
          
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            {!isDashboard && (
              <>
                <li>
                  <a href="#about" onClick={toggleMenu}>About Us</a>
                </li>
                <li>
                  <a href="#how" onClick={toggleMenu}>How It Works</a>
                </li>
                <li>
                  <a href="#list-pharmacy" onClick={toggleMenu}>For Pharmacies</a>
                </li>
                <li>
                  <a href="#faq" onClick={toggleMenu}>FAQs</a>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li className="mobile-user-menu-item">
                  <Link to="/settings" onClick={toggleMenu}>
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </li>
                <li className="mobile-user-menu-item">
                  <Link to="/history" onClick={toggleMenu}>
                    <Clock size={18} />
                    <span>Search History</span>
                  </Link>
                </li>
                <li className="mobile-user-menu-item">
                  <Link to="/saved" onClick={toggleMenu}>
                    <Heart size={18} />
                    <span>Saved Pharmacies</span>
                  </Link>
                </li>
                <li className="mobile-user-menu-item logout">
                  <button onClick={toggleMenu}>
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </button>
                </li>
              </>
            )}
          </ul>
          
          {!isLoggedIn && (
            <div className="mobile-auth-buttons">
              <button className="sign-in-btn">Sign In</button>
              <button className="sign-up-btn">Sign Up</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
