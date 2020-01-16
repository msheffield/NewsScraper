var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var scrapperRouter = require("./controller/scrapperRouter.js");

var PORT = 3000;

var app = express();

// Set up app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use("/", scrapperRouter);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// GET Route to scrape data from Josh's Frogs care sheets
app.get("/scrape", function (req, res) {
  axios.get("https://www.joshsfrogs.com/catalog/blog/category/frog-care/").then(function (response) {
    // Init Cheerio
    var $ = cheerio.load(response.data);

    var result = {};

    $(".post-content").forEach(element => {
      result.title = $(this)
        .children(".post-title")
        .text();
      result.link = $(this)
        .children(".post-title")
        .children("a")
        .attr("href");
      result.description = $(this)
        .children(".description")
        .text();

      // Create db object
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send("Scraped");
  });
});

// GET route to retreive all articles
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticles) {
      res.json(dbArticles);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// GET route to retreive specific article and ntoe
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

// POST route to update comment
app.post("/articles/:id", function (req, res) {
  db.Comment.create(req.body)
    .then(function (dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port: " + PORT);
});  