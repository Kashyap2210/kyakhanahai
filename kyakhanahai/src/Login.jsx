import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import "./index.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // console.log(username, password);
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/");
        console.log("Login Successful");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Please check user details");
    }
  };

  return (
    <div className="login-form text-center h-screen flex  justify-center pt-20 w-fill	">
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="m-8 w-80">
          <TextField
            id="outlined-username"
            label="email-Id"
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
            <LoginIcon></LoginIcon>&nbsp;&nbsp;&nbsp;Login
          </Button>
        </div>
      </form>
    </div>
  );
}
