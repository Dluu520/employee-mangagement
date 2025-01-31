import mongoose from "mongoose";

// Define the type for the MongoDB URI
const URI: string | undefined = process.env.MONGO_URI;

// Function to establish a connection to the database
const connect = async (): Promise<void> => {
  // Get the current connection state
  const connectionState: number = mongoose.connection.readyState;

  // Check if already connected
  if (connectionState === 1) {
    console.log("Already connected to database");
    return;
  }

  // Check if connecting
  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }

  // If URI is not defined, throw an error
  if (!URI) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
  }

  // Try connecting to the database
  try {
    await mongoose.connect(URI, {
      dbName: "employee-management",
      bufferCommands: true,
    });
    console.log("Database connected.");
  } catch (err) {
    console.error("Error found: ", err);
    throw err; // Re-throw the error for further handling
  }
};

export default connect;
