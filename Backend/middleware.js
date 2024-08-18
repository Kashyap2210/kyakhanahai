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

module.exports = isLoggedIn;
