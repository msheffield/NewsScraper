var mongoose = require("mongoose");

var Schema = mongoose.schema;

var CommentSchema = new Schema({
    title: String,
    body: String
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;