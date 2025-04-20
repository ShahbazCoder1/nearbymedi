import React, { useState, useEffect, useCallback } from 'react';
import '../../Styles/LocationSelector.css';
import { 
  MapPin, 
  ChevronDown, 
  Search, 
  XCircle, 
  X,  
  CheckCircle,
  Navigation
} from 'lucide-react';

const LocationSelector = ({ onLocationChange }) => {
  const [location, setLocation] = useState({
    city: 'Loading...',
    address: '',
    coordinates: null // Add coordinates to state
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const dropdownRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const API_KEY = "1mv3hwNvE0s877rPETNBLQQ8huZcjUjktn5sQa4S";
  
  useEffect(() => {
    getCurrentLocation();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isDropdownOpen]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Store coordinates
            const coordinates = { latitude, longitude };
            
            const response = await fetch(
              `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${API_KEY}`,
              {
                headers: {
                  'X-Request-Id': `medicare-${Date.now()}`
                }
              }
            );
            
            const data = await response.json();
            
            if (data.status === 'ok' && data.results && data.results.length > 0) {
              const result = data.results[0];
              
              const stateComponent = result.address_components.find(comp => 
                comp.types.includes('administrative_area_level_1')
              );
              
              const districtComponent = result.address_components.find(comp => 
                comp.types.includes('administrative_area_level_2')
              );
              
              const cityName = districtComponent?.long_name || stateComponent?.long_name || 'Unknown location';
              
              const newLocation = {
                city: cityName,
                address: result.formatted_address,
                coordinates: coordinates
              };
              
              setLocation(newLocation);
              
              // Notify parent components of the location change
              if (onLocationChange) {
                onLocationChange(newLocation);
              }
            } else {
              throw new Error('Invalid response from Ola Maps API');
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            setLocation({
              city: 'Location unavailable',
              address: '',
              coordinates: null
            });
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocation({
            city: 'Location access denied',
            address: '',
            coordinates: null
          });
          setIsLoading(false);
        }
      );
    } else {
      setLocation({
        city: 'Geolocation not supported',
        address: '',
        coordinates: null
      });
      setIsLoading(false);
    }
  };

  const searchLocations = useCallback(async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(query)}&api_key=${API_KEY}`,
        {
          headers: {
            'X-Request-Id': `medicare-search-${Date.now()}`
          }
        }
      );
      
      const data = await response.json();
      
      if (data.status === 'ok' && data.predictions && data.predictions.length > 0) {
        const formattedResults = data.predictions.map(prediction => {
          const locationTerms = prediction.terms || [];
          const mainLocation = prediction.structured_formatting?.main_text || '';
          
          return {
            display_name: prediction.description,
            main_text: prediction.structured_formatting?.main_text || '',
            secondary_text: prediction.structured_formatting?.secondary_text || '',
            address: {
              city: locationTerms.length > 0 ? locationTerms[0].value : mainLocation,
              full: prediction.description
            },
            lat: prediction.geometry?.location?.lat,
            lon: prediction.geometry?.location?.lng,
            place_id: prediction.place_id
          };
        });
        
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    }
  }, [API_KEY]);

  const handleManualAddressChange = (e) => {
    const value = e.target.value;
    setManualAddress(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeoutId = setTimeout(() => {
      searchLocations(value);
    }, 300);
    
    setSearchTimeout(timeoutId);
  };

  const selectLocation = (result) => {
    const cityName = result.main_text || result.address?.city || result.display_name.split(',')[0];
    
    // Create a new location object including coordinates if available
    const newLocation = {
      city: cityName,
      address: result.display_name,
      coordinates: result.lat && result.lon ? { latitude: result.lat, longitude: result.lon } : null
    };
    
    setLocation(newLocation);
    setManualAddress(result.display_name);
    setSearchResults([]);
    setIsDropdownOpen(false);
    
    // Notify parent components of the location change
    if (onLocationChange) {
      onLocationChange(newLocation);
    }
  };

  const handleManualSubmit = () => {
    if (manualAddress.trim()) {
      const cityPart = manualAddress.split(',')[0];
      setLocation({
        city: cityPart || manualAddress,
        address: manualAddress,
        coordinates: null
      });
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setSearchResults([]);
      setManualAddress('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="location-selector" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <div className="location-display" onClick={toggleDropdown} role="button" tabIndex={0} aria-expanded={isDropdownOpen}>
        <div className="location-icon">
          <MapPin size={18} color="#10a554" />
        </div>
        <div className="current-location">
          <span className="location-label">Your Location</span>
          <span className="location-value">{location.city}</span>
        </div>
        <div className={`dropdown-arrow ${isDropdownOpen ? 'dropdown-arrow-rotate' : ''}`}>
          <ChevronDown size={16} />
        </div>
      </div>

      {isDropdownOpen && (
        <div className="location-dropdown-container">
          <div className="location-dropdown">
            <div className="dropdown-header">
              <h4>Choose your location</h4>
              <button className="close-button" onClick={() => setIsDropdownOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            
            <div className="dropdown-content">
              <div className="location-options location-methods">
                <div 
                  className="option-card gps-option" 
                  onClick={getCurrentLocation}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && getCurrentLocation()}
                >
                  <div className="option-icon">
                    <Navigation size={18} />
                  </div>
                  <div className="option-text">
                    <span className="option-title">{isLoading ? 'Detecting location...' : 'Use current location'}</span>
                    <span className="option-subtitle">Quickly detect your current location using GPS</span>
                  </div>
                  {isLoading && <div className="loading-spinner"></div>}
                </div>
                
                <div className="option-separator">
                  <span>OR</span>
                </div>
              </div>
              
              <div className="search-section">
                <h5>Search for a location</h5>
                <div className="location-search">
                  <div className="search-icon">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your address, area, or postal code"
                    value={manualAddress}
                    onChange={handleManualAddressChange}
                    ref={inputRef}
                    aria-label="Search location"
                  />
                  {manualAddress && (
                    <button 
                      className="clear-input" 
                      onClick={() => {
                        setManualAddress('');
                        setSearchResults([]);
                        inputRef.current.focus();
                      }}
                      aria-label="Clear input"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map((result, index) => (
                        <div 
                          key={index} 
                          className="search-result-item"
                          onClick={() => selectLocation(result)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => e.key === 'Enter' && selectLocation(result)}
                        >
                          <div className="result-icon">
                            <MapPin size={18} />
                          </div>
                          <div className="result-content">
                            <div className="result-main">{result.main_text || result.display_name.split(',')[0]}</div>
                            <div className="result-details">{result.secondary_text || result.display_name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {location.address && !isLoading && (
                <div className="current-selected-location">
                  <h5>Current selected location</h5>
                  <div className="selected-location-card">
                    <div className="selected-location-icon">
                      <CheckCircle size={18} />
                    </div>
                    <div className="selected-location-text">
                      <span className="selected-location-title">{location.city}</span>
                      <span className="selected-location-address">{location.address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;