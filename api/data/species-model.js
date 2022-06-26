require("dotenv").config();
const mongoose = require("mongoose");
const speciesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = speciesSchema;