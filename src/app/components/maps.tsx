"use client";
import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
  Polygon,
  InfoWindow,
} from "@react-google-maps/api";

const center = {
  lat: 4.570868, // Colombia's approximate center coordinates
  lng: -74.297333,
};

// Coordenadas de los polígonos
const zonaNorte = [
  { lat: 12.437303, lng: -71.697029 },
  { lat: 10.963889, lng: -74.796387 },
  { lat: 9.749999, lng: -75.350027 },
  { lat: 8.5, lng: -73.0 },
  { lat: 12.437303, lng: -71.697029 },
];

const zonaSur = [
  { lat: 4.0, lng: -74.0 },
  { lat: 3.0, lng: -76.5 },
  { lat: 2.109375, lng: -77.682215 },
  { lat: -1.5, lng: -70.5 },
  { lat: 4.0, lng: -74.0 },
];

const zonaEste = [
  { lat: 6.0, lng: -74.0 },
  { lat: 5.5, lng: -71.0 },
  { lat: 2.5, lng: -70.0 },
  { lat: 4.0, lng: -74.0 },
  { lat: 6.0, lng: -74.0 },
];

const zonaOeste = [
  { lat: 8.5, lng: -76.5 },
  { lat: 5.0, lng: -77.5 },
  { lat: 3.0, lng: -76.5 },
  { lat: 8.5, lng: -73.0 },
  { lat: 8.5, lng: -76.5 },
];

const MapWithSearch: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [position, setPosition] = useState<google.maps.LatLngLiteral>(center);
  const [showInfoWindow, setShowInfoWindow] = useState<boolean>(false);
  const [infoWindowPosition, setInfoWindowPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [infoContent, setInfoContent] = useState<{
    name: string;
    code: string;
  }>({ name: "", code: "" });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (place && place.geometry && place.geometry.location) {
      const newCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPosition(newCenter);
      map?.panTo(newCenter);
    }
  };

  const handlePolygonClick = (
    event: google.maps.MapMouseEvent,
    name: string,
    code: string
  ) => {
    if (event.latLng) {
      setInfoWindowPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
      setInfoContent({ name, code });
      setShowInfoWindow(true);
    }
  };
  
  return (
    <LoadScript
      googleMapsApiKey= {'HERE GOES THE API KEY'}
      libraries={["places"]}
    >
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search location"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: "20px",
              width: "300px",
              height: "40px",
              padding: "0 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              fontSize: "14px",
              zIndex: 10,
            }}
          />
        </Autocomplete>
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          center={position}
          zoom={6}
          onLoad={onLoad}
        >
          <Marker position={position} />
          <Polygon
            path={zonaNorte}
            options={{
              fillColor: "#00FF00",
              fillOpacity: 0.4,
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
            onClick={(event) => handlePolygonClick(event, "North Zone", "9834")}
          />
          <Polygon
            path={zonaSur}
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.4,
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
            onClick={(event) => handlePolygonClick(event, "South Zone", "789")}
          />
          <Polygon
            path={zonaEste}
            options={{
              fillColor: "#FFFF00",
              fillOpacity: 0.4,
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
            onClick={(event) => handlePolygonClick(event, "East Zone", "123")}
          />
          <Polygon
            path={zonaOeste}
            options={{
              fillColor: "#0000FF",
              fillOpacity: 0.4,
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
            onClick={(event) => handlePolygonClick(event, "West Zone", "456")}
          />
          {showInfoWindow && infoWindowPosition && (
            <InfoWindow
              position={infoWindowPosition}
              onCloseClick={() => setShowInfoWindow(false)}
            >
              <div>
                <h4 className="font-bold">
                  Zone Name: <span className="font-normal">{infoContent.name}</span>
                </h4>
                <p className="font-bold">
                  Zone Code: <span className="font-normal">{infoContent.code}</span>
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapWithSearch;
