import dotenv from 'dotenv';
dotenv.config(); 

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Successfully Connected");
  } catch (err) {
    console.log("Error occurred: ", err);
    process.exit(1);
  }
};

export default connectDB;