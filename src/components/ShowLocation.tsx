import React from "react";
import { Map, Pin, AdvancedMarker } from "@vis.gl/react-google-maps";

interface ShowLocationProps {
  location: { lat: number; long: number };
  eventName: string;
}
type Poi = { key: string; location: google.maps.LatLngLiteral };

const ShowLocation: React.FC<ShowLocationProps> = ({ eventName, location }) => {
  const locations: Poi[] = [{ key: eventName, location: { lat: location.lat, lng: location.long } }];

  const PoiMarkers = (props: { pois: Poi[] }) => {
    return (
      <>
        {props.pois.map((poi: Poi) => (
          <AdvancedMarker key={poi.key} position={poi.location}>
            <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
          </AdvancedMarker>
        ))}
      </>
    );
  };

  return (
    <>
      <Map
        mapId="3aa0adfb734f90b7"
        style={{ width: "75vw", height: "50vh" }}
        defaultCenter={{ lat: location.lat, lng: location.long }}
        defaultZoom={13}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      ></Map>
      <PoiMarkers pois={locations} />
    </>
  );
};

export default ShowLocation;
