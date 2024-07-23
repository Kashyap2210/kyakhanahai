const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

app.options(
  "*",
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const sessionOptions = {
  secret: "keyboardcat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/food_store");
}

/* MODEL FOR THE DISH START */
const userFoodSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  type: String,
});

const User = mongoose.model("User", userFoodSchema);
/* MODEL FOR THE DISH END */

/* MODEL FOR THE USER STARTS*/
const websiteUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

websiteUserSchema.plugin(passportLocalMongoose, {});
const websiteUser = mongoose.model("websiteUser", websiteUserSchema);
/* MODEL FOR THE USER ENDS */

passport.use(new LocalStrategy(websiteUser.authenticate()));
passport.serializeUser(websiteUser.serializeUser());
passport.deserializeUser(websiteUser.deserializeUser());

// const ensureAuthenticated = (req, res, next) => {
//   console.log("User:", req.user); // Log user details to check if the user is authenticated
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res
//       .status(401)
//       .send({ message: "You must be logged in to access this resource" });
//   }
// };

// const isLoggedIn = (req, res, next) => {
//   console.log("You Are In isLoggedIn MDWARE");
//   console.log(req.body, "Current");
//   // console.log(req.path, "..", req.originalUrl, "1");
//   if (!req.isAuthenticated()) {
//     console.log(req.body, "In isLoggedIn");
//     console.log("Checking if user is logged in", "2");
//     // req.session.redirectUrl = req.originalUrl;
//     // req.flash("Error", "You Need To LogIn Before Adding A Listing");
//     return res.status(401).send({ message: "Please Login To Add Your Dish" });
//   }
// };

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

// app.get("/test", (req, res) => {
//   res.send("Test is successful");
// });

app.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// CHATGPT
app.post("/login", (req, res, next) => {
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

app.post("/signup", async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const existingUser = await websiteUser.findOne({ username });
    if (existingUser) {
      return res.status(409).send({ message: "User already registered" });
    }
    const newUser = new websiteUser({ username, name });
    await websiteUser.register(newUser, password);
    res.status(200).send({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred" });
  }
});

app.post("/adddish", isLoggedIn, async (req, res) => {
  console.log("request is recieved for adddish");
  const { name, category, type } = req.body;
  const lastDish = await User.findOne().sort({ _id: -1 });
  let newId;
  if (lastDish) {
    // console.log(lastDish.id);
    newId = lastDish.id + 1;
  } else {
    newId = 1;
  }
  console.log(newId);

  console.log("name=", name);
  console.log("category=", category);
  console.log("type=", type);
  let user = new User({
    id: newId,
    name: name,
    category: category,
    type: type,
  });
  if (category && name && type) {
    await user.save();
    res.status(200).send({ message: "Dish Added To DB" });
  } else {
    res.status(401).send({ message: "Improper Data" });
  }
});

app.get("/showdish", isLoggedIn, async (req, res) => {
  console.log("Inside /showdish route");
  console.log("User in /showdish:", req.user); // Check if user is available
  try {
    const dishes = await User.find({});
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

app.post("/deletedish", async (req, res) => {
  console.log("request is recieved for deletedish");
  const { id } = req.body;
  console.log("id=", id);
  try {
    await User.findOneAndDelete({ id: id });
    res.status(200).send("Dish Deleted");
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Unable to find Id" });
  }
});

app.get("/getdish", async (req, res) => {
  console.log("request is recieved for generating a random dish");
  try {
    const totalDishes = await User.countDocuments();
    console.log("Total No. Of Dishes = ", totalDishes);
    const randomDishNumber = Math.floor(Math.random() * totalDishes) + 1;
    console.log("Random Dish Number = ", randomDishNumber);
    const yourDish = await User.findOne().skip(randomDishNumber).limit(1);
    console.log(yourDish);
    res.status(200).send(yourDish);
    console.log("response sent");
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Unable to Generate Random DIsh" });
  }
});

app.post("/logout", (req, res, next) => {
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
