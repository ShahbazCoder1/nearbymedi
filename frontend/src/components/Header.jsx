import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ChevronDown,
} from "lucide-react";
import Logo from "../assets/logo1.png";

const Header = ({ isDashboard }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`main-header ${isDashboard ? "dashboard-header" : ""}`}>
      <div className="header-container">
        {/* LEFT */}
        <div className="header-left">
          <Link to="/" className="logo">
            <img src={Logo} alt="NearbyMedi" className="logo-image" />
          </Link>
          <h1 className="header-title">NearbyMedi</h1>

          {!isDashboard && (
            <>
              <div className="line" />
              <nav className="header-nav">
                <ul className="nav-links">
                  {[
                    "Home",
                    "About Us",
                    "How It Works",
                    "For Pharmacies",
                    "FAQs",
                  ].map((txt) => (
                    <li key={txt}>
                      <a href={`#${txt.toLowerCase().replace(/\s+/g, "-")}`}>
                        {txt}
                      </a>
                    </li>
                  ))}
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

        {/* CENTER */}
        {isDashboard && (
          <div className="header-center">
            <SearchInp />
          </div>
        )}

        {/* RIGHT */}
        <div className="header-right">
          {isLoggedIn ? (
            <div className="user-profile-container" ref={userDropdownRef}>
              <button
                className="user-profile-button"
                onClick={() => setUserDropdownOpen((p) => !p)}
              >
                <UserCircle size={24} className="profile-icon" />
                <span className="user-name">John Doe</span>
                <ChevronDown
                  size={16}
                  className={`dropdown-chevron ${userDropdownOpen ? "rotate" : ""
                    }`}
                />
              </button>
              {userDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <span className="user-email">john.doe@example.com</span>
                  </div>
                  <ul className="user-dropdown-menu">
                    {[
                      ["Settings", Settings],
                      ["Search History", Clock],
                      ["Saved Pharmacies", Heart],
                    ].map(([label, Icon]) => (
                      <li key={label}>
                        <button className="dropdown-item">
                          <Icon size={16} />
                          <span>{label}</span>
                        </button>
                      </li>
                    ))}
                    <li className="divider" />
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
              <button
                className="sign-in-btn"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button
                className="sign-up-btn"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Search Toggle */}
          {isDashboard && (
            <button
              className="mobile-search-toggle"
              onClick={() => setSearchOpen((p) => !p)}
            >
              <Search size={20} />
            </button>
          )}

          {/* Hamburger Toggle */}
          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isDashboard && (
        <div className={`mobile-search-container ${searchOpen ? "open" : ""}`}>
          <SearchInp />
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {isDashboard && (
          <div className="mobile-location-selector">
            <LocationSelector />
          </div>
        )}
        <ul className="nav-links">
          {[
            "Home",
            ...(isDashboard
              ? []
              : ["About Us", "How It Works", "For Pharmacies", "FAQs"]),
          ].map((txt) => (
            <li key={txt}>
              <a
                href={`#${txt.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
              >
                {txt}
              </a>
            </li>
          ))}
        </ul>
        {!isLoggedIn && (
          <div className="mobile-auth-buttons">
            <button className="sign-in-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="sign-up-btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
