import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function Getdish() {
  const navigate = useNavigate();
  const location = useLocation();
  const dish = location.state?.dish;

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
    <div className="p-16  text-center flex justify-center items-align">
      <div className="pt-16 h-auto  text-center ">
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
      </div>
    </div>
  );
}
