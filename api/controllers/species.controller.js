const mongoose = require("mongoose");
const Campground = mongoose.model(process.env.MODEL_NAME_CAMPGROUND);
require("dotenv").config();
const { sendResponse, checkObjectIdValid } = require("../helper");

const getAll = function (req, res) {
    const campgroundId = req.params.campgroundId;
    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET, process.env.NUMBER_BASE);
    let count = parseInt(process.env.DEFAULT_FIND_COUNT, process.env.NUMBER_BASE);
    
    if (checkObjectIdValid(res, campgroundId)) {
        return;
    }

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

    Campground.findById(campgroundId).select("species").skip(offset).limit(count).exec(function (err, campground) {
        if (err) {
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                if (!campground.species) {
                    sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
                } else {
                    console.log("Found species for the specific campground", campground.species);
                    sendResponse(res, process.env.STATUS_CODE_OK, campground.species);
                }
            }
        }
    });
};

const addOneOrMore = function (req, res) {
    const newSpeciesData = req.body;
    const campgroundId = req.params.campgroundId;

    if (checkObjectIdValid(res, campgroundId)) {
        return;
    }

    Campground.findById(campgroundId).select("species").exec(function (err, campground) {
        if (err) {
            console.log("Internal error", err)
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                if(Array.isArray(campground.species)) {
                    campground.species = [...campground.species, ...newSpeciesData];
                } else {
                    campground.species.push(newSpeciesData);
                }
                campground.save(function (err) {
                    if (err) {
                        sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_REQUIRED_FIELDS_MISSING })
                    } else {
                        console.log("Species is created for the specific campground", campground);
                        sendResponse(res, process.env.STATUS_CODE_CREATED, { message: process.env.MESSAGE_NEW_ITEM_OR_ITEMS_CREATED });
                    }
                });
            }
        }
    });
};

const getSpecies = function (req, res) {
    const campgroundId = req.params.campgroundId;
    const speciesId = req.params.speciesId;

    if (checkObjectIdValid(res, campgroundId) || checkObjectIdValid(res, speciesId)) {
        return;
    }

    Campground.findById(campgroundId).select("species").exec(function (err, campground) {
        if (err) {
            console.log("Internal error", err)
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                const species = campground.species.id(speciesId);
                if (!species) {
                    sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
                } else {
                    console.log("Found species by id from the specific campground", species);
                    sendResponse(res, process.env.STATUS_CODE_OK, species);
                }
            }
        }
    });
};

const deleteSpecies = function (req, res) {
    const campgroundId = req.params.campgroundId;
    const speciesId = req.params.speciesId;

    if (checkObjectIdValid(res, campgroundId) || checkObjectIdValid(res, speciesId)) {
        return;
    }

    Campground.findById(campgroundId).select("species").exec(function (err, campground) {
        if (err) {
            console.log("Internal error", err)
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                const species = campground.species.id(speciesId);
                if (!species) {
                    sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
                } else {
                    species.remove();
                    campground.save(function (err) {
                        if (err) {
                            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_REQUIRED_FIELDS_MISSING })
                        } else {
                            console.log("Campground created", campground);
                            sendResponse(res, process.env.STATUS_CODE_CREATED, { message: process.env.MESSAGE_DELETE_ITEM });
                        }
                    })
                }
            }
        }
    });
};

const fullUpdateOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    const speciesId = req.params.speciesId;

    if (checkObjectIdValid(res, campgroundId) || checkObjectIdValid(res, speciesId)) {
        return;
    }

    Campground.findById(campgroundId).select("species").exec(function (err, campground) {
        if (err) {
            console.log("Internal error", err)
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                const species = campground.species.id(speciesId);
                species.name = req.body.name;
                species.description = req.body.description;
                campground.save(function (err) {
                    if (err) {
                        sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_REQUIRED_FIELDS_MISSING })
                    } else {
                        console.log("Campground species fully updated", campground);
                        sendResponse(res, process.env.STATUS_CODE_CREATED, { message: process.env.MESSAGE_FULL_UPDATE });
                    }
                })
            }
        }
    });
}

const partialUpdateOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    const speciesId = req.params.speciesId;

    if (checkObjectIdValid(res, campgroundId) || checkObjectIdValid(res, speciesId)) {
        return;
    }

    Campground.findById(campgroundId).select("species").exec(function (err, campground) {
        if (err) {
            console.log("Internal error", err)
            sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_ERROR })
        } else {
            if (!campground) {
                sendResponse(res, process.env.STATUS_CODE_NOT_FOUND, { message: process.env.MESSAGE_NOT_FOUND })
            } else {
                const species = campground.species.id(speciesId);
                if (req.body.name) {
                    species.name = req.body.name;
                }
                if (req.body.description) {
                    species.description = req.body.description;
                }
                campground.save(function (err) {
                    if (err) {
                        sendResponse(res, process.env.STATUS_CODE_ERROR, { message: process.env.MESSAGE_REQUIRED_FIELDS_MISSING })
                    } else {
                        console.log("Campground species fully updated", campground);
                        sendResponse(res, process.env.STATUS_CODE_CREATED, { message: process.env.MESSAGE_PARTIAL_UPDATE });
                    }
                })
            }
        }
    });
}

module.exports = {
    getAll,
    addOneOrMore,
    getSpecies,
    deleteSpecies,
    fullUpdateOne,
    partialUpdateOne
}