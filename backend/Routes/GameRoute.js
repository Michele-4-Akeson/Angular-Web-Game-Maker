require("dotenv/config"); 
const express = require("express");
const router = express.Router();
const games = require("../Models/GameModel")

router.get("/", async function(req, res){
    try{
        console.log("GET/games Called")
        const queryToken = req.query.token
        const queryUsername = req.query.username;
        
        const result = await games.find({creator:queryUsername, token:queryToken})

        res.json(result)

    } catch (error){
        console.log(error)
    }

})


router.get("/shared", async function(req, res){
    try{
        console.log("GET/games/shared Called")
        
        const result = await games.find({shared:true})

        res.json(result)

    } catch (error){
        console.log(error)
    }

})


/**
 * adds a game to the games collection, initially as a private game
 */
router.post("/", async function(req, res){
    try{
        console.log("POST/game REQUEST CALLED");
        const name = req.body.name
        const by = req.body.by
        const token = req.body.token
        const date = req.body.date
        const id = req.body.id
        const shared = req.body.shared
        const levelData = req.body.levelData
        const updateResult = await games.create({name, by, token, date, id, shared, gameData:levelData});

        console.log(updateResult)
        console.log("New game created\n", createResult)
        res.json({success:true});
        

    } catch (error){
        console.log(error);
        res.json({success:true});

    }
    

})

/**
 * updates a given game in the game collection with a new set of 
 * data, based on the name, token, and id of the game
 */
router.put("/", async function(req, res){
    try{
        console.log("PUT/game REQUEST CALLED");
        const gameData = req.body.gameData;
        console.log(gameData.token, gameData.id, gameData.name)
        const updateResult = await games.replaceOne({token:gameData.token, id:gameData.id, name:gameData.name}, gameData);

        console.log(updateResult)
        res.json({success:updateResult.modifiedCount == 1});
        

    } catch (error){
        console.log(error);
    }

})


router.put("/shared", async function(req, res){
    try{
        console.log("PUT/game/shared REQUEST CALLED");
        const name = req.body.name
        const id = req.body.id
        const token = req.body.token
        const shared = req.body.shared
    
        const updateResult = await games.updateOne({name:name, id:id, token:token}, {$set:{shared:shared}})

        console.log(updateResult)
        res.json({success:updateResult.modifiedCount == 1});
        

    } catch (error){
        console.log(error);
    }
})


/**
 * deletes a game from the game collection based on the name, token,
 * and id provided
 */
router.delete("/", async function(req, res){
    try{
        console.log("DELETE/game REQUEST CALLED");
        const token = req.body.token
        const name = req.body.name
        const id = req.body.id;
        const updateResult = await games.deleteOne({id:id, token:token})
        res.json({success:updateResult});
        
    } catch (error){
        console.log(error);
    }

})




module.exports = router;