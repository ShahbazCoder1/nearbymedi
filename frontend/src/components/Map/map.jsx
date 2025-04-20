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

const Map = ({ selectedPharmacyId, setMapInstance, onMarkerSelect, userLocation }) => {
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

    // Add pharmacy markers when map is loaded
    myMap.on('load', () => {
      // Try to get pharmacy data from location state
      const pharmacies = location.state?.nearbyPharmacies || [];
      const coordinates = location.state?.coordinates || userLocation?.coordinates;
      
      const markersObj = {};
      
      if (pharmacies.length > 0) {
        // Add markers from state data
        pharmacies.forEach((pharmacy) => {
          if (pharmacy.latitude && pharmacy.longitude) {
            // Create marker element
            const markerEl = createMarkerElement(pharmacy);
            addMarkerEvents(markerEl, pharmacy);
            
            // Add marker to map
            const marker = new olaMaps.Marker({
              element: markerEl,
              anchor: 'bottom'
            })
            .setLngLat([pharmacy.longitude, pharmacy.latitude])
            .addTo(myMap);
            
            markersObj[pharmacy.id] = {
              marker,
              element: markerEl,
              pharmacy
            };
          }
        });
        
        setMarkers(markersObj);
        
        // Center map on first pharmacy
        if (pharmacies[0]?.latitude && pharmacies[0]?.longitude) {
          myMap.flyTo({
            center: [pharmacies[0].longitude, pharmacies[0].latitude],
            zoom: 15,
            speed: 1.5
          });
        }
      } else {
        // No pharmacies from state, add default markers around the center
        addDefaultMarkers(olaMaps, myMap, markersObj, centerCoordinates);
      }

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
    });

    return () => {
      if (myMap) {
        myMap.remove();
      }
    };
  }, [location.state, userLocation]); 

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
  
  // Function to add default markers when no pharmacy data is available
  const addDefaultMarkers = (olaMaps, map, markersObj, centerCoords) => {
    // Default pharmacies for fallback - position them around the provided center coordinates
    const [centerLng, centerLat] = centerCoords;
    
    // Generate pharmacies around the center point
    for (let i = 0; i < 5; i++) {
      // Generate random offsets (within ~1km)
      const latOffset = (Math.random() - 0.5) * 0.01;
      const lngOffset = (Math.random() - 0.5) * 0.01;
      
      const pharmacy = {
        id: i + 1,
        name: ["HealthPlus Pharmacy", "City Medical Store", "MediCare Pharmacy", 
               "Wellness Drugstore", "Family Pharmacy"][i],
        coords: [centerLng + lngOffset, centerLat + latOffset],
        isOpen: Math.random() > 0.2,
        address: `${Math.floor(Math.random() * 500)} Main Street, ${userLocation?.city || 'Downtown'}`,
        medicineInStock: Math.random() > 0.3
      };
      
      // Create and add marker
      const markerEl = createMarkerElement(pharmacy);
      addMarkerEvents(markerEl, pharmacy);
      
      const marker = new olaMaps.Marker({
        element: markerEl,
        anchor: 'bottom'
      })
      .setLngLat(pharmacy.coords)
      .addTo(map);
      
      markersObj[pharmacy.id] = {
        marker,
        element: markerEl,
        pharmacy
      };
    }
    
    setMarkers(markersObj);
  };

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
          const coords = pharmacy.coords || [pharmacy.longitude, pharmacy.latitude];
          if (coords) {
            localMapInstance.flyTo({
              center: coords,
              zoom: 16,
              speed: 1.5
            });
          }
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
        ${hasMedicine !== undefined ? `
        <div class="tooltip-medicine-status">
          ${hasMedicine ? 'Medicine in Stock' : 'Medicine not available'}
        </div>` : ''}
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