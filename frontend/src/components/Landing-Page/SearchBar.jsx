import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Star, Clock, Truck, ShieldCheck, MapPin,
  Navigation, Zap, Pill, Filter
} from "lucide-react";
import "../../Styles/SearchBar.css";

const medicines = [
  "Durex Extra Thin",
  "Manforce Long Time",
  "Spa Services",
  "Paracetamol",
  "Aspirin",
  "Ibuprofen",
  "Amoxicillin",
  "Omeprazole",
  "Metformin",
  "Lisinopril",
  "Amlodipine",
  "Metoprolol",
  "Simvastatin",
];

const placeholderTexts = [
  "Shampoo",
  "Medicines",
  "Healthcare",
  "Lab tests",
];

const SearchBar = ({ isDashboard }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);
  const searchWrapperRef = useRef(null);
  const navigate = useNavigate();

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % placeholderTexts.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      
      // If not on dashboard page, redirect to dashboard
      if (!isDashboard) {
        navigate('/dashboard', { state: { searchQuery: searchTerm } });
      }
      // If already on dashboard, just perform search (which is handled by the console.log above)
    } else {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleFilterClick = (filter) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
      console.log(`Filter applied: ${filter}`);
    }
  };

  return (
    <div className="search-container">
      <div className="search-container-inner">
        <h1 className="header-text">Find Medicines Available Nearby</h1>
        <p className="header-subtitle">Search for medicines and see which stores have them in stock within 5km</p>

        <div className="search-wrapper" ref={searchWrapperRef}>
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            {searchTerm === "" && (
              <div className="animated-placeholder-input">
                <span className="static-text">Search for</span>
                <span className="animated-text">
                  {placeholderTexts[currentPlaceholderIndex]}
                </span>
              </div>
            )}

            <input
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              aria-label="Search for medicines and healthcare items"
            />

            <button className="search-button" onClick={handleSearchClick}>
              {isDashboard ? "Search" : "Find Medicines"}
            </button>
          </div>

          {showSuggestions && filteredMedicines.length > 0 && (
            <div className="suggestions-dropdown">
              {filteredMedicines.map((medicine, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchTerm(medicine);
                    setShowSuggestions(false);
                  }}
                >
                  <Pill size={14} style={{ marginRight: '10px', opacity: 0.6 }} />
                  {medicine}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="quick-filters-container">
          <div className="filters-header">
            <span>Quick Filters:</span>
          </div>
          <div className="quick-filters">
            <button 
              className={`filter-pill ${activeFilter === 'highest-rated' ? 'active' : ''}`}
              onClick={() => handleFilterClick('highest-rated')}
            >
              <Star size={14} className="filter-icon" />
              <span>Highest Rated</span>
            </button>
            <button 
              className={`filter-pill ${activeFilter === '24-7' ? 'active' : ''}`}
              onClick={() => handleFilterClick('24-7')}
            >
              <Clock size={14} className="filter-icon" />
              <span>24/7 Pharmacies</span>
            </button>
            <button 
              className={`filter-pill ${activeFilter === 'delivery' ? 'active' : ''}`}
              onClick={() => handleFilterClick('delivery')}
            >
              <Truck size={14} className="filter-icon" />
              <span>Home Delivery</span>
            </button>
            <button 
              className={`filter-pill ${activeFilter === 'nearby' ? 'active' : ''}`}
              onClick={() => handleFilterClick('nearby')}
            >
              <MapPin size={14} className="filter-icon" />
              <span>Within 1km</span>
            </button>
            <button 
              className={`filter-pill more-filters ${activeFilter === 'more' ? 'active' : ''}`}
              onClick={() => handleFilterClick('more')}
            >
              <Filter size={14} className="filter-icon" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;