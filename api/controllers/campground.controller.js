const mongoose = require("mongoose");
const Campground = mongoose.model(process.env.MODEL_NAME_CAMPGROUND);
require("dotenv").config();
const { sendResponse, checkObjectIdValid } = require("../helper");

const getAll = function (req, res) {
    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET, process.env.NUMBER_BASE);
    let count = parseInt(process.env.DEFAULT_FIND_COUNT, process.env.NUMBER_BASE);
    
    if (req.query.offset) {
        if(!isNaN(req.query.offset)){
            offset =  parseInt(req.query.offset, process.env.NUMBER_BASE);
        } else {
            sendResponse(res, process.env.STATUS_CODE_BAD_REQUEST, { message: process.env.MESSAGE_QUERY_PARAM_NOT_VALID });
            return;
        }
    }
    if (req.query.count) {
        if(!isNaN(req.query.count)){
            count =  parseInt(req.query.count, process.env.NUMBER_BASE);
            
            if(count > parseInt(process.env.DEFAULT_MAX_COUNT, process.env.NUMBER_BASE)) {
                sendResponse(res, process.env.STATUS_CODE_BAD_REQUEST, { message: process.env.MESSAGE_MAX_COUNT_VALUE_ERROR });
                return;
            }
        } else {
            sendResponse(res, process.env.STATUS_CODE_BAD_REQUEST, { message: process.env.MESSAGE_QUERY_PARAM_NOT_VALID });
            return;
        }
    }

    Campground.find().skip(offset).limit(count).exec(function (err, campgrounds) {
        if (err) {
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campgrounds) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                // console.log("Found campgrounds", campgrounds);
                sendResponse(res, process.env.STATUS_CODE_OK, campgrounds);
            }
        }
    });
};

const addOneOrMore = function (req, res) {
    const newCampgroundData = req.body;
    Campground.create(newCampgroundData, function (err, campground) {
        if (err) {
            console.log("Internal error", err)
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            console.log("Campground created", campground);
            sendResponse(res, process.env.STATUS_CODE_CREATED, { message: process.env.MESSAGE_NEW_ITEM_OR_ITEMS_CREATED });
        }
    })
};

const getOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    Campground.findById(campgroundId).exec(function (err, campground) {
        if (err) {
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                console.log("Found campground by id", campground);
                sendResponse(res, process.env.STATUS_CODE_OK, campground);
            }
        }
    })
};

const deleteOne = function (req, res) {
    const campgroundId = req.params.campgroundId;

    if (checkObjectIdValid(res, campgroundId)) {
        return;
    }

    Campground.findByIdAndDelete(campgroundId).exec(function (err, campground) {
        if (err) {
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                console.log("Deleted campground", campground);
                sendResponse(res, process.env.STATUS_CODE_OK, { message: process.env.MESSAGE_DELETE_ITEM });
            }
        }
    })
};

const fullUpdateOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    
    if (checkObjectIdValid(res, campgroundId)) {
        return;
    }

    Campground.findById(campgroundId).exec(function (err, campground) {
        if (err) {
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                campground.name = req.body.name;
                campground.state = req.body.state;
                campground.park = req.body.park;
                campground.species = req.body.species ? req.body.species : [];
                campground.save(function (err) {
                    if (err) {
                        sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_REQUIRED_FIELDS_MISSING })
                    } else {
                        console.log("Full update one campground", campground);
                        sendResponse(res, process.env.STATUS_CODE_OK, { message: process.env.MESSAGE_PARTIAL_UPDATE });
                    }
                });
            }
        }
    })
}

const partialUpdateOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    
    if (checkObjectIdValid(res, campgroundId)) {
        return;
    }

    Campground.findById(campgroundId).exec(function (err, campground) {
        if (err) {
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                if (req.body.name) {
                    campground.name = req.body.name;
                }
                if (req.body.state) {
                    campground.state = req.body.state;
                }
                if (req.body.park) {
                    campground.park = req.body.park;
                }
                if (req.body.species) {
                    campground.species = req.body.species;
                }
                campground.save(function (err) {
                    if (err) {
                        sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_REQUIRED_FIELDS_MISSING })
                    } else {
                        console.log("Campground partially updated", campground);
                        sendResponse(res, process.env.STATUS_CODE_OK, { message: process.env.MESSAGE_PARTIAL_UPDATE });
                    }
                });
            }
        }
    })
}

module.exports = {
    getAll,
    addOneOrMore,
    getOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}