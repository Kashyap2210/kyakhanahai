import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

const apiUrl = import.meta.env.VITE_APP_GOOGLE_API;
export default function Checkplaces() {
  const location = useLocation();
  const { userLocation, dish } = location.state || {};
  const [restaurants, setRestaurants] = useState([]);
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiUrl,
  });

  const center = userLocation
    ? {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      }
    : { lat: 0, lng: 0 }; // Default center if userLocation is not available

  const onLoad = React.useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (userLocation && dish) {
      fetchRestaurants(userLocation, dish.name);
    }
  }, [userLocation, dish]);

  const fetchRestaurants = async (location, dishName) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getNearbyRestaurants",
        {
          params: {
            lat: location.latitude,
            lng: location.longitude,
            dish: dishName,
            radius: 3000, // 3 kilometers
          },
          withCredentials: true,
        }
      );
      setRestaurants(response.data);
      console.log("This is response.data", response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  return (
    <div className="h-screen mt-20">
      <h1>Your Location</h1>
      {userLocation ? (
        <p>
          Latitude: {userLocation.latitude}
          <br />
          Longitude: {userLocation.longitude}
          <br />
        </p>
      ) : (
        <p>No location data available.</p>
      )}
      {dish ? <p>Dish: {dish.name}</p> : <p>No dish information available.</p>}
      <div className="map-container">
        {userLocation && restaurants.length > 0 && (
          //   <LoadScript googleMapsApiKey={apiUrl}>
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "800px" }}
            center={{
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            }}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {restaurants.map((restaurant, index) => (
              <MarkerF
                key={index}
                position={{
                  lat: restaurant.geometry.location.lat,
                  lng: restaurant.geometry.location.lng,
                }}
                title={restaurant.name}
                className="w-8 h-8 bg-black"
              />
            ))}
          </GoogleMap>
          //   </LoadScript>
        )}
      </div>
    </div>
  );
}
