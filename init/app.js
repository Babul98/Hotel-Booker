const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); // if previous then clean the DB
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "669dd74ad2962f97469965e8",
  }));
  //we assign the same owner to everyone acc to old data
  await Listing.insertMany(initdata.data);

  console.log("data was initialized");
  const vardata = await Listing.find({});
  console.log(vardata, vardata[0]);
};
// console.log(initdata,initdata[0]);
initDB();
