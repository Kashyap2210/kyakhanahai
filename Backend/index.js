require("dotenv").config(); //Use it to deal with Enviorment Variables
const express = require("express");
const app = express();
const cors = require("cors"); //Mechanism to send req from frontend to backend
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); //Connects backend to MongoDB
const multer = require("multer");
const path = require("path");

//Used for Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const axios = require("axios"); //Used to send async req to REST Endpoints

const { storage } = require("./cloudConfig");
const upload = multer({ storage });

const apiKey = process.env.GOOGLE_API_KEY;
const dbUrl = process.env.ATLAS_DB_URL;

console.log(dbUrl);

//Method to connect Backend Server to MongoDB
// main()
//   .then(() => {
//     console.log("Connection Successful");
//   })
//   .catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect(dbUrl);
// }

// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "http://localhost:5173",
//     "https://kyakhanahai-frontend.onrender.com"
//   ); // Replace "*" with allowedOrigins for better security
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

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

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const connection = mongoose.createConnection(dbUrl);

const sessionStore = MongoStore.create({
  client: mongoose.connection.getClient(),
  collection: "session",
});

app.use(
  session({
    secret: "Your secret here",
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
  })
);

sessionStore.on("error", function (error) {
  console.log("Session store error:", error);
});
//Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

/* MODEL FOR THE DISH START */
const userFoodSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  type: String,

  //It stores users data so that each dish can be associated to a user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WebsiteUser",
    required: true,
  },
});

const Dish = mongoose.model("Dish", userFoodSchema);
/* MODEL FOR THE DISH END */

/* MODEL FOR THE USER STARTS*/
const websiteUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profile: {
    address: { type: String },
    locality: { type: String },
    phone: { type: String },
  },
  profilePic: { type: String },
});

websiteUserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const websiteUser = mongoose.model("websiteUser", websiteUserSchema);
/* MODEL FOR THE USER ENDS */

passport.use(new LocalStrategy(websiteUser.authenticate()));

// Serializing & Deserializing Middlewares
// They help data to be stored and transferred
passport.serializeUser((user, done) => {
  done(null, user.id); // Save user ID in the session
});

passport.deserializeUser((id, done) => {
  websiteUser.findById(id, (err, user) => {
    done(err, user); // Attach user object to req.user
  });
});

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_${file.originalname}`); // Append the file extension
//   },
// });

// Middleware to check if the user is authenticated or not. This middleware is used to check actual users information for authentication.
const isLoggedIn = (req, res, next) => {
  console.log("isLoggedIn middleware triggered");
  console.log("User:", req.user); // Check if the user object is populated
  if (!req.isAuthenticated()) {
    console.log("User not authenticated, sending 401 response");
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log("User authenticated, proceeding to next middleware");
  next();
};

// This middleware check whether the user is logged In or not so that Navbar can be rendered Accordingly.
app.get("/api/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

app.post("/api/upload", upload.single("profilePic"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).json({ filePath: `/upload/${req.file.filename}` });
});

// Signup route
app.post("/api/signup", upload.single("profilePic"), async (req, res) => {
  const { username, password, name, address, phoneNumber, locality } = req.body;
  const profilePic = req.file ? req.file.path : null;
  console.log(req.file);
  console.log(profilePic);
  try {
    const existingUser = await websiteUser.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const newUser = new websiteUser({
      email: username,
      username,
      name,
      profile: {
        address,
        locality,
        phone: phoneNumber,
      },
      profilePic,
    });

    try {
      await websiteUser.register(newUser, password);
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ message: "Signup failed" });
    }
    // Authenticate the user
    req.login(newUser, (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Login error" });
      }
      const { email, username, name, profile, profilePic } = newUser;
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
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup error" });
  }
});

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
app.post("/api/login", (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password are defined
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  console.log("Log In Request Recieved At Backend");
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      res.status(200).send({ message: "Login successful" });
    });
  })(req, res, next);
  console.log("User Successfully Logged In");
});

app.get("/api/user", isLoggedIn, async (req, res) => {
  try {
    // Assuming user ID is stored in session or token
    const userId = req.user._id; // Example: req.user is set by authentication middleware
    const user = await websiteUser.findById(userId).select("-password"); // Exclude password from response
    
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred" });
  }
});

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
