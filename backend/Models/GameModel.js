const mongoose = require("mongoose");


const levelData = new mongoose.Schema({
    assets: [Object],
    savedEntities: [Object],
    levelData: Object 

})
const Game = new mongoose.Schema({
    name: String,
    by: String,
    token: String,
    date: String,
    id:String,
    shared:Boolean,
    gameData: levelData
})



module.exports = mongoose.model("Games", Game, "Games");