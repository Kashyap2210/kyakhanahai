import React, { useState, useRef, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UserProfileContext from "../Context/UserContext";

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL;

console.log(VITE_APP_API_URL);

export default function Signup() {
  const { userDetails, setUserDetails } = useContext(UserProfileContext);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      console.log("User details available in Signup:", userDetails);
    }
  }, [userDetails]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        // Generate a preview URL
        const previewUrl = URL.createObjectURL(selectedFile);

        const formData = new FormData();
        formData.append("profilePic", selectedFile);

        const response = await axios.post(
          `${VITE_APP_API_URL}/api/authenticate/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        // Update the state with the preview URL and file path
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          file: selectedFile,
          previewUrl: previewUrl,
          filePath: response.data.filePath,
        }));
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (userDetails.filePath) {
        try {
          await axios.delete(
            `${VITE_APP_API_URL}/api/authenticate/delete-file`,
            {
              data: { filePath: userDetails.filePath },
            }
          );
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload(); // Call it on component unmount as well
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userDetails.filePath]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", userDetails.username);
    formData.append("password", userDetails.password);
    formData.append("name", userDetails.name);
    formData.append("locality", userDetails.locality);
    formData.append("address", userDetails.address);
    formData.append("phoneNumber", userDetails.phoneNumber);
    if (userDetails.file) {
      formData.append("profilePic", userDetails.file);
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/authenticate/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const { username, name, address, phoneNumber, profilePic, locality } =
          response.data;
        setUserDetails({
          username,
          name,
          address,
          phoneNumber,
          profilePic,
          locality,
        });
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
      <div className="flex items-center justify-center gap-16 overflow-y-auto h-screen mt-8 mb-20">
        <div className="flex flex-col mb-4 items-center justify-center">
          <div className="relative w-60 h-60 flex cursor-pointer items-center justify-center rounded-full">
            <input
              type="file"
              name="profilePic"
              ref={fileInputRef}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".jpg, .png"
              onChange={handleFileChange}
            />
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              {userDetails.previewUrl ? (
                <img
                  src={userDetails.previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <PhotoCameraIcon
                  className="text-gray-300"
                  sx={{ fontSize: 80 }}
                />
              )}
            </div>
          </div>
          <div className="mt-8">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              className="w-full"
            >
              <FollowTheSignsIcon className="mr-2" />
              Signup
            </Button>
          </div>
        </div>
        <div>
          <div className="text-center flex-col flex justify-center items-center">
            <div className="m-4 w-80 z-10">
              <TextField
                id="outlined-name"
                label="Full Name"
                variant="outlined"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    name: e.target.value,
                  }))
                }
                required
                fullWidth
              />
            </div>
            <div className="m-4 w-80">
              <TextField
                id="outlined-username"
                label="Email-Id"
                variant="outlined"
                value={userDetails.username}
                onChange={(e) =>
                  setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    username: e.target.value,
                  }))
                }
                required
                fullWidth
              />
            </div>
            <div className="m-4 w-80">
              <TextField
                id="outlined-locality"
                label="Locality"
                variant="outlined"
                value={userDetails.locality}
                onChange={(e) =>
                  setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    locality: e.target.value,
                  }))
                }
                required
                fullWidth
              />
            </div>
            <div className="m-4 w-80">
              <TextField
                id="outlined-address"
                label="Address"
                variant="outlined"
                value={userDetails.address}
                onChange={(e) =>
                  setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    address: e.target.value,
                  }))
                }
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
                value={userDetails.password}
                onChange={(e) =>
                  setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    password: e.target.value,
                  }))
                }
                required
                fullWidth
              />
            </div>
            <div className="m-4 w-80">
              <TextField
                id="outlined-number"
                label="Phone Number"
                variant="outlined"
                value={userDetails.phoneNumber}
                onChange={(e) =>
                  setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    phoneNumber: e.target.value,
                  }))
                }
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
