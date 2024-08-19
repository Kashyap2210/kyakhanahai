const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;

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

passport.use(new LocalStrategy(websiteUser.authenticate()));

passport.serializeUser((user, done) => {
  done(null, user.id); // Save user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await websiteUser.findById(id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = websiteUser;
