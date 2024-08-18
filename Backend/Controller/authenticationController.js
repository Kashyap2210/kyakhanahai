const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports.index = async (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
};

module.exports.temporaryProfilePicUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).json({ filePath: `/upload/${req.file.filename}` });
};

module.exports.signUp = async (req, res) => {
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
};

module.exports.logIn = async (req, res, next) => {
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
};

module.exports.getUserDetailsFromDb = async (req, res) => {
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
};
