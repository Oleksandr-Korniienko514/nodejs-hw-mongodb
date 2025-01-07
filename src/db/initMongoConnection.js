import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoConnection = async () => {
  try {
    const url = getEnvVar("MONGODB_URL");
    const db = getEnvVar("MONGODB_DB");
    const user = getEnvVar("MONGODB_USER");
    const pwd = getEnvVar("MONGODB_PASSWORD");

    console.log("Connecting to MongoDB...");

    await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}`);

    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.log(`Error while setting up mongo connection", ${error.message}`);
    throw error;
  }
};
