require("dotenv").config(); //Use it to deal with Enviorment Variables
const express = require("express");
const app = express();
const cors = require("cors"); //Mechanism to send req from frontend to backend
const bodyParser = require("body-parser");
const multer = require("multer");

const axios = require("axios"); //Used to send async req to REST Endpoints

//Used for Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");

const { storage } = require("./cloudConfig");
const upload = multer({ storage });
// const websiteUser = require("./models/user.js");
// const Dish = require("./models/userFoodSchema.js");
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
const deleteTemporartProfilePic = require("./Controller/authenticationController.js");
const signUp = require("./Controller/authenticationController.js");
const logIn = require("./Controller/authenticationController.js");
const getUserDetailsFromDb = require("./Controller/authenticationController.js");
const logout = require("./Controller/authenticationController.js");

const addDish = require("./Controller/dishControllers.js");
const showDish = require("./Controller/dishControllers.js");
const deleteDish = require("./Controller/dishControllers.js");
const getDish = require("./Controller/dishControllers.js");
const searchNearByRestaurants = require("./Controller/dishControllers.js");

// This middleware check whether the user is logged In or not so that Navbar can be rendered Accordingly.
app.get("/api/checkAuth", authenticationController);

app.post("/api/upload", upload.single("profilePic"), temporaryProfilePicUpload);

// Signup route
app.post("/api/signup", upload.single("profilePic"), signUp);

app.delete("/delete-file", deleteTemporartProfilePic);

// This is an endpoint for logging in the user
app.post("/api/login", logIn);

app.get("/api/user", isLoggedIn, getUserDetailsFromDb);

// This is an endpoint to add dish to DB and store it with Specific user details.
app.post("/api/adddish", isLoggedIn, addDish);

// This is an endpoint to show all the dishes that user has stored in the DB
app.get("/api/showdish", isLoggedIn, showDish);

// This is an endpoint for deleting a dish
app.post("/api/deletedish", deleteDish);

// This is an endpoint to generate a random dish
app.get("/api/getdish", isLoggedIn, getDish);

// This is an endpoint to get nearby restaurants using PLACE API
app.get("/api/getNearbyRestaurants", isLoggedIn, searchNearByRestaurants);

// This is an endpoint to logout the user
app.post("/api/logout", logout);

//This is an endpoint to DELETE user
app.delete("/api/deleteaccount", deleteAccount);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
