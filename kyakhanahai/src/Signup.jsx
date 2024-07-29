// THis component renders the signup page and submits user details to the DataBase

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";

export default function Login() {
  // User details taken as state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("Inside post request front-end, 1");
    e.preventDefault();
    // console.log(name, username, password);
    try {
      console.log("inside try block");
      const response = await axios.post(
        "http://localhost:3000/api/signup",
        {
          username,
          password,
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Request sent");

      if (response.status === 200) {
        alert("You have successfully signed up");
        navigate("/");
        console.log("Navigated");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("User already registered");
        navigate("/signup");
      } else {
        console.error("Error signing up:", error);
      }
    }
  };

  return (
    <div className="h-screen text-center flex justify-center items-center">
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="m-8 w-80">
          <TextField
            id="outlined-name"
            label="Full Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
        </div>
        <div className="m-8 w-80">
          <TextField
            id="outlined-username"
            label="Email-Id"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
        </div>
        <div className="m-8 w-80">
          <TextField
            id="outlined-password"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
        </div>
        <div className="m-8 w-80">
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            className="w-full"
          >
            <FollowTheSignsIcon></FollowTheSignsIcon>&nbsp;&nbsp;&nbsp;Signup
          </Button>
        </div>
      </form>
    </div>
  );
}
