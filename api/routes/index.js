const express = require("express");
const router = express.Router();
const campgroundController = require("../controllers/campground.controller.js")
require("dotenv").config();

router.route(process.env.ROUTE_CAMPGROUNDS_WITHOUT_PARAM)
    .get(campgroundController.getAll)
    .post(campgroundController.addOne);
    
router.route(process.env.ROUTE_CAMPGROUNDS)
    .get(campgroundController.getOne)
    .delete(campgroundController.deleteOne)
    .put(campgroundController.fullUpdateOne)
    .patch(campgroundController.partialUpdateOne);

module.exports = router;