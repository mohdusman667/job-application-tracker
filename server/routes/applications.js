const express = require("express");
const JobApplication = require("../models/JobApplication");

const router = express.Router();

// Get all job applications
router.get("/", async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Could not load applications." });
  }
});

// Add a job application
router.post("/", async (req, res) => {
  try {
    const application = await JobApplication.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Update a job application
router.put("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// Delete a job application
router.delete("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.json({ message: "Application deleted." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;