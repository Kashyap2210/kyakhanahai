const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const isLoggedIn = require("../middleware.js");
const authenticationController = require("../Controller/authenticationController.js");

router.get("/checkAuth", authenticationController.checkAuth);

router.post(
  "/upload",
  upload.single("profilePic"),
  authenticationController.temporaryProfilePicUpload
);

router.post(
  "/signup",
  upload.single("profilePic"),
  authenticationController.signUp
);

router.delete(
  "/delete-file",
  authenticationController.deleteTemporartProfilePic
);

router.post("/login", authenticationController.logIn);

router.get("/user", isLoggedIn, authenticationController.getUserDetailsFromDb);

router.post("/logout", isLoggedIn, authenticationController.logout);

router.delete("/deleteaccount", authenticationController.deleteAccount);

module.exports = router;
