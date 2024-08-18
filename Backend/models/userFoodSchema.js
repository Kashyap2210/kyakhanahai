const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

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

module.exports = Dish;
