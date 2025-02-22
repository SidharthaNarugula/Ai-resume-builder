const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/resumeBuilder", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

// Resume Schema
const ResumeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    jobTitle: String,
    skills: [String],
    experience: String,
    education: String,
    formattedResume: String,
    analytics: {
        applicationsSent: Number,
        interviewsScheduled: Number,
        recruiterViews: Number
    }
});
const Resume = mongoose.model("Resume", ResumeSchema);

// Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// 🔹 **1. AI-Assisted Job Description Matching**
app.post("/match-job", async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        const response = await axios.post("http://localhost:5001/match-job", {
            resumeText,
            jobDescription
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Error in AI matching" });
    }
});

// 🔹 **2. Automated Resume Formatting**
app.post("/format-resume", async (req, res) => {
    try {
        const { resumeText, careerGoal } = req.body;
        const response = await axios.post("http://localhost:5001/format-resume", {
            resumeText,
            careerGoal
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Error formatting resume" });
    }
});

// 🔹 **3. Analytics Dashboard**
app.get("/analytics/:id", async (req, res) => {
    try {
        const user = await Resume.findById(req.params.id);
        res.json(user.analytics);
    } catch (err) {
        res.status(500).json({ error: "Error fetching analytics" });
    }
});

// 🔹 **4. Recruiter Portal - View Candidates**
app.get("/recruiter/candidates", async (req, res) => {
    try {
        const candidates = await Resume.find();
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ error: "Error fetching candidates" });
    }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
