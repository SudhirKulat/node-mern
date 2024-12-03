const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sudhirkulat:7Vr6lL8WZ0IauuDj@sudhircodeman.qfb6p.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
