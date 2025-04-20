import React, { useEffect, useRef, useState } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';
import { useLocation } from 'react-router-dom';
import '../../Styles/map.css';
import { 
  Plus, 
  Minus, 
  Navigation, 
  X,
  MapPin,
  LocateFixed
} from 'lucide-react';

const Map = ({ selectedPharmacyId, setMapInstance, onMarkerSelect, userLocation, pharmacies }) => {
  const mapContainerRef = useRef(null);
  const [localMapInstance, setLocalMapInstance] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [markers, setMarkers] = useState({});
  const location = useLocation();
  
  // Initialize map
  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: "1mv3hwNvE0s877rPETNBLQQ8huZcjUjktn5sQa4S",
    });

    // Default center coordinates - will be overridden if user location is available
    const defaultCenter = [77.61648476788898, 12.931423492103944];
    
    // Determine the center coordinates based on available location data
    let centerCoordinates = defaultCenter;
    
    // First priority: Use coordinates from userLocation (from LocationSelector)
    if (userLocation?.coordinates) {
      centerCoordinates = [userLocation.coordinates.longitude, userLocation.coordinates.latitude];
    } 
    // Second priority: Use coordinates from location state (from search)
    else if (location.state?.coordinates) {
      centerCoordinates = [location.state.coordinates.longitude, location.state.coordinates.latitude];
    }

    const myMap = olaMaps.init({
      style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: mapContainerRef.current,
      center: centerCoordinates,
      zoom: 15,
    });

    setLocalMapInstance(myMap);
    if (setMapInstance) setMapInstance(myMap);

    // Add user location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userMarker = document.createElement('div');
          userMarker.className = 'user-marker';
          userMarker.innerHTML = '<div class="user-dot"></div><div class="user-pulse"></div>';
          
          // Using correct method to add marker
          olaMaps
            .addMarker({
              element: userMarker,
              anchor: 'center'
            })
            .setLngLat([position.coords.longitude, position.coords.latitude])
            .addTo(myMap);
          
          // Only center map on user's location if no other location is selected
          if (!userLocation?.coordinates && !location.state?.coordinates) {
            myMap.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15,
              speed: 1.5
            });
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }

    return () => {
      if (myMap) {
        myMap.remove();
      }
    };
  }, []); 

  // Update markers when pharmacies data changes
  useEffect(() => {
    if (!localMapInstance || !pharmacies || pharmacies.length === 0) return;

    // Clear existing markers
    Object.values(markers).forEach(({ marker }) => {
      if (marker) marker.remove();
    });

    const newMarkers = {};

    // Add markers for each pharmacy
    pharmacies.forEach((pharmacy) => {
      if (pharmacy.latitude && pharmacy.longitude) {
        // Create marker element
        const markerEl = createMarkerElement(pharmacy);
        
        try {
          // Add marker to map using correct method
          const marker = localMapInstance.addMarker({
            element: markerEl,
            anchor: 'bottom'
          })
          .setLngLat([pharmacy.longitude, pharmacy.latitude])
          .addTo(localMapInstance);
          
          // Add event handlers to marker element
          addMarkerEvents(markerEl, pharmacy);
          
          newMarkers[pharmacy.id] = {
            marker,
            element: markerEl,
            pharmacy
          };
        } catch (error) {
          console.error("Error adding marker:", error);
        }
      }
    });
    
    setMarkers(newMarkers);
    
    // Center map on first pharmacy if available
    if (pharmacies[0]?.latitude && pharmacies[0]?.longitude) {
      localMapInstance.flyTo({
        center: [pharmacies[0].longitude, pharmacies[0].latitude],
        zoom: 15,
        speed: 1.5
      });
    }
  }, [pharmacies, localMapInstance]);

  // When userLocation changes, update the map center
  useEffect(() => {
    if (localMapInstance && userLocation?.coordinates) {
      // Fly to the new location when it changes
      localMapInstance.flyTo({
        center: [userLocation.coordinates.longitude, userLocation.coordinates.latitude],
        zoom: 15,
        speed: 1.5
      });
    }
  }, [userLocation, localMapInstance]);

  // Update marker styles when selected pharmacy changes
  useEffect(() => {
    if (markers && Object.keys(markers).length > 0) {
      // Reset all markers to default style
      Object.values(markers).forEach(({ element }) => {
        if (element) element.classList.remove('selected-marker');
      });
      
      // Apply selected style to the selected pharmacy marker
      if (selectedPharmacyId && markers[selectedPharmacyId]) {
        const { element, pharmacy } = markers[selectedPharmacyId];
        if (element) element.classList.add('selected-marker');
        
        // Center map on selected pharmacy
        if (localMapInstance && pharmacy) {
          localMapInstance.flyTo({
            center: [pharmacy.longitude, pharmacy.latitude],
            zoom: 16,
            speed: 1.5
          });
        }
      }
    }
  }, [selectedPharmacyId, markers, localMapInstance]);
  
  // Helper function to add event listeners to markers
  const addMarkerEvents = (markerEl, pharmacy) => {
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
  };

  // Create a custom marker element
  const createMarkerElement = (pharmacy) => {
    const markerEl = document.createElement('div');
    const hasMedicine = pharmacy.medicineInStock !== undefined 
      ? pharmacy.medicineInStock 
      : true;
    markerEl.className = `custom-marker ${hasMedicine ? 'in-stock' : 'no-stock'}`;
    
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
        <div class="tooltip-distance">${pharmacy.distance || 'Unknown distance'}</div>
      </div>
    `;
    
    return markerEl;
  };

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
        <button className="map-control-btn reset-view" 
          onClick={() => {
            if (localMapInstance && pharmacies && pharmacies.length > 0) {
              // Try to fit all pharmacies in the view
              const bounds = new window.olaMaps.LngLatBounds();
              
              // Add all pharmacy locations to bounds
              pharmacies.forEach(pharmacy => {
                if (pharmacy.latitude && pharmacy.longitude) {
                  bounds.extend([pharmacy.longitude, pharmacy.latitude]);
                }
              });
              
              // Check if bounds have been extended
              if (!bounds.isEmpty()) {
                localMapInstance.fitBounds(bounds, {
                  padding: 50,
                  maxZoom: 16
                });
              }
            }
          }} 
          aria-label="Show all pharmacies"
        >
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