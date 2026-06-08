const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const Review = require("./review.js");

const listingschema= new Schema({
    title:{
        type:String,
        required : true,
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const listing=mongoose.model("listing",listingschema);
module.exports=listing;