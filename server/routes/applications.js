const express = require("express");
const JobApplication = require("../models/JobApplication");

const router = express.Router();

// Get all job applications that belong to the logged-in user
router.get("/", async (req, res) => {
  try {
    const applications = await JobApplication.find({
      user: req.userId,
    }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Could not load applications." });
  }
});

// Add a job application for the logged-in user
router.post("/", async (req, res) => {
  try {
    const { user, _id, ...data } = req.body;
    const application = await JobApplication.create({
      ...data,
      user: req.userId,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one of the logged-in user's applications
router.put("/:id", async (req, res) => {
  try {
    const { user, _id, ...changes } = req.body;
    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      changes,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete one of the logged-in user's applications
router.delete("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json({ message: "Application deleted." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;