const fs = require("fs");
const path = require("path");
const websiteUser = require("../models/user");
const passport = require("passport");

module.exports.checkAuthService = async (req) => {
  return req.isAuthenticated();
};

module.exports.temporaryProfilePicUploadService = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }
  return `/upload/${file.filename}`;
};

module.exports.deleteTemporaryProfilePicService = async (filePath) => {
  try {
    await fs.promises.unlink(path.join(__dirname, "..", filePath));
    return { message: "File deleted successfully" };
  } catch (err) {
    console.error("Error deleting file:", err);
    throw new Error("Internal server error");
  }
};

module.exports.signUpService = async (userData, file) => {
  const { username, password, name, address, phoneNumber, locality } = userData;
  const profilePic = file ? file.path : null;

  const existingUser = await websiteUser.findOne({ username });
  if (existingUser) {
    throw new Error("User already registered");
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

  await websiteUser.register(newUser, password);

  return newUser;
};

module.exports.logInService = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject(new Error("Invalid credentials"));
      }
      req.logIn(user, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(user);
      });
    })(req, res, next);
  });
};

module.exports.getUserDetailsService = async (userId) => {
  const user = await websiteUser.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports.logoutService = async (req) => {
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) {
        return reject(err);
      }
      req.session.destroy((err) => {
        if (err) {
          return reject(err);
        }
        resolve({ message: "Logout successful" });
      });
    });
  });
};

module.exports.deleteAccountService = async (userId) => {
  const userToBeDeleted = await websiteUser.findById(userId);
  if (!userToBeDeleted) {
    throw new Error("User not found");
  }
  await websiteUser.findByIdAndDelete(userId);
  return { message: "User Deleted" };
};
