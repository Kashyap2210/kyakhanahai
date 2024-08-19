const fs = require("fs");
const path = require("path");
const passport = require("passport");
const websiteUser = require("../models/user");
require("dotenv").config(); //Use it to deal with Enviorment Variables
const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const authenticationServices = require("../Services/authenticationServices");

module.exports.checkAuth = async (req, res) => {
  try {
    const authenticated = await authenticationServices.checkAuthService(req);
    res.json({ authenticated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.temporaryProfilePicUpload = async (req, res) => {
  try {
    const filePath =
      await authenticationServices.temporaryProfilePicUploadService(req.file);
    res.status(200).json({ filePath });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.deleteTemporartProfilePic = async (req, res) => {
  try {
    const response =
      await authenticationServices.deleteTemporaryProfilePicService(
        req.body.filePath
      );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.signUp = async (req, res) => {
  try {
    const newUser = await authenticationServices.signUpService(
      req.body,
      req.file
    );
    const { email, username, name, profile, profilePic } = newUser;
    req.login(newUser, (err) => {
      if (err) {
        throw new Error("Login error");
      }
      res.status(200).json({
        email,
        username,
        name,
        address: profile.address,
        locality: profile.locality,
        phoneNumber: profile.phone,
        profilePic,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logIn = async (req, res, next) => {
  console.log("Request Recieved In The Backend For Logging In");
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const user = await authenticationServices.logInService(req, res, next);
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.getUserDetailsFromDb = async (req, res) => {
  try {
    const user = await authenticationServices.getUserDetailsService(
      req.user._id
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const response = await authenticationServices.logoutService(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteAccount = async (req, res) => {
  try {
    const response = await authenticationServices.deleteAccountService(
      req.body.userId
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
