import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB is connected");
  } catch (error) {
    console.log(`DB is not Connected because of ${error}`);
  }
};

export default ConnectDB;
