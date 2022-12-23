const mongoose = require("mongoose");
const { stringify } = require("querystring");


const entity = new mongoose.Schema({
    name:String,
    tag:String,
    dynamic: Boolean,
    sizeMultiplyer:Number,
    boxCollider:Boolean,
    boxTrigger: Object,
    animation: Object,
    decorators: [Object]
})


const levelData = new mongoose.Schema({
    scale : Number,
    columns : Number,
    rows : Number,
    background : [entity],
    mainground : [entity],
    foreground : [entity]
})


const asset = new mongoose.Schema({
    id:String,
    url:String
})

const gameData = new mongoose.Schema({
    name:String,
    date: String,
    id:String,
    assets: [asset],
    savedEntities: [entity],
    levelData: levelData
    

})

const profileSchema = new mongoose.Schema({
    username: String,
    password: String,
    token: String,
    games: [gameData]
})



module.exports = mongoose.model("Profile", profileSchema, "Profiles");