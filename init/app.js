const  mongoose=require("mongoose");
const initdata =require("./data.js");
const Listing=require("../models/listing.js");

 

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err);
});
 

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({}); // if previous then clean the DB
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
    const vardata=await Listing.find({});
    console.log(vardata,vardata[0]);
}
// console.log(initdata,initdata[0]);
initDB();