require("dotenv").config(); //Use it to deal with Enviorment Variables
const express = require("express");
const app = express();
const cors = require("cors"); //Mechanism to send req from frontend to backend
const multer = require("multer");
const { storage } = require("./cloudConfig");
const upload = multer({ storage });
const isLoggedIn = require("./middleware.js");
const authenticationController = require("./Controller/authenticationController.js");

app.get("/api/checkAuth", authenticationController.checkAuth);

app.post(
  "/api/upload",
  upload.single("profilePic"),
  authenticationController.temporaryProfilePicUpload
);

// Signup route
app.post(
  "/api/signup",
  upload.single("profilePic"),
  authenticationController.signUp
);

app.delete("/delete-file", authenticationController.deleteTemporartProfilePic);

// This is an endpoint for logging in the user
app.post("/api/login", authenticationController.logIn);

app.get("/api/user", isLoggedIn, authenticationController.getUserDetailsFromDb);

app.post("/api/logout", isLoggedIn, authenticationController.logout);

//This is an endpoint to DELETE user
app.delete("/api/deleteaccount", authenticationController.deleteAccount);
