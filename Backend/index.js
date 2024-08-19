require("dotenv").config(); //Use it to deal with Enviorment Variables
const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const cors = require("cors"); //Mechanism to send req from frontend to backend
const bodyParser = require("body-parser");
const multer = require("multer");
const axios = require("axios"); //Used to send async req to REST Endpoints
const authenticationRoutes = require("./routes/authenticationRoutes.js");
const dishRoutes = require("./routes/dishRoutes.js");
const cookieParser = require("cookie-parser");

//Used for Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");

const { storage } = require("./cloudConfig");
const upload = multer({ storage });

const connectDB = require("./db.js");
const websiteUser = require("./models/user.js");

const dbUrl = process.env.ATLAS_DB_URL;
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
passport.use(new LocalStrategy(websiteUser.authenticate()));
passport.serializeUser(websiteUser.serializeUser());
passport.deserializeUser(websiteUser.deserializeUser());

app.use("/api/authenticate", authenticationRoutes);
app.use("/api/dish", dishRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
