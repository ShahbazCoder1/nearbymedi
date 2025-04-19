import React, { useState, useRef, useEffect } from 'react';
import { Star, Clock, Truck, MapPin, Filter, X, ChevronRight } from 'lucide-react';
import '../Styles/FilterTabBar.css';

const FilterTabBar = () => {
  const [activeFilter, setActiveFilter] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const tabsContainerRef = useRef(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowAllFilters(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleFilterClick = (filter) => {
    if (filter === 'more') {
      setShowMoreFilters(true);
    } else {
      setActiveFilter(activeFilter === filter ? '' : filter);
      // Add your filtering logic here
    }
  };
  
  const handleServiceToggle = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };
  
  const applyFilters = () => {
    console.log("Applying filters:", { selectedServices, priceRange });
    setShowMoreFilters(false);
  };
  
  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedServices([]);
  };
  
  const toggleAllFilters = () => {
    setShowAllFilters(!showAllFilters);
  };
  
  // Scroll tabs horizontally
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'right' ? 200 : -200;
      tabsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <>
      <div className="filter-tab-bar-container">
        <button 
          className="scroll-button scroll-left"
          onClick={() => scrollTabs('left')}
          aria-label="Scroll filters left"
        >
          <ChevronRight size={20} />
        </button>
        
        <div className="filter-tabs-wrapper" ref={tabsContainerRef}>
          <button 
            className={`filter-tab ${activeFilter === 'highest-rated' ? 'active' : ''}`}
            onClick={() => handleFilterClick('highest-rated')}
          >
            <Star size={16} className="tab-icon" />
            <span>Highest Rated</span>
          </button>
          
          <button 
            className={`filter-tab ${activeFilter === '24-7' ? 'active' : ''}`}
            onClick={() => handleFilterClick('24-7')}
          >
            <Clock size={16} className="tab-icon" />
            <span>24/7 Pharmacies</span>
          </button>
          
          <button 
            className={`filter-tab ${activeFilter === 'delivery' ? 'active' : ''}`}
            onClick={() => handleFilterClick('delivery')}
          >
            <Truck size={16} className="tab-icon" />
            <span>Home Delivery</span>
          </button>
          
          <button 
            className={`filter-tab ${activeFilter === 'nearby' ? 'active' : ''}`}
            onClick={() => handleFilterClick('nearby')}
          >
            <MapPin size={16} className="tab-icon" />
            <span>Within 1km</span>
          </button>
          
          <button 
            className={`filter-tab ${showMoreFilters ? 'active' : ''}`}
            onClick={() => handleFilterClick('more')}
          >
            <Filter size={16} className="tab-icon" />
            <span>More Filters</span>
          </button>
        </div>
        
        <button 
          className="scroll-button scroll-right"
          onClick={() => scrollTabs('right')}
          aria-label="Scroll filters right"
        >
          <ChevronRight size={20} />
        </button>
        
        <button 
          className="filters-toggle-button"
          onClick={toggleAllFilters}
          aria-label="Toggle filters view"
          aria-expanded={showAllFilters}
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>
      
      {showAllFilters && (
        <div className="filters-expanded-view">
          <div className="expanded-filters-header">
            <h3>Filters</h3>
            <button className="close-filters-btn" onClick={toggleAllFilters}>
              <X size={18} />
            </button>
          </div>
          <div className="expanded-filters-content">
            <button 
              className={`expanded-filter-item ${activeFilter === 'highest-rated' ? 'active' : ''}`}
              onClick={() => handleFilterClick('highest-rated')}
            >
              <Star size={16} className="filter-icon" />
              <span>Highest Rated</span>
            </button>
            
            <button 
              className={`expanded-filter-item ${activeFilter === '24-7' ? 'active' : ''}`}
              onClick={() => handleFilterClick('24-7')}
            >
              <Clock size={16} className="filter-icon" />
              <span>24/7 Pharmacies</span>
            </button>
            
            <button 
              className={`expanded-filter-item ${activeFilter === 'delivery' ? 'active' : ''}`}
              onClick={() => handleFilterClick('delivery')}
            >
              <Truck size={16} className="filter-icon" />
              <span>Home Delivery</span>
            </button>
            
            <button 
              className={`expanded-filter-item ${activeFilter === 'nearby' ? 'active' : ''}`}
              onClick={() => handleFilterClick('nearby')}
            >
              <MapPin size={16} className="filter-icon" />
              <span>Within 1km</span>
            </button>
            
            <button 
              className="expanded-filter-item more-filters"
              onClick={() => handleFilterClick('more')}
            >
              <Filter size={16} className="filter-icon" />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>
      )}
      
      {showMoreFilters && (
        <div className="filter-modal-backdrop">
          <div className="filter-modal">
            <div className="filter-modal-header">
              <h3>Additional Filters</h3>
              <button className="close-modal-btn" onClick={() => setShowMoreFilters(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="filter-modal-content">
              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range-slider">
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={priceRange[0]} 
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])} 
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} 
                  />
                  <div className="price-range-labels">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div className="filter-section">
                <h4>Pharmacy Services</h4>
                <div className="services-options">
                  {['Online Consultation', 'Prescription Refills', 'Lab Tests', 'Vaccine Services', 'Health Packages'].map(service => (
                    <label key={service} className="service-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedServices.includes(service)} 
                        onChange={() => handleServiceToggle(service)} 
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="filter-modal-footer">
              <button className="reset-filter-btn" onClick={resetFilters}>Reset</button>
              <button className="apply-filter-btn" onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterTabBar;