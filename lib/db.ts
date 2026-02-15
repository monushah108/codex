import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("database connected");
  } catch {
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit(0);
});
