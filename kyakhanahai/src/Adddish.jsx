import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Login() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if user is authenticated
      const authResponse = await axios.get("http://localhost:3000/checkAuth", {
        withCredentials: true,
      });
      if (!authResponse.data.authenticated) {
        // Redirect to login page if not authenticated
        alert("Please Login To Add Your Dish");
        navigate("/login");
        return;
      }

      console.log("inside try block");
      const response = await axios.post(
        "http://localhost:3000/adddish",
        {
          name,
          category,
          type,
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
    <div className="login-form text-center mt-5 mb-40">
      <hr />
      <form onSubmit={handleSubmit}>
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
        <TextField
          id="outlined-category"
          label="Category"
          variant="outlined"
          type="name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          fullWidth
        />
        <TextField
          id="outlined-type"
          label="Type"
          variant="outlined"
          type="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          fullWidth
        />
        {/* <Link> */}
        <Button variant="contained" color="success" type="submit">
          Add dish
        </Button>
        {/* </Link> */}
      </form>
    </div>
  );
}
