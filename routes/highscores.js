const express = require("express");
const HighScore = require("../models/HighScore");
const requireAuth = require("../Middleware/requireAuth");

const router = express.Router();

//All routes below will require authentication
router.use(requireAuth);

//Post route for adding player scores
router.post("/", async (req, res)=>{
    try{

        const userId = req.user.sub;
        const {playername, score, level} = req.body;

        const createdScore = await HighScore.create({userId, playername, score, level});

        res.status(201).json({ok:true, createdScore});

    }catch(err){
        res.status(400).json({ok:false, error:"Invalid High Score"});
    }
});

//Get route for requesting data from database
router.get("/highscores", async (req, res)=>{
    try{
        const userId = req.user.sub;
        const scores = await HighScore.find({userId})
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
        const userId = req.user.sub;
        const{id} = req.params;
        const deleted = await HighScore.findOneAndDelete({_id: id, userId});

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
        const score = await HighScore.findById({_id: req.params.id, userId});

        if(!score){
            return res.status(404).json({ok:false, error:"Score not found"});
        }
        res.json(score);
    } catch{
        res.status(400).json({ok:false, error:"Invalid Score ID"});
    }
});

//next week need to add put route for editing scores

router.put("/:id", async (req,res)=>{
    try{
        const userId = req.user.sub;
        //Update highscore entry
        const {id} = req.params;

        //Only allow expected fields to be updated
        const payload = {};
        if(typeof req.body.playername === "string")
        {
            payload.playername = req.body.playername;
        }

        if(typeof req.body.score === "number")
        {
            payload.score = req.body.score;
        }

        if(typeof req.body.level === "number")
        {
            payload.level = req.body.level;
        }

        const updateEntry = await HighScore.findByIdAndUpdate({_id: id, userId}, payload, {
            new:true, 
            runValidators:true});

            if(!updateEntry)
            {
                return res.status(404).json({ok:false, error:"Score Entry Not Found"});
            }
            res.json({ok:true, updateEntry});
            //res.redirect("api/highscores");
    }
    catch(err)
    {
       res.status(400).json({ok:false, error:"Update Failed"});
    }
});

module.exports = router;