require("dotenv").config();
const mongoose = require("mongoose");
const campgroundSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
});

mongoose.model(process.env.MODEL_NAME_CAMPGROUND, campgroundSchema, process.env.COLLECTION_NAME_CAMPGROUNDS);