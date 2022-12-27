const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    username: String,
    password: String,
    token: String,
})



module.exports = mongoose.model("Profile", profileSchema, "Profiles");