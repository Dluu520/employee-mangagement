import connect from "@/app/lib/db"; // Importing the database connection utility
import User from "@/app/lib/modals/user"; // Importing the User model
import { NextRequest, NextResponse } from "next/server"; // Importing types for the request and response in Next.js API routes
import { Types } from "mongoose"; // Importing Types from mongoose for handling MongoDB types

// this checks validation of ObjectID through mongoDb's auto generation of objectID
const ObjectId = require("mongoose").Types.ObjectId;

// GET request to fetch all users
export const GET = async () => {
  try {
    // Connect to the database
    await connect();
    // Fetch all users from the database
    const users = await User.find();
    // Return the list of users in the response
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    console.log("Error in fetching users " + error.message, { status: 500 });
  }
  // Default response in case of any error
  return new NextResponse("This is my first api.");
};

// POST request to create a new user
export const POST = async (request: NextRequest) => {
  try {
    // Get the request body (user data)
    const body = await request.json();
    console.log(body);
    // Connect to the database
    await connect();
    // Create a new User instance with the received data
    const newUser = new User(body);
    // Save the new user to the database
    await newUser.save();
    // Return a success response with the new user data
    return new NextResponse(
      JSON.stringify({ message: "User is created: ", user: newUser }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error in creating users " + error.message, { status: 500 });
  }
};

// PATCH request to update an existing user
export const PATCH = async (request: NextRequest) => {
  try {
    // Get the request body with the user's ID and the updated data
    const body = await request.json();
    const { userId, newUserName, newUserEmail, newUserPassword } = body;
    // Connect to the database
    await connect();

    // Validate if userId or newUserName is not provided
    if (!userId || !newUserName) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new username not found" }),
        { status: 400 }
      );
    }

    // Validate if the provided userId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user Id" }), {
        status: 400,
      });
    }

    // Proceed to find the user and update the data
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: new ObjectId(userId), // Ensure the userId is valid as a MongoDB ObjectId
      },
      { username: newUserName, password: newUserPassword, email: newUserEmail },
      { new: true } // 'new: true' ensures we get the updated user object
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in database" }),
        {
          status: 400,
        }
      );
    }

    // Return a success response with the updated user data
    return new NextResponse(
      JSON.stringify({ message: "user is updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error in updating users" + error.message, { status: 500 });
  }
};

// DELETE request to delete a user
export const DELETE = async (request: NextRequest) => {
  try {
    // Extract the userId from the query parameters of the request URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Validate if userId exists in the request URL
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Cannot find user Id" }),
        { status: 400 }
      );
    }

    // Validate if the provided userId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user Id" }), {
        status: 400,
      });
    }

    // Connect to the database
    await connect();

    // Attempt to find and delete the user by their ObjectId
    const deletedUsers = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    // If no user is found or deleted, return an error
    if (!deletedUsers) {
      return new NextResponse(
        JSON.stringify({
          message: "Error while deleting user. User not found.",
        }),
        { status: 400 }
      );
    }

    // Return a success response with the deleted user data
    return new NextResponse(
      JSON.stringify({ message: "user is deleted", user: deletedUsers }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("Error in deleting users " + error.message, { status: 500 });
  }
};
