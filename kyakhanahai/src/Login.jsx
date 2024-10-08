import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import "./index.css";
import UserProfileContext from "../Context/UserContext";

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL;

export default function Login() {
  const [username, setUsername] = useState(""); // Username is stored as state variable
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useContext(UserProfileContext); // Get context setter function

  useEffect(() => {
    if (userDetails) {
      console.log("User details available in Signup:", userDetails);
    }
  }, [userDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(username, password);
      const response = await axios.post(
        `${VITE_APP_API_URL}/api/authenticate/login`,
        { username, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        // Fetch user details
        const userResponse = await axios.get(
          `${VITE_APP_API_URL}/api/authenticate/user`,
          {
            withCredentials: true,
          }
        );

        // Update context and localStorage with user details
        setUserDetails(userResponse.data);
        localStorage.setItem("userDetails", JSON.stringify(userResponse.data));

        navigate("/"); // Redirect to homepage after successful login
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Please check user details");
    }
  };

  return (
    <div className="login-form text-center h-screen flex justify-center pt-20 w-full">
      <hr />
      <form onSubmit={handleSubmit}>
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
        <div className="m-8">
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
        <div className="w-full px-8">
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            className="w-full"
          >
            <LoginIcon />
            &nbsp;&nbsp;&nbsp;Login
          </Button>
        </div>
      </form>
    </div>
  );
}
