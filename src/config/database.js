const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "MONGO_URL"
  );
};

module.exports = connectDB;
