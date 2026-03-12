const express = require("express");
const router = express.Router();
const HighScore = require("../models/HighScore");
const requireAuth = require("../Middleware/requireAuth");

router.get("/", async (req, res) => {
    try {
        const scores = await HighScore.find().sort({ score: -1 });
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/top-wins", async (req, res) => {
    try {
        const topPlayers = await HighScore.find().sort({ wins: -1 }).limit(10);
        res.json(topPlayers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const entry = await HighScore.findById(req.params.id);
        if (!entry) return res.status(404).json({ error: "Player not found" });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    const { player, score, wins, losses, gamesPlayed, game } = req.body;
    if (!player) return res.status(400).json({ error: "Player name is required" });
    try {
        const entry = await HighScore.create({
            player,
            score:       score       ?? 0,
            wins:        wins        ?? 0,
            losses:      losses      ?? 0,
            gamesPlayed: gamesPlayed ?? 1,
            game:        game        ?? "Unity Game"
        });
        res.status(201).json({ ok: true, entry });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updated = await HighScore.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: "Player not found" });
        res.json({ ok: true, updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deleted = await HighScore.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Player not found" });
        res.json({ ok: true, message: "Player deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;