const mongoose = require("mongoose");


const publishedGameSchema = new mongoose.Schema({
    name: String,
    creator: String,
    token: String,
    data:Object
})



module.exports = mongoose.model("PublishedGames", publishedGameSchema, "PublishedGames");