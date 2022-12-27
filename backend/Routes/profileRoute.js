require("dotenv/config"); 
const express = require("express");
const router = express.Router();
const Profile = require("../Models/profileModel")

/*
returns array of token associated with profile
*/
router.get("/token", async function(req, res){
    
    try{
        console.log("GET/Profile/token Called")
        const queryUsername = req.query.username;
        const queryPassword = req.query.password;
        
        const result = await Profile.findOne({username:queryUsername, password:queryPassword})

        res.json(result)

    } catch (error){
        console.log(error)
    }
})







/*
searches database for profile with mathcing username; if no duplicate username exsists, then 
profile is created in database
*/
router.post("/", async function(req, res){
    try {
        console.log("POST/Profile CALLED");
        const username = req.body.username;
        const password = req.body.password;
        const token = req.body.token;
        const searchResult = await Profile.findOne({username:username});

        if (searchResult == null){
            const createResult = await Profile.create({username:username, password:password, token:token})
            console.log("New profile created\n", createResult)
            res.json({success:true});
        } else{
            console.log("Profile already exsists");
            res.json({success:false});
        }


        
       
    } catch (error){
        console.log(error);
    }


})






module.exports = router;