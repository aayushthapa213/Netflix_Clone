import mongoose, { connect, mongo } from "mongoose";
import { ENV_VARS } from "./envVars.js";
import e from "express";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log("MongoDB Connected: " + conn.connection.host);
  } catch (error) {
    console.log("Error Connecting to MongoDB: " + error.message);
    process.exit(1);
  }
};
