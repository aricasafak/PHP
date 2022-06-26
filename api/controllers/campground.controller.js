const mongoose = require("mongoose");
const Campground = mongoose.model(process.env.MODEL_NAME_CAMPGROUND);
require("dotenv").config();

const getAll = function (req, res) {
    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET, process.env.NUMBER_BASE);
    let count = parseInt(process.env.DEFAULT_FIND_COUNT, process.env.NUMBER_BASE);
    Campground.find().skip(offset).limit(count).exec(function (err, campgrounds) {
        if (err) {
            res.status(parseInt(process.env.STATUS_CODE_ERROR)).send({ message: process.env.MESSAGE_ERROR });
        } else {
            if (!campgrounds) {
                res.status(parseInt(process.env.STATUS_CODE_NOT_FOUND)).json({ message: process.env.MESSAGE_NOT_FOUND });
            } else {
                console.log("Found campgrounds", campgrounds);
                res.status(parseInt(process.env.STATUS_CODE_OK)).json(campgrounds);
            }
        }
    });
};

const addOne = function (req, res) {
    const newCampgroundData = req.body;
    Campground.create(newCampgroundData, function (err, campground) {
        if (err) {
            res.status(parseInt(process.env.STATUS_CODE_ERROR)).send({ message: process.env.MESSAGE_ERROR });
        } else {
            console.log("Campground created", campground);
            res.status(parseInt(process.env.STATUS_CODE_OK)).json(campground);
        }
    })
};

const getOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    Campground.findById(campgroundId).exec(function (err, campground) {
        if (err) {
            res.status(parseInt(process.env.STATUS_CODE_ERROR)).send({ message: process.env.MESSAGE_ERROR });
        } else {
            if (!campground) {
                res.status(parseInt(process.env.STATUS_CODE_NOT_FOUND)).json({ message: process.env.MESSAGE_NOT_FOUND });
            } else {
                console.log("Found campground by id", campground);
                res.status(parseInt(process.env.STATUS_CODE_OK)).json(campground);
            }
        }
    })
};

const deleteOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    Campground.findByIdAndDelete(campgroundId).exec(function (err, campground) {
        if (err) {
            res.status(parseInt(process.env.STATUS_CODE_ERROR)).send({ message: process.env.MESSAGE_ERROR });
        } else {
            if (!campground) {
                res.status(parseInt(process.env.STATUS_CODE_NOT_FOUND)).json({ message: process.env.MESSAGE_NOT_FOUND });
            } else {
                console.log("Deleted campground", campground);
                res.status(parseInt(process.env.STATUS_CODE_OK)).json(campground);
            }
        }
    })
};

const fullUpdateOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    Campground.findById(campgroundId).exec(function (err, campground) {
        if (err) {
            res.status(parseInt(process.env.STATUS_CODE_ERROR)).send({ message: process.env.MESSAGE_ERROR });
        } else {
            if (!campground) {
                res.status(parseInt(process.env.STATUS_CODE_NOT_FOUND)).json({ message: process.env.MESSAGE_NOT_FOUND });
            } else {
                campground.name = req.body.name;
                campground.city = req.body.city;
                campground.state = req.body.state;
                campground.save(function () {
                    console.log("Deleted campground", campground);
                    res.status(parseInt(process.env.STATUS_CODE_OK)).json(campground);
                });
            }
        }
    })
}

const partialUpdateOne = function (req, res) {
    const campgroundId = req.params.campgroundId;
    Campground.findById(campgroundId).exec(function (err, campground) {
        if (err) {
            res.status(parseInt(process.env.STATUS_CODE_ERROR)).send({ message: process.env.MESSAGE_ERROR });
        } else {
            if (!campground) {
                res.status(parseInt(process.env.STATUS_CODE_NOT_FOUND)).json({ message: process.env.MESSAGE_NOT_FOUND });
            } else {
                if (req.body.name) {
                    campground.name = req.body.name;
                }
                if (req.body.city) {
                    campground.city = req.body.city;
                }
                if (req.body.state) {
                    campground.state = req.body.state;
                }
                campground.save(function () {
                    console.log("Campground partially updated", campground);
                    res.status(parseInt(process.env.STATUS_CODE_OK)).json(campground);
                });
            }
        }
    })
}

module.exports = {
    getAll,
    addOne,
    getOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}