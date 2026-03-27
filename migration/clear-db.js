const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/modern_hotel")
  .then(async () => {
    await mongoose.connection.dropDatabase();
    console.log(" Database cleared successfully");
    process.exit();
  })
  .catch(err => console.log(err));