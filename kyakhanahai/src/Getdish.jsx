import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Getdish() {
  const navigate = useNavigate();
  const location = useLocation();
  const dish = location.state?.dish;

  const getDish = async (e) => {
    e.preventDefault();
    try {
      navigate("/getdish");
      console.log("inside try block");
      const response = await axios.get("http://localhost:3000/getdish");
      console.log("Request sent");

      if (response.status === 200) {
        navigate("/getdish", { state: { dish: response.data } });
        console.log(response.data);
        console.log("Navigated");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  return (
    <div>
      <h1>Your Meal For The Day</h1>
      {dish ? (
        <>
          <p>Name: {dish.name}</p>
          <Link to="/getdish">
            <button className="h-8 w-40 border" onClick={getDish}>
              Generate Dish
            </button>
          </Link>
        </>
      ) : (
        <>
          <p>"No Dish Found Please Try Again!"</p>
          <Link to="/getdish">
            <button className="h-8 w-40 border" onClick={getDish}>
              Generate Dish
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
