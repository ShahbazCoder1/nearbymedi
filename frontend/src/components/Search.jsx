import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Pill } from "lucide-react";
import "../Styles/SearchBar.css";
import { supabase } from "../supabaseClient";

const placeholderTexts = ["Shampoo", "Medicines", "Healthcare", "Lab tests"];

const SearchInp = ({ isDashboard, userLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
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

  // Function to fetch nearby pharmacies
  const fetchNearbyPharmacies = async (latitude, longitude) => {
    try {
      // First try with the API
      try {
        const response = await fetch(
          `https://nearbymedi.onrender.com/nearby-locations?lat=${latitude}&lon=${longitude}`, 
          {
            mode: 'cors', // Try with explicit CORS mode
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (apiError) {
        console.error("Error fetching nearby pharmacies:", apiError);
      }
      
      // If API fails due to CORS, return fallback data
      return getFallbackPharmacies(latitude, longitude);
    } catch (error) {
      console.error("Error fetching nearby pharmacies:", error);
      return [];
    }
  };

  // Function to generate fallback pharmacy data
  const getFallbackPharmacies = (centerLat, centerLng) => {
    // Generate random pharmacies around the provided coordinates
    const pharmacies = [];
    const pharmacyNames = [
      "HealthPlus Pharmacy", "City Medical Store", "MediCare Pharmacy",
      "Wellness Drugstore", "Family Pharmacy", "QuickMeds", "Care Chemist",
      "LifeLine Drugs", "Central Pharmacy", "Apollo Pharmacy"
    ];
    
    for (let i = 0; i < 5; i++) {
      // Generate random offsets for lat/lng (within about 2km)
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      
      // Calculate distance in km (approximate)
      const distance = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset) * 111.32;
      
      pharmacies.push({
        id: i + 1,
        name: pharmacyNames[i],
        address: "123 Main St, Local Area",
        distance: `${distance.toFixed(2)}km`,
        isOpen: Math.random() > 0.3, // 70% chance of being open
        latitude: centerLat + latOffset,
        longitude: centerLng + lngOffset,
        rating: Math.floor(Math.random() * 5) + Math.random(),
        reviews: Math.floor(Math.random() * 20) + 5
      });
    }
    
    return pharmacies;
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

  // Effect to update when user location changes
  useEffect(() => {
    // If user location is available, preload nearby pharmacies
    if (userLocation?.coordinates) {
      const { latitude, longitude } = userLocation.coordinates;
      fetchNearbyPharmacies(latitude, longitude)
        .then(data => {
          setNearbyPharmacies(data);
        });
    }
  }, [userLocation]);

  const handleSearchClick = async () => {
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);

      // Check if we have user location coordinates
      let coords = userLocation?.coordinates;
      
      // If no coordinates yet, try to get them
      if (!coords && navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (error) {
          console.error("Could not get user location:", error);
        }
      }
      
      // If we have coordinates, fetch nearby pharmacies
      let pharmaciesData = [];
      if (coords) {
        pharmaciesData = await fetchNearbyPharmacies(coords.latitude, coords.longitude);
        setNearbyPharmacies(pharmaciesData);
      }
      
      // Navigate to dashboard with both search term and pharmacy data
      navigate(`/dashboard`, { 
        state: { 
          searchQuery: searchTerm,
          nearbyPharmacies: pharmaciesData,
          coordinates: coords
        },
        replace: true 
      });
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
