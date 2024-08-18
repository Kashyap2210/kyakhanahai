require("dotenv").config(); //Use it to deal with Enviorment Variables
const express = require("express");
const app = express();
const cors = require("cors"); //Mechanism to send req from frontend to backend
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const axios = require("axios"); //Used to send async req to REST Endpoints

//Used for Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");

const { storage } = require("./cloudConfig");
const upload = multer({ storage });
const websiteUser = require("./models/user.js");
const Dish = require("./models/userFoodSchema.js");
const connectDB = require("./db.js");

const isLoggedIn = require("./middleware.js");

const apiKey = process.env.GOOGLE_API_KEY;
console.log(dbUrl);

async function connectToDB() {
  console.log("Connect To DB Called");
  await connectDB();
  console.log("After connection");
}

connectToDB();

//Middleware For CORS that accepts below mentione requests
const allowedOrigins = [
  "http://localhost:5173",
  "https://kyakhanahai.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("Error in the MONGO SESSION STORE.", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //To Prevent Cross_Scripting Attacks
  },
};

app.use(session(sessionOptions));
app.use(cookieParser("asdfghjkl"));

//Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const authenticationController = require("./Controller/authenticationController.js");
const temporaryProfilePicUpload = require("./Controller/authenticationController.js");
const signUp = require("./Controller/authenticationController.js");
const logIn = require("./Controller/authenticationController.js");
const getUserDetailsFromDb = require("./Controller/authenticationController.js");

// This middleware check whether the user is logged In or not so that Navbar can be rendered Accordingly.
app.get("/api/checkAuth", authenticationController);

app.post("/api/upload", upload.single("profilePic"), temporaryProfilePicUpload);

// Signup route
app.post("/api/signup", upload.single("profilePic"), signUp);

app.delete("/delete-file", async (req, res) => {
  const filePath = req.body.filePath;
  fs.unlink(path.join(__dirname, "..", filePath), (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
});

// This is an endpoint for logging in the user
app.post("/api/login", logIn);

app.get("/api/user", isLoggedIn, getUserDetailsFromDb);

// This is an endpoint to add dish to DB and store it with Specific user details.
app.post("/api/adddish", isLoggedIn, async (req, res) => {
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
});

// This is an endpoint to show all the dishes that user has stored in the DB
app.get("/api/showdish", isLoggedIn, async (req, res) => {
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
});

// This is an endpoint for deleting a dish
app.post("/api/deletedish", async (req, res) => {
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
});

// This is an endpoint to generate a random dish
app.get("/api/getdish", isLoggedIn, async (req, res) => {
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
});

// This is an endpoint to get nearby restaurants using PLACE API
app.get("/api/getNearbyRestaurants", isLoggedIn, async (req, res) => {
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
});

// This is an endpoint to logout the user
app.post("/api/logout", (req, res, next) => {
  console.log("Logout Request Recieved In Backeng");
  req.logout((err) => {
    if (err) {
      console.log("Error during logout:", err);
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session:", err);
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.status(200).send({ message: "Logout successful" });
      console.log("User Logged Out");
    });
  });
});

//This is an endpoint to DELETE user
app.delete("/api/deleteaccount", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const userToBeDeleted = await websiteUser.findById(userId);
    console.log(userToBeDeleted);
    if (!userToBeDeleted) {
      return res.status(404).send("User not found");
    }
    await websiteUser.findByIdAndDelete(userId);
    res.status(200).send("User Deleted");
    console.log("Account Deleted, Response Sent");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("An error occurred");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
