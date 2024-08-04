import React, { useState, useRef, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UserProfileContext from "../Context/UserContext";

export default function Signup() {
  const { userDetails, setUserDetails } = useContext(UserProfileContext);

  if (!userDetails) {
    console.error("UserDetails is undefined");
    return null; // Handle undefined case or show an error message
  }

  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  // Function to handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Create a preview URL for the file
    }
  };

  // User details taken as state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (file) {
        event.preventDefault();
        try {
          await axios.delete("http://localhost:3000/api/delete-file", {
            data: { filePath: file.path },
          });
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [file]);

  const handleSubmit = async (e) => {
    console.log("Inside post request front-end, 1");
    e.preventDefault();

    const formData = new FormData();
    // Log to verify data being appended
    console.log("Appending form data:", {
      username: username || "N/A",
      password: password || "N/A",
      name: name || "N/A",
      address: address || "N/A",
      phoneNumber: phoneNumber || "N/A",
      file: file ? file.name : "No file",
    });

    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);
    if (file) {
      console.log("Appending file to formData:", file); // Add this
      formData.append("profilePic", file);
    }

    console.log(formData);
    try {
      console.log("FormData:", formData.get("profilePic")); // Add this for debugging

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
        console.log(response.data);
        const { username, name, address, phoneNumber, file } = response.data;
        // Update context with response data
        setUserDetails({
          username,
          name,
          address,
          phoneNumber,
          profilePic: file,
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
        <div className="flex flex-col  mb-4 items-center justify-center">
          {/* Container for Image Preview */}
          <div className="relative w-60 h-60 flex cursor-pointer items-center justify-center rounded-full">
            {/* Hidden File Input */}
            <input
              type="file"
              name="profilePic"
              ref={fileInputRef}
              className="absolute inset-0 opacity-0 cursor-pointer" // Hidden but clickable
              accept=".jpg, .png"
              onChange={handleFileChange}
            />
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              onClick={handleFileInputClick}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full" // Ensure 1:1 aspect ratio
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
