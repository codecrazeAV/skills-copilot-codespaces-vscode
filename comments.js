// Create web server
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const uuid = require("uuid");
const app = express();
const jsonParser = bodyParser.json();
const { Comments } = require("./model");
const mongoose = require("mongoose");
const { DATABASE_URL, PORT } = require("./config");
// Log the http layer
app.use(morgan("common"));
app.use(express.static("public"));
// GET requests to /posts
app.get("/posts", (req, res) => {
  Comments.find()
    .then(posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});
// GET requests to /posts/:id
app.get("/posts/:id", (req, res) => {
  Comments.findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});
// POST requests to /posts
app.post("/posts", jsonParser, (req, res) => {
  const requiredFields = ["title", "content", "author"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    // Check if each field is included in the request body
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Comments.create({
    title: req.body.title,
    content: req.body.content,