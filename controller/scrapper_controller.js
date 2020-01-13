var express = require("express");

var router = express.Router();

var db = require("./models");

router.get("/", function (req, res) {
    db.Articles.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});