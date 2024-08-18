const express = require("express");
const app = express();
const router = express.Router();
const wrapAsync = require("..wrapAsync.js");
const websiteUser = require("../models/user");
const { isLoggedIn } = require("../middleware.js");
const { storage } = require("..cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

