const express = require("express");
const HighScore = require("../models/HighScore");

const router = express.Router();

//Post route for adding player scores
router.post("/", async (req, res)=>{
    try{
        const {playername, score, level} = req.body;

        const createdScore = await HighScore.create({playername, score, level});

        res.status(201).json({ok:true, createdScore});

    }catch(err){
        res.status(400).json({ok:false, error:"Invalid High Score"});
    }
});

//Get route for requesting data from database
router.get("/highscores", async (req, res)=>{
    try{
        const scores = await HighScore.find()
        .sort({score:-1, createdAt:1})
        .limit(10);
        res.json(scores);
    }catch(err){
        res.status(500).json({ok:false, error:"Failed to fetch High Scores"});
    }
});

//Delete route(deletes by ID)
router.delete("/:id", async (req,res)=>{
    try{
        const{id} = req.params;
        const deleted = await HighScore.findByIdAndDelete(id);

        if(!deleted){
            return res.status(404).json({ok:false, error:"Score not found!"})
        }

        res.json({ok:true, deletedId:id});

    }catch(err){
        res.status(400).json({ok:false, error:"Delete failed!"});
    }
});

//get route for edit page
router.get("/:id", async (req,res)=>{
    try {
        const score = await HighScore.findById(req.params.id);

        if(!score){
            return res.status(404).json({ok:false, error:"Score not found"});
        }
        res.json(score);
    } catch{
        res.status(400).json({ok:false, error:"Invalid Score ID"});
    }
});

//next week need to add put route for editing scores

module.exports = router;