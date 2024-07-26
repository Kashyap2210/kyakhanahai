import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import "./index.css";
import Hotelcard from "./Hotelcard";

const ZOMATO_URL = "https://www.zomato.com/";
const apiUrl = import.meta.env.VITE_APP_GOOGLE_API;

export default function Checkplaces() {
  const location = useLocation();
  const { userLocation, dish } = location.state || {};
  const [restaurants, setRestaurants] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [city, setCity] = useState(null);
  const [locality, setLocality] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiUrl,
  });

  const center = userLocation
    ? {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        zoom: 13.5,
      }
    : { lat: 0, lng: 0, zoom: 13.5 }; // Default center if userLocation is not available

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
      fetchLocationDetails(userLocation.latitude, userLocation.longitude); // Added: fetch location details
    }
  }, [userLocation, dish]);

  const fetchLocationDetails = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiUrl}`
        // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${19.182755},${72.840157}&key=${apiUrl}`
      );

      if (response.data.status === "OK") {
        const addressComponents =
          response.data.results[0]?.address_components || [];

        const localityComponent = addressComponents.find(
          (component) =>
            component.types.includes("sublocality_level_1") ||
            component.types.includes("locality")
        );

        // Update this part to better handle the city identification
        const cityComponent = addressComponents.find(
          (component) =>
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_1") ||
            component.types.includes("administrative_area_level_2")
        );

        let locality = localityComponent
          ? localityComponent.long_name.replace(/\s+/g, "-")
          : "Locality not found";
        let city = cityComponent ? cityComponent.long_name : "City not found";
        console.log(`This ${locality} Is In ${city}.`);
        city = city.toLowerCase();
        locality = locality.toLowerCase();
        console.log(city, "LOwercase");
        setCity(city); // Added: set city
        setLocality(locality);
        return { locality, city };
      } else {
        console.error("Geocoding API Error:", response.data.status);
        return {
          locality: "Error fetching locality",
          city: "Error fetching city",
        };
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      return {
        locality: "Error fetching locality",
        city: "Error fetching city",
      };
    }
  };

  const handleOrderClick = () => {
    // Modified: Removed parameters, use state
    console.log("Handle Order Click is clicked");
    if (city && dish) {
      console.log("Going to zomato");
      console.log(locality);
      console.log(city);
      const searchUrl = `${ZOMATO_URL}${city}/${locality}-restaurants/dish-${dish.name}`;
      console.log(searchUrl);
      window.open(searchUrl, "_blank");
    }
  };

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
    <div className="h-full pb-60 flex flex-col mt-20 overscroll-auto">
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
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "800px" }}
            center={{
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            }}
            zoom={13.5}
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
                onClick={() => setSelectedRestaurant(restaurant)}
              />
            ))}

            {selectedRestaurant && (
              <InfoWindowF
                position={{
                  lat: selectedRestaurant.geometry.location.lat,
                  lng: selectedRestaurant.geometry.location.lng,
                }}
                onCloseClick={() => setSelectedRestaurant(null)}
              >
                <div>
                  <h2>{selectedRestaurant.name}</h2>
                  <p>Rating: {selectedRestaurant.rating}</p>
                  <p>Address: {selectedRestaurant.vicinity}</p>
                  <p>Status: {selectedRestaurant.business_status}</p>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        )}
        <div>
          <button onClick={handleOrderClick}>Order On Zomato</button>{" "}
          {/* Modified: Direct call to handleOrderClick */}
        </div>
        <div className="rating-container">
          {restaurants.map((restaurant, index) => (
            <Hotelcard
              key={index}
              name={restaurant.name}
              rating={restaurant.rating}
              htmlAttributions={
                restaurant.photos && restaurant.photos.length > 0
                  ? restaurant.photos[0].html_attributions
                  : []
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
