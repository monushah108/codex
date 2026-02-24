import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to database");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("database connected");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit(0);
});
