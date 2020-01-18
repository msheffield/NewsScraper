var express = require("express");
var exphbs = require("express-handlebars");

var router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/collection", (req, res) => {
  res.render("collection");
});

module.exports = router;