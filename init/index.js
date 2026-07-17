const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";  //MongoDB Connection String

main()  // return promise 
  .then(() => {// runs on success
    console.log("connected to db");
  })
  .catch((err) => {// runs on failure
    console.log(err);
  });

async function main() {// asyn-Makes function return a Promise automatically
  await mongoose.connect(mongo_url);
}

const initdb = async () => {//init db
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "6a210853ee8f36625e99ec6a" }));//owner object is reinit into data using id

  //Runs for every object. and adding owner
  await listing.insertMany(initdata.data);
  console.log("data was init");
};
initdb();