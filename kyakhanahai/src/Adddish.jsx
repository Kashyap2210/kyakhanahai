// This component is used to add a dish to the DB

import React, { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Autocomplete, TextField } from "@mui/material";

export default function Login() {
  // State variables for dish Info
  const [id, setId] = useState("");
  const [name, setName] = useState(""); //Name of the dish
  const [selectedCategory, setSelectedCategory] = useState(null); // Category i.e. meal, snack  const [type, setType] = useState(""); //Type i.e. Veg/Non-veg
  const [selectedType, setSelectedType] = useState(null);
  const categories = ["Veg", "Non-Veg"];
  const types = ["Meal", "Snack", "Breakfast"];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Function to handle the form submission
    e.preventDefault();
    try {
      // Check if user is authenticated
      const authResponse = await axios.get(
        "${VITE_APP_API_URL}/api/checkAuth",
        {
          withCredentials: true,
        }
      );
      if (!authResponse.data.authenticated) {
        // Redirect to login page if not authenticated
        alert("Please Login To Add Your Dish");
        navigate("/login");
        return;
      }

      console.log("inside try block");
      const response = await axios.post(
        "${VITE_APP_API_URL}/api/adddish",
        {
          //name, category, type are sent to backend
          name,
          category: selectedCategory,
          type: selectedType,
        },
        { withCredentials: true }
      );
      console.log("Request sent");

      if (response.status === 200) {
        navigate("/");
        alert("Your dish was added");
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
      {/* <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top100Films}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      /> */}

      <div className="login-form  text-center h-screen flex justify-center pt-16 w-fill">
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="m-8 w-80">
            <TextField
              id="outlined-name"
              label="Dish-name"
              variant="outlined"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
          </div>
          <div className="m-8 w-80">
            <Autocomplete
              value={selectedCategory}
              disablePortal
              id="combo-box-demo"
              options={categories}
              sx={{ width: 300 }}
              onChange={(event, newValue) => setSelectedCategory(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="outlined-category"
                  label="Category"
                  variant="outlined"
                  type="name"
                  // value={selectedCategorycategory}
                  required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="m-8 w-80">
            <Autocomplete
              value={selectedType}
              disablePortal
              id="combo-box-demo"
              options={types}
              sx={{ width: 300 }}
              onChange={(event, newValue) => setSelectedType(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="outlined-type"
                  label="Type"
                  variant="outlined"
                  type="type"
                  // value={types}
                  // onChange={(e) => setType(e.target.value)}
                  required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="m-8 w-80">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              className="w-full"
            >
              Add dish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
