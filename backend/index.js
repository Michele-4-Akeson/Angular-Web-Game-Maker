/*
SERVER INITILIZATION:
*/

const express = require('express');
const app = express();
const cors = require("cors");
const http = require('http');
const httpServer = http.createServer(app);
const bodyParser = require('body-parser');  
const querystring = require('querystring'); 
const mongoose = require("mongoose");
require("dotenv/config"); // gives access to all values stored in .env file - used to store sensitive info that we don't want to display in public repo - use via: process.env.<name of value>


const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log("Server started and listing on Port: " + PORT)
});

const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200,
 }

 app.use(cors(corsOptions));
 app.use(express.json());
 app.use(bodyParser.json())




/*
Database Connection
*/

try{
    mongoose.connect(process.env.MONGO_DB_CONNECTION, ()=>{
        console.log(process.env.MONGO_DB_CONNECTION)
        console.log("Connected to mongoDB");
    })
} catch (error){
    console.log(error)
}


/*
EXPRESS ROUTERS
*/

const profileRoute = require("./Routes/profileRoute")
const gamesRoute = require("./Routes/GameRoute")


app.use("/profile", profileRoute);
app.use("/game", gamesRoute)




