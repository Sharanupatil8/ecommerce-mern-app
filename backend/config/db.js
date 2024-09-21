import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo db connected connection host ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
