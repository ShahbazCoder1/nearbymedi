import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import PharmacyNearby from "../../components/PharmacyNearby";
import Map from "../../components/Map/map";
import FilterTabBar from "../../components/FilterTabBar";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    // Update map to focus on selected pharmacy
    if (mapInstance && pharmacy) {
      mapInstance.flyTo({
        center: pharmacy.coords || [77.61748476788898, 12.932423492103944],
        zoom: 16,
        speed: 1.5,
      });
    }
  };

  return (
    <div className="dashboard">
      <Header isDashboard={true} />
      <FilterTabBar />
      <div className="content-container">
        {/* New top section with medicine details and map side by side */}
        <div className="top-section">
          <div className="medicine-panel">
            <PharmacyNearby
              onPharmacySelect={handlePharmacySelect}
              selectedPharmacyId={selectedPharmacy?.id}
              searchQuery={searchQuery}
            />
          </div>
          <div className="map-container">
            <Map
              selectedPharmacyId={selectedPharmacy?.id}
              setMapInstance={setMapInstance}
              onMarkerSelect={handlePharmacySelect}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>

        {/* Bottom section for pharmacy list */}
        {/* <div className="bottom-section">
          <PharmacyNearby 
            onPharmacySelect={handlePharmacySelect} 
            selectedPharmacyId={selectedPharmacy?.id} 
            searchQuery={searchQuery}
          />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
