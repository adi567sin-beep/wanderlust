const listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const alllistings = await listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate
    ("owner");
  if (!Listing) {
    req.flash("error", "Listing you requested of does Not Exist");
    return res.redirect("/listings");
  }
  console.log(Listing);
  res.render("listings/show.ejs", { Listing });
}

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "new listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  if (!Listing) {
    req.flash("error", "listing you requested of does not exist");
    return res.redirect("/listings");
  }
  let originalImageUrl = Listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { Listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }
  req.flash("success", "listing updated !");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletelisting = await listing.findByIdAndDelete(id);
  console.log(deletelisting);
  req.flash("success", "listing deleted");
  res.redirect("/listings");
}
module.exports.index = async (req, res) => {
  let search = req.query.search;//search=goa

  let alllistings; //Creates a variable to store the listings fetched from MongoDB.

  if (search) {
    alllistings = await listing.find({
      location: { $regex: search, $options: "i" } //$regex Pattern matching and $options: "i"Case-insensitive.
    });
    if (alllistings.length === 0) {
      req.flash("error", `No Listings Found For "${search}"`);
    }

  } else {
    alllistings = await listing.find({});// if user did not search any thing return full listing
  }

  res.render("listings/index.ejs", { alllistings });
};