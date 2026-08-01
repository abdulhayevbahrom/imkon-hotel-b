require("dotenv").config();

const crypto = require("node:crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Employee = require("../model/Employee");

const allSections = [
  "dashboard",
  "employees",
  "rooms",
  "guests",
  "guests-active",
  "guests-history",
  "guests-debtors",
  "attendance",
  "services",
  "hall-bookings",
  "expenses",
  "reports",
  "settings",
];

const seedOwner = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI sozlanmagan");

  const login = String(process.env.OWNER_LOGIN || "owner")
    .trim()
    .toLowerCase();
  const existing = await Employee.findOne({ login }).select("+password");
  const generatedPassword = existing
    ? ""
    : process.env.OWNER_PASSWORD || crypto.randomBytes(12).toString("base64url");

  const ownerData = {
    firstname: process.env.OWNER_FIRSTNAME || "Owner",
    lastname: process.env.OWNER_LASTNAME || "Admin",
    position: "owner",
    salary: 0,
    canLogin: true,
    login,
    sections: allSections,
    isActive: true,
  };

  if (existing) {
    Object.assign(existing, ownerData);
    if (process.env.OWNER_PASSWORD) {
      existing.password = await bcrypt.hash(process.env.OWNER_PASSWORD, 10);
      existing.tokenVersion = Number(existing.tokenVersion || 1) + 1;
      existing.refreshToken = "";
    }
    await existing.save();
    console.log(`OWNER_UPDATED login=${login}`);
    if (process.env.OWNER_PASSWORD) console.log("OWNER_PASSWORD_UPDATED=true");
    return;
  }

  await Employee.create({
    ...ownerData,
    password: await bcrypt.hash(generatedPassword, 10),
  });
  console.log(`OWNER_CREATED login=${login}`);
  console.log(`OWNER_PASSWORD=${generatedPassword}`);
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(seedOwner)
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error(`OWNER_SEED_ERROR=${error.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  });
