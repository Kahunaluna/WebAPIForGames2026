const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const highScoreRoutes = require("./routes/highscores");
const authRoutes = require("./routes/auth");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/highscores", highScoreRoutes);

if (!MONGO_URI) {
    console.error("Missing Database Connection - check your .env file");
    process.exit(1);
}

async function connectToMongo() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.error("MongoDB connection error: ", error.message);
        process.exit(1);
    }
}

// Page routes
app.get("/",         (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/mostwins", (req, res) => res.sendFile(path.join(__dirname, "public", "mostwins.html")));
app.get("/edit",     (req, res) => res.sendFile(path.join(__dirname, "public", "editplayer.html")));

connectToMongo().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});