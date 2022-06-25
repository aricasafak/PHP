const express = require("express");
const app = express();
require("dotenv").config();
const routes = require("./routes");

app.use(routes);

const server = app.listen(process.env.PORT_NUMBER, function(){
    const portNumber = server.address().port;
    console.log("Server is running on port", portNumber);
});