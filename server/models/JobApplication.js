const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
       user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
     required: true,
     index: true,
   },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected", "Withdrawn"],
      default: "Applied",
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    followUpDate: {
  type: Date,
  default: null,
},
    jobUrl: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);