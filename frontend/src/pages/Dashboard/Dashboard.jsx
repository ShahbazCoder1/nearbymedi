import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import PharmacyNearby from '../../components/PharmacyNearby';
import Map from '../../components/Map/map';
import FilterTabBar from '../../components/FilterTabBar';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const location = useLocation();

  // Reset selected pharmacy when location state changes
  useEffect(() => {
    setSelectedPharmacyId(null);
  }, [location.state]);

  // Handle location change from Header -> LocationSelector
  const handleLocationChange = (location) => {
    setUserLocation(location);
  };

  // Handle pharmacy selection from the list
  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacyId(pharmacy.id);
  };

  // Handle pharmacy marker selection from the map
  const handleMarkerSelect = (pharmacy) => {
    setSelectedPharmacyId(pharmacy.id);
  };

  // Update pharmacies list when new data is fetched
  const handlePharmaciesUpdate = (newPharmacies) => {
    setPharmacies(newPharmacies);
  };

  return (
    <div className="dashboard">
      <Header 
        isDashboard={true} 
        onLocationChange={handleLocationChange} 
      />
      <FilterTabBar />
      <div className="content-container">
        <div className="top-section">
          <div className="medicine-panel">
            <PharmacyNearby 
              onPharmacySelect={handlePharmacySelect}
              selectedPharmacyId={selectedPharmacyId}
              userLocation={userLocation}
              onPharmaciesUpdate={handlePharmaciesUpdate}
            />
          </div>
          <div className="map-container">
            <Map 
              selectedPharmacyId={selectedPharmacyId}
              setMapInstance={setMapInstance}
              onMarkerSelect={handleMarkerSelect}
              userLocation={userLocation}
              pharmacies={pharmacies}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
