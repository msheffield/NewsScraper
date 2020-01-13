var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

var app = express();

// Set up app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// Start the server
// Start the server
app.listen(PORT, function() {
    console.log("App running on port: " + PORT);
  });  