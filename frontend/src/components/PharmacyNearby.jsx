import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/PharmacyNearby.css';
import { supabase } from "../supabaseClient";
import { 
  Pill, 
  MapPin, 
  Store,
  Star,
  CheckCircle2,
  Phone,
  Navigation,
  Clock,
  Info,
  AlertCircle,
  ChevronRight,
  Search,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const PharmacyNearby = ({ onPharmacySelect, selectedPharmacyId, userLocation }) => {
  const [sortOption, setSortOption] = useState('distance');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('nearby');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const location = useLocation();
  const containerRef = useRef(null);
  
  // Load data when component mounts or location state changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Get data from router state
        const searchQuery = location.state?.searchQuery;
        const statePharmacies = location.state?.nearbyPharmacies || [];
        
        // Track whether a search was performed
        setHasSearched(!!searchQuery);
        
        // If we have pharmacies data from state, use it
        if (statePharmacies.length > 0) {
          setPharmacies(statePharmacies);
        } else if (location.state?.coordinates) {
          // Otherwise fetch pharmacies from location state coordinates
          const { latitude, longitude } = location.state.coordinates;
          try {
            const response = await fetch(`https://wzrpmhhp-5000.inc1.devtunnels.ms/nearby-locations?lat=${latitude}&lon=${longitude}`, {
              mode: 'cors', // Try with explicit CORS mode
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (response.ok) {
              const pharmaciesData = await response.json();
              setPharmacies(pharmaciesData);
            } else {
              // If server doesn't support CORS, use fallback data
              setPharmacies(getFallbackPharmacies(latitude, longitude));
            }
          } catch (fetchError) {
            console.error('Error fetching pharmacies:', fetchError);
            // Use fallback data on error
            setPharmacies(getFallbackPharmacies(latitude, longitude));
          }
        } else if (userLocation?.coordinates) {
          // Or use userLocation coordinates if available
          const { latitude, longitude } = userLocation.coordinates;
          try {
            const response = await fetch(`https://wzrpmhhp-5000.inc1.devtunnels.ms/nearby-locations?lat=${latitude}&lon=${longitude}`, {
              mode: 'cors',
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (response.ok) {
              const pharmaciesData = await response.json();
              setPharmacies(pharmaciesData);
            } else {
              setPharmacies(getFallbackPharmacies(latitude, longitude));
            }
          } catch (fetchError) {
            console.error('Error fetching pharmacies:', fetchError);
            setPharmacies(getFallbackPharmacies(latitude, longitude));
          }
        } else {
          // No coordinates, use fallback data centered on a default location
          setPharmacies(getFallbackPharmacies(26.7282441, 88.4423456));
        }
        
        // Fetch medicine details from Supabase if we have a search query
        if (searchQuery) {
          const { data, error } = await supabase
            .from('medicine')
            .select('*')
            .ilike('name', `%${searchQuery}%`)
            .limit(1);
          
          if (error) {
            console.error('Error fetching medicine info:', error);
          } else if (data && data.length > 0) {
            const medicine = data[0];
            
            // Format medicine info from database columns
            setMedicineInfo({
              name: medicine.name || searchQuery,
              genericName: medicine.short_composition1 || 'N/A',
              manufacturer: medicine.manufacturer_name || 'N/A',
              form: medicine.type || 'N/A',
              strength: medicine.pack_size_label || 'N/A',
              price: medicine['price(₹)'] ? `₹${medicine['price(₹)']}` : 'N/A',
              description: 'Details about this medicine will be available soon.',
              isDiscontinued: medicine['Is_discontinued'] || false
            });
          } else {
            // Set default info if medicine not found
            setMedicineInfo({
              name: searchQuery,
              genericName: 'N/A',
              manufacturer: 'N/A',
              form: 'N/A',
              strength: 'N/A',
              price: 'N/A',
              description: 'No detailed information available for this medicine.',
              isDiscontinued: false
            });
          }
        } else {
          // No search query, no medicine info needed
          setMedicineInfo(null);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [location.state, userLocation]);

  // Function to generate fallback pharmacy data (when API fails)
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
        isOpen: Math.random() > 0.3,
        latitude: centerLat + latOffset,
        longitude: centerLng + lngOffset,
        rating: Math.floor(Math.random() * 5) + Math.random(),
        reviews: Math.floor(Math.random() * 20) + 5
      });
    }
    
    return pharmacies;
  };

  // Add scroll handler to automatically collapse header when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop;
        if (scrollPosition > 50 && !isHeaderCollapsed) {
          setIsHeaderCollapsed(true);
        } else if (scrollPosition <= 50 && isHeaderCollapsed) {
          setIsHeaderCollapsed(false);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isHeaderCollapsed]);

  const toggleHeader = () => {
    setIsHeaderCollapsed(!isHeaderCollapsed);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSelectPharmacy = (pharmacy) => {
    onPharmacySelect(pharmacy);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  // Sort pharmacies based on selected option
  const sortedPharmacies = [...pharmacies].sort((a, b) => {
    if (sortOption === 'distance') {
      // Extract numeric part of the distance for sorting
      const distA = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
      const distB = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
      return distA - distB;
    } else if (sortOption === 'rating') {
      return b.rating - a.rating;
    } else if (sortOption === 'availability') {
      return b.isOpen - a.isOpen;
    }
    return 0;
  });

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={14} fill="#f59e0b" color="#f59e0b" />);
    }
    
    if (halfStar) {
      stars.push(
        <span key="half" className="half-star-container">
          <Star size={14} fill="#f59e0b" color="#f59e0b" className="half-star" />
        </span>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} color="#f59e0b" />);
    }
    
    return stars;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="medicine-detail-container">
        <div className="medicine-header skeleton">
          <div className="skeleton-title" style={{width: '70%'}}></div>
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-details">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
        <div className="medicine-tabs skeleton-tabs">
          <div className="skeleton-tab"></div>
          <div className="skeleton-tab"></div>
          <div className="skeleton-tab"></div>
        </div>
        <div className="tab-content">
          {Array(2).fill().map((_, index) => (
            <div key={index} className="pharmacy-card skeleton">
              <div className="skeleton-header">
                <div className="skeleton-title"></div>
                <div className="skeleton-badge"></div>
              </div>
              <div className="skeleton-location"></div>
              <div className="skeleton-rating"></div>
              <div className="pharmacy-footer">
                <div className="skeleton-button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="medicine-detail-container" ref={containerRef}>
      {/* Medicine Header Information - Show only when medicine has been searched */}
      {medicineInfo && (
        <div className={`medicine-header ${isHeaderCollapsed ? 'collapsed' : ''}`}>
          <div className="header-content">
            <div className="medicine-main-info">
              <h2 className="medicine-name">{medicineInfo.name}</h2>
              <div className="medicine-pill-icon">
                <Pill size={20} color="#10a554" />
              </div>
            </div>
            {!isHeaderCollapsed && (
              <div className="medicine-secondary-info">
                <div className="info-row">
                  <span className="info-label">Generic:</span>
                  <span className="info-value">{medicineInfo.genericName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Form:</span>
                  <span className="info-value">{medicineInfo.form}{medicineInfo.strength ? ', ' + medicineInfo.strength : ''}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Price:</span>
                  <span className="info-value">{medicineInfo.price}</span>
                </div>
                {medicineInfo.isDiscontinued && (
                  <div className="info-row discontinued">
                    <span className="info-label warning">Status:</span>
                    <span className="info-value warning">Discontinued</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="collapse-toggle" onClick={toggleHeader} aria-label={isHeaderCollapsed ? "Expand header" : "Collapse header"}>
            {isHeaderCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      )}
      
      {/* Tabbed Interface - Only show tabs if there's a medicine search */}
      {medicineInfo ? (
        <div className="medicine-tabs">
          <div 
            className={`medicine-tab ${activeTab === 'nearby' ? 'active' : ''}`}
            onClick={() => switchTab('nearby')}
          >
            <Store size={16} className="tab-icon" />
            <span>Nearby Shops</span>
          </div>
          <div 
            className={`medicine-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => switchTab('details')}
          >
            <Info size={16} className="tab-icon" />
            <span>Details</span>
          </div>
          <div 
            className={`medicine-tab ${activeTab === 'alternatives' ? 'active' : ''}`}
            onClick={() => switchTab('alternatives')}
          >
            <Pill size={16} className="tab-icon" />
            <span>Alternatives</span>
          </div>
        </div>
      ) : (
        <div className="generic-pharmacy-header">
          <h2>Pharmacies Near You</h2>
        </div>
      )}
      
      {/* Tab Content */}
      <div className="tab-content">
        {/* If no medicine searched, or if in nearby tab with medicine */}
        {(!medicineInfo || activeTab === 'nearby') && (
          <div className="nearby-shops-tab">
            {medicineInfo && (
              <div className="tab-header">
                <h3>Pharmacies with {medicineInfo.name}</h3>
              </div>
            )}
            
            <div className="pharmacy-list">
              {sortedPharmacies.length > 0 ? (
                sortedPharmacies.map(pharmacy => (
                  <div 
                    key={pharmacy.id} 
                    className={`pharmacy-card ${selectedPharmacyId === pharmacy.id ? 'selected' : ''}`}
                    onClick={() => handleSelectPharmacy(pharmacy)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleSelectPharmacy(pharmacy)}
                  >
                    <div className="pharmacy-header">
                      <h3 className={`pharmacy-name ${selectedPharmacyId === pharmacy.id ? 'selected-name' : ''}`}>
                        {pharmacy.name}
                      </h3>
                      <div className="pharmacy-badges">
                        <span className={`status-badge ${pharmacy.isOpen ? 'open' : 'closed'}`}>
                          {pharmacy.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="pharmacy-location">
                      <MapPin size={14} className="location-icon" /> 
                      <span><strong>{pharmacy.distance}</strong> away · {pharmacy.address}</span>
                    </p>
                    
                    <div className="rating-container">
                      <div className="stars">
                        {renderStars(pharmacy.rating || 0)}
                      </div>
                      <span className="review-count">
                        {pharmacy.rating || 'No'} {pharmacy.reviews !== 'No reviews' ? `(${pharmacy.reviews} reviews)` : 'ratings yet'}
                      </span>
                    </div>
                    
                    <div className="pharmacy-footer">
                      <div className="action-buttons">
                        <button className="action-button directions-button" aria-label="Get directions"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`, '_blank');
                          }}
                        >
                          <Navigation size={14} />
                        </button>
                      </div>
                      <button className={`details-button ${selectedPharmacyId === pharmacy.id ? 'primary' : 'secondary'}`}>
                        {selectedPharmacyId === pharmacy.id ? (
                          <>
                            <CheckCircle2 size={14} className="button-icon" />
                            Selected
                          </>
                        ) : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Store size={40} className="empty-icon" />
                  <h3 className="empty-state-title">No pharmacies found</h3>
                  <p className="empty-state-desc">Try adjusting your search or location</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Details Tab - only visible when medicine is searched */}
        {medicineInfo && activeTab === 'details' && (
          <div className="details-tab">
            <div className="medicine-details-section">
              <h3>About {medicineInfo.name}</h3>
              <p className="medicine-description">{medicineInfo.description}</p>
              
              {/* Details content will be added by user later */}
            </div>
          </div>
        )}
        
        {/* Alternatives Tab - only visible when medicine is searched */}
        {medicineInfo && activeTab === 'alternatives' && (
          <div className="alternatives-tab">
            <h3>Alternative Medicines</h3>
            
            {/* Alternatives content will be added by user later */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyNearby;