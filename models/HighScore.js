const mongoose = require("mongoose");

const highScoreSchema = new mongoose.Schema({
    player:     { type: String, required: true },
    score:      { type: Number, required: true, default: 0 },
    wins:       { type: Number, default: 0 },
    losses:     { type: Number, default: 0 },
    gamesPlayed:{ type: Number, default: 0 },
    game:       { type: String, default: "Unity Game" },
    createdAt:  { type: Date, default: Date.now },
    updatedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model("HighScore", highScoreSchema);