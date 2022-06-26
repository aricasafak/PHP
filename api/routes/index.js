const express = require("express");
const router = express.Router();
const campgroundController = require("../controllers/campground.controller.js")
const speciesController = require("../controllers/species.controller.js")
require("dotenv").config();

router.route(process.env.ROUTE_CAMPGROUNDS_WITHOUT_PARAM)
    .get(campgroundController.getAll)
    .post(campgroundController.addOneOrMore);
    
router.route(process.env.ROUTE_CAMPGROUNDS)
    .get(campgroundController.getOne)
    .delete(campgroundController.deleteOne)
    .put(campgroundController.fullUpdateOne)
    .patch(campgroundController.partialUpdateOne);

router.route(process.env.ROUTE_CAMPGROUNDS_SPECIES_WITHOUT_PARAM)
    .get(speciesController.getAll)
    .post(speciesController.addOneOrMore);
    
router.route(process.env.ROUTE_CAMPGROUNDS_SPECIES)
    .get(speciesController.getSpecies)
    .delete(speciesController.deleteSpecies)
    .put(speciesController.fullUpdateOne)
    .patch(speciesController.partialUpdateOne);

module.exports = router;