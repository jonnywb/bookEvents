const GOOGLE_MAPS_API_KEY = "AIzaSyBiz95grSPTivvd8V9gct1kXn7p3wnOSUs";

import React, { useState, useRef, useEffect } from "react";
import { IonInput, IonItem, IonLabel } from "@ionic/react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 54.526, // Center of the UK
  lng: -2.5479,
};

const loadGoogleMapsScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById("googleMapsScript")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "googleMapsScript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
};

const LocationPicker: React.FC = () => {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const autocompleteRef = useRef<HTMLIonInputElement>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      await loadGoogleMapsScript();
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

      const map = new Map(mapRef.current as HTMLElement, {
        center,
        zoom: 6,
        mapId: "DEMO_MAP_ID", // Replace with your actual map ID
      });
      googleMapRef.current = map;

      const initializeAutocomplete = () => {
        if (autocompleteRef.current) {
          const inputElement = autocompleteRef.current.querySelector("input");
          if (inputElement) {
            const autocomplete = new google.maps.places.Autocomplete(inputElement, {
              componentRestrictions: { country: "uk" },
              types: ["establishment"], // Restricting to establishments
            });

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setMarkerPosition({ lat, lng });
                setInputValue(place.formatted_address || "");

                if (markerRef.current) {
                  markerRef.current.map = null; // Remove the existing marker
                }

                const newMarker = new AdvancedMarkerElement({
                  map,
                  position: { lat, lng },
                  title: place.name,
                });
                markerRef.current = newMarker; // Store the new marker
              }
            });
          }
        }
      };

      initializeAutocomplete();
    };

    initializeGoogleMaps();
  }, []);

  return (
    <div>
      <IonItem>
        <IonLabel position="stacked">Search for a location</IonLabel>
        <IonInput
          ref={autocompleteRef as React.RefObject<HTMLIonInputElement>}
          value={inputValue}
          placeholder="Search for a location"
          onIonChange={(e) => setInputValue(e.detail.value!)}
        />
      </IonItem>
      <div id="map" ref={mapRef} style={containerStyle}></div>
      {markerPosition && (
        <div>
          <p>
            Selected Location: {markerPosition.lat}, {markerPosition.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
