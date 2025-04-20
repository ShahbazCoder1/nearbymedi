import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import PharmacyNearby from '../../components/PharmacyNearby';
import Map from '../../components/Map/map';
import FilterTabBar from '../../components/FilterTabBar';
import './Dashboard.css';
import { supabase } from '../../supabaseClient';

const Dashboard = () => {
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in and get profile data
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Get user type from session storage or database
        const userType = sessionStorage.getItem('userType');
        
        // If there's no user type in session storage, try to get it from Supabase auth metadata
        if (!userType) {
          const { data: userData } = await supabase.auth.getUser();
          const metadataUserType = userData?.user?.user_metadata?.user_type;
          
          if (metadataUserType === 'shop') {
            // If user is a shop owner according to metadata, redirect to shop dashboard
            navigate('/shop-dashboard');
            return;
          }
        } else if (userType === 'shop') {
          // If user type from session storage indicates shop owner, redirect
          navigate('/shop-dashboard');
          return;
        }
        
        // Set user profile for regular users
        setUserProfile({
          name: sessionStorage.getItem('userName') || data.session.user.email.split('@')[0] || 'User',
          id: sessionStorage.getItem('userId') || data.session.user.id
        });
      }
    };
    
    checkAuth();
  }, [navigate]);

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
        userProfile={userProfile}
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
