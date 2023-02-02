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
router.put("/attributes", async function(req, res){
    try{
        console.log("PUT/game/attributes REQUEST CALLED");
        const gameID = req.body.gameID;
        const gameAttributes = req.body.gameAttributes
        console.log(gameID, gameAttributes)
        const updateResult = await games.updateOne({token:gameID.token, id:gameID.id, name:gameID.name}, 
            {$set:{"gameData.levelData.scale":gameAttributes.scale, "gameData.LevelData.columns":gameAttributes.columns,  "gameData.LevelData.rows":gameAttributes.rows}});

        console.log(updateResult)
        res.json({success:updateResult.modifiedCount != 0});
        

    } catch (error){
        console.log(error);
    }

})


/**
 * updates a given game in the game collection with a new set of 
 * data, based on the name, token, and id of the game
 */
router.put("/assets", async function(req, res){
    try{
        console.log("PUT/game/assets REQUEST CALLED");
        const gameID = req.body.gameID;
        const gameAssets = req.body.gameAssets
        console.log(gameID, gameAssets)
        const updateResult = await games.updateOne({token:gameID.token, id:gameID.id, name:gameID.name}, 
            {$set:{"gameData.assets":gameAssets.assets, "gameData.savedEntities":gameAssets.savedEntities}})

        console.log(updateResult)
        res.json({success:updateResult.modifiedCount != 0});
        

    } catch (error){
        console.log(error);
    }

})


/**
 * updates a given game in the game collection with a new set of 
 * data, based on the name, token, and id of the game
 */
router.put("/layer", async function(req, res){
    try{
        console.log("PUT/game/layer REQUEST CALLED");
        const gameID = req.body.gameID;
        const gamelayer = req.body.layer
        const target = req.body.target
        console.log(gameID, target)

        if (target == "background") {
            const updateResult = await games.updateOne({token:gameID.token, id:gameID.id, name:gameID.name}, {$set:{"gameData.levelData.background": gamelayer}})
            console.log(updateResult)
            res.json({success:updateResult.modifiedCount != 0});
        } else {
            const updateResult = await games.updateOne({token:gameID.token, id:gameID.id, name:gameID.name}, {$set:{"gameData.levelData.mainground": gamelayer}})
            console.log(updateResult)
            res.json({success:updateResult.modifiedCount != 0});
        }

       
       
        

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
        res.json({success:updateResult.modifiedCount != 0});
        

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