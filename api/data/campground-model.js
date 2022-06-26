require("dotenv").config();
const mongoose = require("mongoose");
const speciesSchema = require("./species-model");

const campgroundSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    park: {
        type: String,
        required: true
    },
    species: [speciesSchema]
});

mongoose.model(process.env.MODEL_NAME_CAMPGROUND, campgroundSchema, process.env.COLLECTION_NAME_CAMPGROUNDS);