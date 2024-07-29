// THis component renders the signup page and submits user details to the DataBase

import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function Login() {
  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  // User details taken as state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    console.log("Inside post request front-end, 1");
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);
    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(response.data); // Log the response data (including req.file)

      if (response.status === 200) {
        alert("You have successfully signed up");
        navigate("/");
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
    <form action="" encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="flex items-center justify-center gap-16 overflow-y-auto h-screen mt-8 mb-20 overflow-y-auto">
        <div className=" flex flex-col mt-20  mb-4	items-center justify-center">
          <div className="h-60 w-60 border flex cursor-pointer items-center justify-center border-black rounded-full	">
            <div
              className="upload-container"
              onClick={handleFileInputClick}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                name="profilePic"
                type="file"
                inputRef={fileInputRef}
                style={{ display: "none" }}
                accept=".jpg, .png"
              />
              <PhotoCameraIcon style={{ fontSize: "100px", color: "#ccc" }} />
            </div>
          </div>
          <div className="mt-16">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              className="w-full"
            >
              <FollowTheSignsIcon></FollowTheSignsIcon>
              &nbsp;&nbsp;&nbsp;Signup
            </Button>
          </div>
        </div>
        <div>
          <div className="text-center flex-col flex justify-center items-center">
            <div className="m-4 w-80 z-1000">
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
            <div className="m-4 w-80">
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
            <div className="m-4 w-80">
              <TextField
                id="outlined-address"
                label="Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                fullWidth
              />
            </div>
            <div className="m-4 w-80">
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
            <div className="m-4 w-80">
              <TextField
                id="outlined-number"
                label="Phone Number"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
