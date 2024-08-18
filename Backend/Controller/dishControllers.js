const Dish = require("../models/userFoodSchema");
require("dotenv").config(); //Use it to deal with Enviorment Variables
const express = require("express");
const app = express();

const multer = require("multer");

const axios = require("axios"); //Used to send async req to REST Endpoints

//Used for Authentication

const { storage } = require("./cloudConfig");

const Dish = require("./models/userFoodSchema.js");

const apiKey = process.env.GOOGLE_API_KEY;

module.exports.addDish = async (req, res) => {
  console.log("request is recieved for adddish");
  const { name, category, type } = req.body;
  const userId = req.user._id;

  const lastDish = await Dish.findOne({ userId }).sort({ _id: -1 });
  let newId;
  if (lastDish) {
    // console.log(lastDish.id);
    newId = lastDish.id + 1;
  } else {
    newId = 1;
  }
  console.log(newId, "newID");
  // console.log("name=", name);
  // console.log("category=", category);
  // console.log("type=", type);
  let dish = new Dish({
    id: newId,
    name: name,
    category: category,
    type: type,
    userId,
  });
  if (category && name && type) {
    await dish.save();
    res.status(200).send({ message: "Dish Added To DB" });
  } else {
    res.status(401).send({ message: "Improper Data" });
  }
};

module.exports.showDish = async (req, res) => {
  const userId = req.user._id;
  console.log("Inside /showdish route");
  console.log("User in /showdish:", req.user); // Check if user is available
  try {
    const dishes = await Dish.find({ userId });
    if (!res.headersSent) {
      res.status(200).json(dishes);
    }
  } catch (e) {
    console.error("Error retrieving dishes:", e);
    if (!res.headersSent) {
      res.status(500).send("Server Error");
    }
  }
};

module.exports.deleteDish = async (req, res) => {
  console.log("request is recieved for deletedish");
  const { id } = req.body;
  const userId = req.user._id;
  // console.log("id=", id);
  try {
    await Dish.findOneAndDelete({ id, userId });
    res.status(200).send("Dish Deleted");
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Unable to find Id" });
  }
};

module.exports.getDish = async (req, res) => {
  console.log("request is recieved for generating a random dish");
  const userId = req.user._id;
  try {
    const totalDishes = await Dish.countDocuments({ userId });
    console.log("Total No. Of Dishes = ", totalDishes);
    const randomDishNumber = Math.floor(Math.random() * totalDishes) + 1;
    console.log("Random Dish Number = ", randomDishNumber);
    const yourDish = await Dish.findOne({ userId })
      .skip(randomDishNumber)
      .limit(1);
    console.log(yourDish);
    res.status(200).send(yourDish);
    console.log("response sent");
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Unable to Generate Random DIsh" });
  }
};

module.exports.searchNearByRestaurants = async (req, res) => {
  console.log("Request recieved for knowing all the restaurants.");
  const { lat, lng, radius } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: radius,
          type: "restaurant",
          key: apiKey,
        },
        withCredentials: true,
      }
    );
    console.log("API Response:", response.data);
    res.json(response.data.results);
    // console.log(response.data.results);
    console.log("Restaurant data sent from endpoint to checkplaces");
    // console.log(response.data.geometry.location, 1);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};
