const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema; // (data type defining)mongoose.Schema is a blueprint that defines the structure of documents inside a MongoDB collection
const Review = require("./review.js");

const listingschema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String, // before set (v) =>{ v===""? somelinkofphoto: v,}
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId, //MongoDB automatically gives every document a unique ID(object id)
            ref: "Review",
        },
    ],
    owner: {//after adding this 
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

//if listig is deleted ,related to tht listing , review wll be deleted
listingschema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model("listing", listingschema);//"Create a Model named listing based on listingSchema, and store it in the variable listing so I can interact with the listings(in db every object becomes plural) collection in MongoDB."
module.exports = listing;