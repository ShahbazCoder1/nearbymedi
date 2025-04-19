import React, { useState, useEffect, useRef } from 'react';
import '../Styles/PharmacyNearby.css';
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

const PharmacyNearby = ({ onPharmacySelect, selectedPharmacyId }) => {
  const [sortOption, setSortOption] = useState('distance');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('nearby');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const containerRef = useRef(null);
  
  // Medicine Information - This would come from props in a real application
  const medicineInfo = {
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    manufacturer: 'ABC Pharmaceuticals',
    form: 'Tablet',
    strength: '500mg',
    price: '₹125.00',
    description: 'Used for treating symptoms of pain and fever. It works by inhibiting the release of certain chemicals that cause fever and pain.',
    sideEffects: ['Nausea', 'Skin rash', 'Liver damage (with high doses)'],
    dosage: 'Adults: 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.',
    interactions: ['Warfarin', 'Alcohol', 'Liver medications']
  };
  
  // Alternative medicines
  const alternatives = [
    {
      id: 1,
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      form: 'Tablet',
      strength: '200mg',
      price: '₹80.00',
      manufacturer: 'XYZ Pharma',
      differentiation: 'Anti-inflammatory properties, good for muscle pain'
    },
    {
      id: 2,
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      form: 'Tablet',
      strength: '300mg',
      price: '₹95.00',
      manufacturer: 'MediCare Ltd',
      differentiation: 'Blood thinning properties, also reduces inflammation'
    },
    {
      id: 3,
      name: 'Naproxen Sodium',
      genericName: 'Naproxen',
      form: 'Tablet',
      strength: '220mg',
      price: '₹110.00',
      manufacturer: 'Health Pharma',
      differentiation: 'Longer lasting relief, up to 12 hours'
    }
  ];

  // Simulate loading state for a better UX
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

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

  // Enhanced pharmacy data with more details
  const pharmacies = [
    {
      id: 1,
      name: 'HealthPlus Pharmacy',
      isOpen: true,
      distance: '15m',
      address: '123 Main Street, Downtown',
      rating: 4.5,
      reviews: 120,
      phone: '080-1234-5678',
      hasDelivery: true,
      is24Hours: false,
      coords: [77.61748476788898, 12.932423492103944],
      medicineAvailability: {
        inStock: true,
        stockLevel: 'High',
        price: '₹125.00'
      }
    },
    {
      id: 2,
      name: 'City Medical Store',
      isOpen: true,
      distance: '25m',
      address: '456 Oak Avenue, Midtown',
      rating: 4.0,
      reviews: 85,
      phone: '080-2345-6789',
      hasDelivery: true,
      is24Hours: true,
      coords: [77.61548476788898, 12.930423492103944],
      medicineAvailability: {
        inStock: true,
        stockLevel: 'Medium',
        price: '₹130.00'
      }
    },
    {
      id: 3,
      name: 'MediCare Pharmacy',
      isOpen: true,
      distance: '30m',
      address: '789 Pine Road, Central District',
      rating: 3.5,
      reviews: 62,
      phone: '080-3456-7890',
      hasDelivery: false,
      is24Hours: false,
      coords: [77.61848476788898, 12.929423492103944],
      medicineAvailability: {
        inStock: true,
        stockLevel: 'Low',
        price: '₹120.00'
      }
    },
    {
      id: 4,
      name: 'Wellness Drugstore',
      isOpen: true,
      distance: '35m',
      address: '101 Elm Street, West Block',
      rating: 4.0,
      reviews: 95,
      phone: '080-4567-8901',
      hasDelivery: true,
      is24Hours: false,
      coords: [77.61448476788898, 12.933423492103944],
      medicineAvailability: {
        inStock: true,
        stockLevel: 'High',
        price: '₹122.00'
      }
    },
    {
      id: 5,
      name: 'Family Pharmacy',
      isOpen: false,
      distance: '45m',
      address: '222 Cedar Lane, Northside',
      rating: 4.9,
      reviews: 150,
      phone: '080-5678-9012',
      hasDelivery: true,
      is24Hours: false,
      coords: [77.61948476788898, 12.928423492103944],
      medicineAvailability: {
        inStock: false,
        stockLevel: 'Out of Stock',
        price: '₹128.00'
      }
    }
  ];

  // Sort pharmacies based on selected option
  const sortedPharmacies = [...pharmacies].sort((a, b) => {
    if (sortOption === 'distance') {
      return parseInt(a.distance) - parseInt(b.distance);
    } else if (sortOption === 'rating') {
      return b.rating - a.rating;
    } else if (sortOption === 'availability') {
      return b.isOpen - a.isOpen;
    } else if (sortOption === 'price') {
      if (!a.medicineAvailability.inStock) return 1;
      if (!b.medicineAvailability.inStock) return -1;
      return parseFloat(a.medicineAvailability.price.replace('₹', '')) - parseFloat(b.medicineAvailability.price.replace('₹', ''));
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

  // Handle searching for alternative medicine
  const handleSearchAlternative = (medicineName) => {
    console.log(`Searching for ${medicineName} at nearby pharmacies`);
    // In a real app, this would trigger a new search or switch to the medicine
    alert(`Searching for ${medicineName} at nearby pharmacies...`);
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
      {/* Medicine Header Information */}
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
                <span className="info-value">{medicineInfo.form}, {medicineInfo.strength}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Price:</span>
                <span className="info-value">{medicineInfo.price}</span>
              </div>
            </div>
          )}
        </div>
        <button className="collapse-toggle" onClick={toggleHeader} aria-label={isHeaderCollapsed ? "Expand header" : "Collapse header"}>
          {isHeaderCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      
      {/* Tabbed Interface */}
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
      
      {/* Tab Content */}
      <div className="tab-content">
        {/* Nearby Shops Tab */}
        {activeTab === 'nearby' && (
          <div className="nearby-shops-tab">
            <div className="tab-header">
              <h3>Pharmacies with {medicineInfo.name}</h3>
            </div>
            
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
                        {pharmacy.is24Hours && (
                          <span className="feature-badge twenty-four">
                            <Clock size={12} /> 24/7
                          </span>
                        )}
                        {pharmacy.hasDelivery && (
                          <span className="feature-badge delivery">
                            Delivery
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="pharmacy-location">
                      <MapPin size={14} className="location-icon" /> 
                      <span><strong>{pharmacy.distance}</strong> away · {pharmacy.address}</span>
                    </p>
                    
                    <div className="rating-container">
                      <div className="stars">
                        {renderStars(pharmacy.rating)}
                      </div>
                      <span className="review-count">{pharmacy.rating} ({pharmacy.reviews} reviews)</span>
                    </div>
                    
                    <div className="medicine-info">
                      <div className={`medicine-availability ${!pharmacy.medicineAvailability.inStock ? 'out-of-stock' : pharmacy.medicineAvailability.stockLevel.toLowerCase()}`}>
                        {pharmacy.medicineAvailability.inStock ? (
                          <>
                            <CheckCircle2 size={14} className="availability-icon" />
                            <span>{pharmacy.medicineAvailability.stockLevel} Stock · {pharmacy.medicineAvailability.price}</span>
                          </>
                        ) : (
                          <>
                            <span className="out-of-stock-text">Out of Stock</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="pharmacy-footer">
                      <div className="action-buttons">
                        <button className="action-button call-button" aria-label="Call pharmacy">
                          <Phone size={14} />
                        </button>
                        <button className="action-button directions-button" aria-label="Get directions">
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
        
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="medicine-details-section">
              <h3>About {medicineInfo.name}</h3>
              <p className="medicine-description">{medicineInfo.description}</p>
              
              <div className="details-grid">
                <div className="details-card">
                  <h4>Dosage</h4>
                  <p>{medicineInfo.dosage}</p>
                </div>
                
                <div className="details-card">
                  <h4>Manufacturer</h4>
                  <p>{medicineInfo.manufacturer}</p>
                </div>
              </div>
              
              <div className="details-section">
                <h4>Side Effects</h4>
                <ul className="side-effects-list">
                  {medicineInfo.sideEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>
              
              <div className="details-section">
                <h4>Potential Interactions</h4>
                <p>May interact with the following:</p>
                <ul className="interactions-list">
                  {medicineInfo.interactions.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </div>
              
              <div className="disclaimer">
                <AlertCircle size={16} className="disclaimer-icon" />
                <p>This information is not intended as a substitute for professional medical advice. Always consult with your doctor or pharmacist.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Alternatives Tab */}
        {activeTab === 'alternatives' && (
          <div className="alternatives-tab">
            <h3>Alternative Medicines</h3>
            <p className="alternatives-intro">These medications may serve as alternatives to {medicineInfo.name}:</p>
            
            <div className="alternatives-list">
              {alternatives.map((alt) => (
                <div key={alt.id} className="alternative-card">
                  <div className="alternative-header">
                    <h4>{alt.name} <span className="alternative-generic">({alt.genericName})</span></h4>
                    <span className="alternative-price">{alt.price}</span>
                  </div>
                  
                  <div className="alternative-details">
                    <p className="alternative-form">{alt.form}, {alt.strength}</p>
                    <p className="alternative-manufacturer">{alt.manufacturer}</p>
                    <p className="alternative-differentiation">{alt.differentiation}</p>
                  </div>
                  
                  <div className="alternative-action">
                    <button 
                      className="search-alternative-btn" 
                      onClick={() => handleSearchAlternative(alt.name)}
                    >
                      <Search size={14} className="search-icon" />
                      Find Nearby
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="alternatives-disclaimer">
              <AlertCircle size={18} className="disclaimer-icon" />
              <div className="disclaimer-text">
                <strong>Important Note:</strong> The alternatives listed are suggestions based on similar therapeutic effects. Please consult with a healthcare professional before switching medications. Self-medication can be risky and each medicine may have different side effects or interactions.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyNearby;