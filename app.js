
//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");

const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//to connect or create a mongoDB databse
mongoose.connect("mongodb://localhost:27017/todolistDB", {
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

app.post("/", function(req, res) {

    const itemName = req.body.newItem;

    const newitem = new Item({
        title: itemName
    })

    newitem.save();

    res.redirect("/")
});

app.post("/delete", (req, res) => {
    const checkedID = req.body.checkbox;
    Item.deleteOne({
        _id: checkedID
    }, (err) => {
        err ? console.log(err) : console.log("successfully deleted")
    });
    res.redirect("/")
})

app.get("/:customerListName", (req, res) => {
    const customerListName = req.params.customerListName

    List.findOne({
        name: customerListName
    }, (err, results) => {
        if (!err) {
            if (!results) {
                const list = new List({
                    name: customerListName,
                    items: defaultList
                })
                list.save();
                res.redirect("/" + customerListName)
            } else {
                res.render("list", {
                    listTitle: results.name,
                    newListItems: results.items
                })
            }
        }
    })
})




app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
