const express = require("express");
const app = express();
const router = express.Router();
const Dish = require("../models/userFoodSchema.js");
const isLoggedIn = require("../middleware.js");

const dishControllers = require("../Controller/dishControllers.js");

app.post("/adddish", isLoggedIn, dishControllers.addDish);

// This is an endpoint to show all the dishes that user has stored in the DB
app.get("/showdish", isLoggedIn, dishControllers.showDish);

// This is an endpoint for deleting a dish
app.post("/deletedish", isLoggedIn, dishControllers.deleteDish);

// This is an endpoint to generate a random dish
app.get("/getdish", isLoggedIn, dishControllers.getDish);

// This is an endpoint to get nearby restaurants using PLACE API
app.get(
  "/getNearbyRestaurants",
  isLoggedIn,
  dishControllers.searchNearByRestaurants
);

module.exports = router;
