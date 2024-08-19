// This element is used to show all the restaurants in the vicinity of the users Location.
// There is also an option to directly search the generated dish on Zomato

import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  // This is the imports that are required to show the Map and Markers for the nearby restaurants
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import "./index.css";
import Hotelcard from "./Hotelcard"; //This is a card to show all the hotels in the nearby region
import Button from "@mui/material/Button";
import UserProfileContext from "../Context/UserContext";

const ZOMATO_URL = `https://www.zomato.com/`; //This is the base Zomato URL
const apiUrl = import.meta.env.VITE_APP_GOOGLE_API; //This is the API key for places API and Google Maps API
const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL;

export default function Checkplaces() {
  const location = useLocation();
  const { userDetails } = useContext(UserProfileContext);
  console.log(userDetails);
  const { userLocation, dish } = location.state || {};
  const [restaurants, setRestaurants] = useState([]); //Stores restaurant details
  const [map, setMap] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); //Stores value of selected restaurant
  const [city, setCity] = useState(null); //Stores value of city

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

  const onLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  };

  const onUnmount = React.useCallback((map) => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (userLocation && dish) {
      // Details of restaurants and locations are fetched everytime when the userLocation changes or the dish generated changes
      fetchRestaurants(userLocation, dish.name);
      fetchLocationDetails(userLocation.latitude, userLocation.longitude); // Added: fetch location details
    }
  }, [userLocation, dish]);

  const fetchLocationDetails = async (latitude, longitude) => {
    //Fetches exact location of the user on the map through Geocode API
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiUrl}`
      );

      if (response.data.status === "OK") {
        const addressComponents =
          response.data.results[0]?.address_components || [];

        let cityComponent = addressComponents.find(
          //THis locates the city of the location
          (component) =>
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_1") ||
            component.types.includes("administrative_area_level_2")
        );

        // If cityComponent is not found, search for other administrative levels or country
        if (!cityComponent) {
          cityComponent = addressComponents.find(
            (component) =>
              component.types.includes("administrative_area_level_3") ||
              component.types.includes("administrative_area_level_4") ||
              component.types.includes("country")
          );
        }

        // let locality = localityComponent
        //   ? // Locality& city from places API comes as Malad west so we need to convert that to Malad-west to use it in the Zomato url
        //     localityComponent.long_name.replace(/\s+/g, "-")
        //   : "Locality not found";
        let city = cityComponent
          ? cityComponent.long_name.replace(/\s+/g, "-")
          : "City not found";

        // locality = locality.toLowerCase();
        city = city.toLowerCase();

        setCity(city); //Added city value to the state variable

        return { city };
      } else {
        console.error("Geocoding API Error:", response.data.status);
        return {
          // locality: "Error fetching locality",
          city: "Error fetching city",
        };
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      return {
        // locality: "Error fetching locality",
        city: "Error fetching city",
      };
    }
  };

  console.log(userDetails);

  const handleOrderClick = () => {
    //Onclick function to redirect to the Zomato page with the city and dish
    console.log("Handle Order Click is clicked");
    if (city && dish) {
      console.log("Going to zomato");
      // console.log(locality);
      console.log(city);
      console.log(userDetails.locality, 1);
      const searchUrl = `${ZOMATO_URL}${city}/${
        userDetails.profile.locality
      }-restaurants/dish-${dish.name.toLowerCase()}`;
      console.log(searchUrl);
      window.open(searchUrl, "_blank");
    }
  };

  const fetchRestaurants = async (location, dishName) => {
    //Function to fetch restaurants in the nearby the location of the user
    try {
      const response = await axios.get(
        `${VITE_APP_API_URL}/api/dish/getNearbyRestaurants`,
        {
          params: {
            lat: location.latitude,
            lng: location.longitude,
            dish: dishName,
            radius: 3000, // 3 kilometers
            // Coordinates of the users location, name of the dish & the radius for which we want the restaurants are sent to the Endpoint as headers
          },
          withCredentials: true,
        }
      );
      setRestaurants(response.data); //Restaurants state is updated
      console.log("This is response.data", response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  return (
    <div className="h-full pb-60 flex flex-col justify-center items-center mt-8 overscroll-auto">
      <div className="flex  justify-center items-center mt-12 gap-64">
        {/* Flexbox for location and Map Details */}
        <div>
          <h1 className=" text-5xl">Your Location</h1>

          {userLocation ? (
            <p className=" text-2xl">
              Latitude: {userLocation.latitude}
              <br />
              Longitude: {userLocation.longitude}
              <br />
            </p>
          ) : (
            <p className=" text-2xl">No location data available.</p>
          )}
          {dish ? (
            <p className=" text-2xl">Dish: {dish.name}</p>
          ) : (
            <p className=" text-2xl">No dish information available.</p>
          )}
          <div className="mt-4">
            <Button
              onClick={handleOrderClick}
              variant="contained"
              color="secondary"
            >
              Order On Zomato
            </Button>
          </div>
        </div>
        <div className="map-container">
          {userLocation && restaurants.length > 0 && (
            <GoogleMap
              mapContainerStyle={{ height: "300px", width: "500px" }}
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
                  // This is the marker on the map for the location of the restaurant
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
                  //Always use "InfowindowF" instead of "Infowindow" as the later will show the main infobox with details of the restaurant and 1 small box that just has the "X" marker on it.

                  // When user clicks on any of the restaurant, soe information is displayed
                  position={{
                    lat: selectedRestaurant.geometry.location.lat,
                    lng: selectedRestaurant.geometry.location.lng,
                  }}
                  onCloseClick={() => setSelectedRestaurant(null)}
                >
                  <div>
                    {/* These are the contents of the infobox */}
                    <h2>{selectedRestaurant.name}</h2>
                    <p>Rating: {selectedRestaurant.rating}</p>
                    <p>Address: {selectedRestaurant.vicinity}</p>
                    <p>Status: {selectedRestaurant.business_status}</p>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          )}
        </div>
      </div>
      {/* Card Starts for Hotel From Here */}
      <div className="">
        <p className="text-4xl mt-12 text-center">List Of NearBy Restaurants</p>
        <div className="rating-container mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* All the restaurant details are sent to the Hotelcard element that displays the details of the restaurant in a card */}
          {restaurants.map((restaurant, index) => (
            <Hotelcard
              key={index}
              name={restaurant.name}
              rating={restaurant.rating}
              htmlAttributions={
                //These are the links to the restaurant's details on Google Maps
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
