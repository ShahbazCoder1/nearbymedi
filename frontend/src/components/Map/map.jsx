import React, { useEffect, useRef, useState } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';
import '../../Styles/map.css';
import { 
  Plus, 
  Minus, 
  Navigation, 
  X,
  MapPin,
  LocateFixed
} from 'lucide-react';

const Map = ({ selectedPharmacyId, setMapInstance, onMarkerSelect }) => {
  const mapContainerRef = useRef(null);
  const [localMapInstance, setLocalMapInstance] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [markers, setMarkers] = useState({});
  
  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: "1mv3hwNvE0s877rPETNBLQQ8huZcjUjktn5sQa4S",
    });

    const myMap = olaMaps.init({
      style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: mapContainerRef.current,
      center: [77.61648476788898, 12.931423492103944],
      zoom: 15,
    });

    setLocalMapInstance(myMap);
    if (setMapInstance) setMapInstance(myMap);

    // Add pharmacy markers
    const pharmacies = [
      { 
        id: 1,
        name: 'HealthPlus Pharmacy', 
        coords: [77.61748476788898, 12.932423492103944],
        isOpen: true,
        address: '123 Main Street, Downtown',
        medicineInStock: true
      },
      { 
        id: 2,
        name: 'City Medical Store', 
        coords: [77.61548476788898, 12.930423492103944],
        isOpen: true,
        address: '456 Oak Avenue, Midtown',
        medicineInStock: false
      },
      { 
        id: 3,
        name: 'MediCare Pharmacy', 
        coords: [77.61848476788898, 12.929423492103944],
        isOpen: true,
        address: '789 Pine Road, Central District',
        medicineInStock: true
      },
      {
        id: 4,
        name: 'Wellness Drugstore',
        coords: [77.61448476788898, 12.933423492103944],
        isOpen: true,
        address: '101 Elm Street, West Block',
        medicineInStock: false
      },
      {
        id: 5,
        name: 'Family Pharmacy',
        coords: [77.61948476788898, 12.928423492103944],
        isOpen: false,
        address: '222 Cedar Lane, Northside',
        medicineInStock: true
      }
    ];

    // Add markers when map is loaded
    myMap.on('load', () => {
      const markersObj = {};
      
      // Add custom markers
      pharmacies.forEach((pharmacy) => {
        // Create marker element
        const markerEl = createMarkerElement(pharmacy);
        
        // Add tooltip hover behavior
        markerEl.addEventListener('mouseenter', () => {
          markerEl.classList.add('show-tooltip');
        });
        
        markerEl.addEventListener('mouseleave', () => {
          markerEl.classList.remove('show-tooltip');
        });

        // Add click event to select pharmacy
        markerEl.addEventListener('click', () => {
          if (onMarkerSelect) {
            onMarkerSelect(pharmacy);
          }
        });

        // Add marker to map
        const marker = new olaMaps.Marker({
          element: markerEl,
          anchor: 'bottom'
        })
        .setLngLat(pharmacy.coords)
        .addTo(myMap);
        
        markersObj[pharmacy.id] = {
          marker,
          element: markerEl,
          pharmacy
        };
      });
      
      setMarkers(markersObj);

      // Add user location marker
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userMarker = document.createElement('div');
            userMarker.className = 'user-marker';
            userMarker.innerHTML = '<div class="user-dot"></div><div class="user-pulse"></div>';
            
            new olaMaps.Marker({
              element: userMarker
            })
            .setLngLat([position.coords.longitude, position.coords.latitude])
            .addTo(myMap);
            
            // Center map on user's location
            myMap.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15,
              speed: 1.5
            });
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      }
    });

    return () => {
      if (myMap) {
        myMap.remove();
      }
    };
  }, []); 

  // Update marker styles when selected pharmacy changes
  useEffect(() => {
    if (markers && Object.keys(markers).length > 0) {
      // Reset all markers to default style
      Object.values(markers).forEach(({ element }) => {
        element.classList.remove('selected-marker');
      });
      
      // Apply selected style to the selected pharmacy marker
      if (selectedPharmacyId && markers[selectedPharmacyId]) {
        const { element, pharmacy } = markers[selectedPharmacyId];
        element.classList.add('selected-marker');
        
        // Center map on selected pharmacy
        if (localMapInstance) {
          localMapInstance.flyTo({
            center: pharmacy.coords,
            zoom: 16,
            speed: 1.5
          });
        }
      }
    }
  }, [selectedPharmacyId, markers, localMapInstance]);

  // Function to handle zooming
  const handleZoomIn = () => {
    if (localMapInstance) {
      localMapInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (localMapInstance) {
      localMapInstance.zoomOut();
    }
  };

  const handleMyLocation = () => {
    if (localMapInstance && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localMapInstance.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 16,
            speed: 2
          });
        }
      );
    }
  };

  const closeInfoPanel = () => {
    setShowInfoPanel(false);
  };

  // Create a custom marker element
  const createMarkerElement = (pharmacy) => {
    const markerEl = document.createElement('div');
    markerEl.className = `custom-marker ${pharmacy.medicineInStock ? 'in-stock' : 'no-stock'}`;
    
    // Add icon HTML - we'll now use an SVG path similar to Lucide's Pill icon
    markerEl.innerHTML = `
      <div class="marker-icon ${pharmacy.isOpen ? 'open' : 'closed'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
          <path d="m8.5 8.5 7 7"></path>
        </svg>
      </div>
      <div class="marker-tooltip">
        <div class="tooltip-name">${pharmacy.name}</div>
        <div class="tooltip-status ${pharmacy.isOpen ? 'open' : 'closed'}">
          ${pharmacy.isOpen ? 'Open Now' : 'Closed'}
        </div>
        <div class="tooltip-medicine-status">
          ${pharmacy.medicineInStock ? 'Medicine in Stock' : 'Medicine not available'}
        </div>
      </div>
    `;
    
    return markerEl;
  };

  return (
    <div className="map-container">
      <div className="map-controls">
        <button className="map-control-btn zoom-in" onClick={handleZoomIn} aria-label="Zoom in">
          <Plus size={16} />
        </button>
        <button className="map-control-btn zoom-out" onClick={handleZoomOut} aria-label="Zoom out">
          <Minus size={16} />
        </button>
        <button className="map-control-btn my-location" onClick={handleMyLocation} aria-label="My location">
          <LocateFixed size={16} />
        </button>
        <button className="map-control-btn reset-view" onClick={() => localMapInstance && localMapInstance.flyTo({center: [77.61648476788898, 12.931423492103944], zoom: 15})} aria-label="Reset map">
          <MapPin size={16} />
        </button>
      </div>
      
      <div className={`map-info-panel ${!showInfoPanel ? 'hidden' : ''}`}>
        <div className="map-info-panel-header">
          <h4 className="map-info-panel-title">Find Nearby Pharmacies</h4>
          <button className="map-info-close" onClick={closeInfoPanel}>
            <X size={16} />
          </button>
        </div>
        <div className="map-info-content">
          Click on a pharmacy marker to see details and select it from the list on the left.
        </div>
      </div>
      
      <div ref={mapContainerRef} id="map" className="map"></div>
    </div>
  );
};

export default Map;