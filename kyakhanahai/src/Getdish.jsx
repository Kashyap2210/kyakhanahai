import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function Getdish() {
  const navigate = useNavigate();
  const location = useLocation();
  const dish = location.state?.dish;
  const [userLocation, setUserLocation] = useState(null);

  const getLocation = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          callback({ latitude, longitude });
        },
        (err) => {
          console.log(err.message);
          callback(null);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      callback(null);
    }
  };

  const handleSeeRestaurants = () => {
    getLocation((location) => {
      if (location) {
        navigate("/checkplaces", { state: { userLocation: location, dish } });
      } else {
        console.log("Unable to retrieve location.");
      }
    });
  };

  const getDish = async (e) => {
    e.preventDefault();
    try {
      navigate("/getdish");
      console.log("inside try block");
      const response = await axios.get("http://localhost:3000/api/getdish", {
        withCredentials: true,
      });
      console.log("Request sent to get dish");

      if (response.status === 200) {
        navigate("/getdish", { state: { dish: response.data } });
        console.log(response.data.name, "Yehi bhejna hai bhai");
        // navigate("/checkplaces", { state: { dish: response.data.name } });
        console.log("Navigated");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="p-16  text-center flex justify-center items-align">
      <div className="pt-16 text-center ">
        <h1 className="text-center mt-8 text-4xl font-bold	">
          Your Meal For The Day Is
        </h1>

        {dish ? (
          <>
            <p className="text-2xl mt-4">{dish.name}</p>
            <Link to="/getdish">
              <Button
                className="h-8 border"
                variant="contained"
                color="secondary"
                onClick={getDish}
                sx={{ marginTop: "2rem" }}
              >
                Want Something Else?
              </Button>
            </Link>
          </>
        ) : (
          <>
            <p className="text-2xl mt-4 text-red-500">
              "No Dish Found Please Try Again!"
            </p>
            <Link to="/getdish">
              <Button
                className="h-8 border"
                variant="contained"
                color="secondary"
                onClick={getDish}
                sx={{ marginTop: "2rem" }}
              >
                Want Something Else?
              </Button>
            </Link>
          </>
        )}
        <div className="mt-8">
          <Link to="/checkplaces">
            <Button
              color="secondary"
              variant="contained"
              onClick={handleSeeRestaurants}
            >
              See Restaurants That Serve This Dish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
