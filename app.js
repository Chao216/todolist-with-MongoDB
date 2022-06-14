//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");

const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//to connect or create a mongoDB databse
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true} )//we just created a new todolistDB database


//create a new db Schema
const itemSchema = new mongoose.Schema({
  title:{
    type:String,
    required:[true, "please give a title"]
  },
  content:{
    type:String,
    required:[true, "please write list content"]
  }
});
//create a new db model
const Item = new mongoose.model("Item", itemSchema);

//craete some documents for the new database

const note1 = new Item({
  title:"Day1",
  content:"Some content for Day 1"
})

const note2 = new Item({
  title:"Day2",
  content:"Some content for Day 2"
})
const note3 = new Item({
  title:"Day3",
  content:"Some content for Day 3"
})

// Item.insertMany([note1, note2, note3], (err)=>{
//   err?console.log(err):console.log("successfully added");;
// })







app.get("/", function(req, res) {

// const day = date.getDate();

Item.find((err,results)=>{
  err?console.log(err):  res.render("list", {listTitle: "today", newListItems: results})
});



});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
