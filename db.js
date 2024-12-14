const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// for mongodb atlas
const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.bomsk.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

// for azure mongodb
// const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@clothingshop-db.mongocluster.cosmos.azure.com/${process.env.MONGODB_DATABASE}?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=true&maxIdleTimeMS=120000&w=majority&appName=clothingshop-db`;

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;