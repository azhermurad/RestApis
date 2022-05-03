const mongoose = require("mongoose");
async function main() {
  await mongoose.connect("mongodb://localhost:27017/db1");
}

module.exports = main()
  .then(() => {
    console.log("database is connected");
  })
  .catch((error) => {
    console.log("Database is not Connected", error);
  });
