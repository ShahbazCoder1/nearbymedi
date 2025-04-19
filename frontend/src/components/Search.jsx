import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Pill } from "lucide-react";
import "../Styles/SearchBar.css";

const medicines = [
  "Durex Extra Thin", "Manforce Long Time", "Spa Services", "Paracetamol",
  "Aspirin", "Ibuprofen", "Amoxicillin", "Omeprazole", "Metformin",
  "Lisinopril", "Amlodipine", "Metoprolol", "Simvastatin"
];

const placeholderTexts = ["Shampoo", "Medicines", "Healthcare", "Lab tests"];

const SearchInp= ({ isDashboard }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
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
      if (!isDashboard) {
        navigate('/dashboard', { state: { searchQuery: searchTerm } });
      }
    } else {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="search-wrapper" ref={searchWrapperRef}>
      <div className="search-input-container">
        <Search className="search-icon" size={20} color="#10a554" />
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
        />

        <button className="search-button" onClick={handleSearchClick}>
          {"Search"}
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
  );
};

export default SearchInp;
