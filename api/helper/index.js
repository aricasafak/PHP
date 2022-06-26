const mongoose = require("mongoose");
require("dotenv").config();

function sendResponse(res, statusCode, responseJSON) {
    res.status(parseInt(statusCode)).send(responseJSON);
}

function checkObjectIdValid(res, id) {
    if (!mongoose.isValidObjectId(id)) {
        sendResponse(res, process.env.STATUS_CODE_BAD_REQUEST, { message: process.env.MESSAGE_OBJECT_ID_NOT_VALID });
        return true;
    } else {
        return false;
    }
}

module.exports = {
    sendResponse,
    checkObjectIdValid,
}