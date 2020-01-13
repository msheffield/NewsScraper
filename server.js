var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

// Set up app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapper", { useNewUrlPraser: true });



// Start the server
// Start the server
app.listen(PORT, function() {
    console.log("App running on port: " + PORT);
  });  