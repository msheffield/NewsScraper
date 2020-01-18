var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var htmlRouter = require("./controller/html_router");
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Set up html routing
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use("/", htmlRouter);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// ------ INDEX ------ // 


// GET Route to scrape data from Josh's Frogs care sheets
app.get("/scrape", function (req, res) {

  axios.get("https://www.joshsfrogs.com/catalog/blog/category/frog-care/").then(function (response) {
    // Init Cheerio
    var $ = cheerio.load(response.data);

    var results = [];

    $(".post-content-inner").each(function (i, element) {
      let result = {};

      result.title = $(this)
        .children(".post-header")
        .children(".post-title")
        .children("a")
        .children("h2")
        .text();
      result.link = $(this)
        .children(".post-header")
        .children(".post-title")
        .children("a")
        .attr("href");
      result.description = $(this)
        .children(".description")
        .text();
      result.saved = false;

      // Create db object
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.json(results);
  });
});

// GET route to retreive unsaved articles
app.get("/articles", function (req, res) {
  db.Article.find({ "saved": false })
    .then(function (dbArticles) {
      res.json(dbArticles);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// POST route to save article
app.post("/save/:id", function (req, res) {
  console.log("id: " + req.params.id);

  db.Article.updateOne({ _id: req.params.id }, { "saved": true }, {})
    .then(function (dbArticle) {
      console.log("Saved Article");
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


// ------ COLLECTION ------ //


// GET route to retreive all saved articles
app.get("/collection", function (req, res) {
  db.Article.find({ "saved": true })
    .then(function (dbArticles) {
      res.json(dbArticles);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// GET route to retreive specific article and note
app.get("articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// POST route to unsave article
app.post("/unsave/:id", function (req, res) {
  db.Article.updateOne({ _id: req.params.id }, { "saved": false })
    .then(function (dbArticle) {
      console.log("Unsaved Article: " + dbArticle.title);
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// POST route to update comment
app.post("/articles/:id", function (req, res) {
  db.Comment.create(req.body)
    .then(function (dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { "comment": dbComment._id }, { new: true });
    })
    .catch(function (err) {
      res.json(err);
    });
});


// ------ FINALLY ------ //

// Start the server
app.listen(PORT, function () {
  console.log("App running on port: " + PORT);
});  