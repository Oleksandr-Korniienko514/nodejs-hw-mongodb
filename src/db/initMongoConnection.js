import mongoose from "mongoose";
import { env } from "../utils/env.js";

export const initMongoConnection = async () => {
  try {
    const url = env("MONGODB_URL");
    const db = env("MONGODB_DB");
    const user = env("MONGODB_USER");
    const pwd = env("MONGODB_PASSWORD");

    console.log("Connecting to MongoDB...");

    await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}`);

    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.log(`Error while setting up mongo connection", ${error.message}`);
    throw error;
  }
};
