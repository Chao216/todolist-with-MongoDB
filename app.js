//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash"); //use loadh to solve problem of lower case and upper case.
// const date = require(__dirname + "/date.js");

const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//to connect or create a mongoDB databse
mongoose.connect("mongodb+srv://admin-chao:Qaz1207wsx@cluster0.qhfpx.mongodb.net/todolistDB", {
  useNewUrlParser: true
}) //we just created a new todolistDB database


//create a new db Schema
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please give a title"]
  }
});
//create a new db model
const Item = new mongoose.model("Item", itemSchema);

//craete some documents for the new database

const note1 = new Item({
  title: "Day1"

})

const note2 = new Item({
  title: "Day2"
})
const note3 = new Item({
  title: "Day3"
})

const defaultList = [note1, note2, note3]


//we will create a new Schema, and neste list schema insde for relationships.
const ListSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

// create a new list model for new purpose list
const List = new mongoose.model("List", ListSchema)




app.get("/", function(req, res) {

  // const day = date.getDate();

  Item.find((err, results) => {
    if (results.length === 0) {
      Item.insertMany(defaultList, (err) => {
        err ? console.log(err) : console.log("successfully added");;
      })

      res.redirect("/")

    } else {}
    err ? console.log(err) : res.render("list", {
      listTitle: "today",
      newListItems: results
    })
  });



});

app.post("/", function(req, res) { //because in list EJS, the submit button always act on "/" post

  const itemName = req.body.newItem;
  const listName = req.body.list //we gave our submit button a name called list in list.EJS

  const newitem = new Item({
    title: itemName
  })



  if (listName === "today") { // if submitted from default page, redirect to root route
    newitem.save();

    res.redirect("/")

  } else {
    List.findOne({
      name: listName
    }, (err, foundList) => { //to cheak if already had such a list in DB
      foundList.items.push(newitem); //items is an array as preveious defiend nested inside LIst
      foundList.save(); //writing to our DB
      res.redirect("/" + listName) //redirect to where click is from
    })

  }


});

app.post("/delete", (req, res) => {
  const checkedID = req.body.checkbox;
  const listName = req.body.listName; // we added a input in list EJS

  if (listName === "today") { //is user from root route? if so delete and redirect to root
    Item.deleteOne({
      _id: checkedID
    }, (err) => {
      err ? console.log(err) : console.log("successfully deleted")
    });
    res.redirect("/")

  } else { // if user deleted from another note list, try to find and delete with $pull operator from goose
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedID
        }
      }
    }, (err, results) => {
      // useing pull on the items array, locate with _id field
      !err ? res.redirect("/" + listName) : console.log(""); // redirect to where user is from and do nothing for else
    })
  }

})

app.get("/:customerListName", (req, res) => { //here we use the express route params
  const customerListName = _.capitalize(req.params.customerListName) //we create a variable depends on user's enter
  // use lodash capitalize method to sole lower case and upper case issue
  List.findOne({ //to check if such a list exits with mongoose findOne
    name: customerListName
  }, (err, results) => {
    if (!err) { //if query no error happens
      if (!results) { //if didin't find a result
        const list = new List({ //create a new List document
          name: customerListName,
          items: defaultList
        })
        list.save(); //save documents to db
        res.redirect("/" + customerListName) //redirect to same route
      } else {
        res.render("list", { //render with EJS emgine
          listTitle: results.name, //the query results from findOne
          newListItems: results.items //also results from findOne method.
        })
      }
    }
  })
})




app.get("/about", function(req, res) {
  res.render("about");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}


app.listen(port, function() {
  console.log("Server started successfully");
});
