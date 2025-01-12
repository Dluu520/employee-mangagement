// First step in rest API after establishing api is working under /api/(auth)/users
// we created a database under mongodb and set up .env file with URI
import mongoose, { connection, connections } from "mongoose";
//install mongoose package
const URI = process.env.MONGO_URI;
// grab the URI from .env that has the connection to our database

// establish connection
const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected to database");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }
  //  if all the fail connection checks has passed then try connecting
  try {
    mongoose.connect(URI!, {
      dbName: "employee-management",
      bufferCommands: true,
    });
    console.log("Database connected.");
  } catch (err: any) {
    console.log("Error found: ", err);
  }
};

export default connect;
