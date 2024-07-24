import React from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import Autocomplete from "react-google-autocomplete";

interface LocationPickerProps {
  onLocationChange: (latitude: number, longitude: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationChange }) => {
  const placesLib = useMapsLibrary("places");

  return (
    <>
      {placesLib && (
        <Autocomplete
          className="ion-padding ion-margin-top ion-margin-bottom"
          style={{
            width: "100%",
          }}
          options={{
            types: ["establishment"],
            componentRestrictions: { country: "uk" },
          }}
          onPlaceSelected={(place) => {
            const newLocations: any[] = [];

            const location = place.geometry?.location;

            const newLocation = {
              key: place.place_id,
              location: location ? { lat: location.lat(), lng: location.lng() } : null,
            };

            if (location) {
              onLocationChange(location.lat(), location.lng());
            }

            newLocations.push(newLocation);
          }}
        />
      )}
    </>
  );
};

export default LocationPicker;
