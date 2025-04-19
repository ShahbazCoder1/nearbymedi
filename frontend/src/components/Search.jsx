import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Pill } from "lucide-react";
import "../Styles/SearchBar.css";
import { supabase } from "../supabaseClient";

const placeholderTexts = ["Shampoo", "Medicines", "Healthcare", "Lab tests"];

const SearchInp = ({ isDashboard }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchWrapperRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch medicine suggestions from Supabase
  const fetchMedicineSuggestions = async (term) => {
    if (!term || term.length < 2) {
      setFilteredMedicines([]);
      return;
    }
    
    setIsLoading(true);
    try {
      try {
        const { data, error } = await supabase
          .from('medicine')
          .select('name')
          .textSearch('name', term, {
            config: 'english',
            type: 'websearch'
          })
          .limit(15);
        
        if (!error && data && data.length > 0) {
          setFilteredMedicines(data.map(item => item.name));
          setIsLoading(false);
          return;
        }
      } catch (textSearchError) {
        console.log('Text search not available or failed:', textSearchError);
      }
      
      // Fallback to ILIKE search
      const { data: ilikeData, error: ilikeError } = await supabase
        .from('medicine')
        .select('name')
        .or(
          `name.ilike.%${term}%,` +
          `name.ilike.${term}%,` + 
          `name.ilike.% ${term}%`
        )
        .order('name')
        .limit(15);
        
      if (!ilikeError && ilikeData) {
        setFilteredMedicines(ilikeData.map(item => item.name));
      } else {
        console.error('Error with ILIKE search:', ilikeError);
        setFilteredMedicines([]);
      }
    } catch (err) {
      console.error('Error in API call:', err);
      setFilteredMedicines([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get initial search term from location state (when redirected from landing page)
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
      // Trigger search with the query from the landing page
      fetchMedicineSuggestions(location.state.searchQuery);
    }
  }, [location.state]);

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

  // Effect to handle search term changes with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchMedicineSuggestions(searchTerm.trim());
      }, 400);
    } else {
      setFilteredMedicines([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // Update URL to reflect search but stay on dashboard
      navigate(`/dashboard`, { state: { searchQuery: searchTerm }, replace: true });
      
      // Perform the search (this will be handled by the useEffect that watches location.state)
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

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {isLoading ? (
            <div className="suggestion-item loading">Loading...</div>
          ) : filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine, index) => (
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
            ))
          ) : searchTerm.length > 1 ? (
            <div className="suggestion-item no-results">No medicines found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchInp;
