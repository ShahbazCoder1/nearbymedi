import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Star, Clock, Truck, ShieldCheck, MapPin,
  Navigation, Zap, Pill, Filter
} from "lucide-react";
import "../../Styles/SearchBar.css";
import { supabase } from "../../supabaseClient";

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
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchWrapperRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();


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
      
      // If not on dashboard page, redirect to dashboard with search query
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