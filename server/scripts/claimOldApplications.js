require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const JobApplication = require("../models/JobApplication");

async function main() {
  const email = String(process.argv[2] || "").trim().toLowerCase();

  if (!email) {
    console.log("Usage: node scripts/claimOldApplications.js your@email.com");
    return;
  }

  await mongoose.connect(process.env.MONGO_URI, { family: 4 });

  const user = await User.findOne({ email });
  if (!user) {
    console.log(`No account found for ${email}. Check the email and try again.`);
    return;
  }

  const result = await JobApplication.updateMany(
    { user: { $exists: false } },
    { $set: { user: user._id } }
  );

  console.log(`Done. ${result.modifiedCount} old application(s) now belong to ${email}.`);
}

main()
  .catch((error) => console.error("Script failed:", error.message))
  .finally(() => mongoose.disconnect());