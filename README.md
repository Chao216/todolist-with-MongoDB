---
title: Putting everything together. Note app with DB
created: '2022-06-14T18:18:07.059Z'
modified: '2022-06-14T22:06:30.354Z'
---
## Update Deploy you app to heroku and mongoDB atlas

you can visit the site from anywhere now

check https://enigmatic-basin-72581.herokuapp.com/

![Heroku](https://brand.heroku.com/static/media/heroku-logotype-vertical.f7e1193f.svg)         ![MongoDB](https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/thul-28DE482C-2D54-4FE1-BC7F23F34147DA57.png)

### mongoDB Atlas tutorial

you can register and create a free cluster on AWS, GCP or Azure.

create a user and password for using atlas databse

in you `app.js` modify the mongoose connection to something like

note choose connect , and connect your application

```
mongodb+srv://admin-<username>:<password>@cluster0.qhfpx.mongodb.net/?retryWrites=true&w=majority
```


### heroku tutorial

type `heroku login` on the terminal to login

the use `heroku create` to create a heroku app on the coloud

`touch Procfile` to create a Procfile

and add `web: node app.js` to your Procfile

change you app listen port to   
```JavaScript
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
```

add the engine info to package.json file in your app folder below `licesne`
```JavaScript
"engines": {
    "node": "14.x"
  },
```
create a .gitignore file and ignore fowwling content
```Git
/node_modules
npm-debug.log
.DS_Store
/*.env
```

push you app to heroku with `git push heroku main` here main is the branch you have



----------
# Putting everything together. Note app with DB

install and require mongoose package

then created a new database with connect method
```javaScript
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true} )
```

temp storage code
```JavaScript
<% for (let i=0; i<newListItems.length; i++) { %>
      <div class="item">
        <input type="checkbox">
        <p><%=  newListItems[i].title    %></p>
      </div>
      <% } %>
```

you can update old code to the forEach method
```JavaScript
  <%  newListItems.forEach((item)=>{ %>
    <div class="checkbox">
        <input type="checkbox">
        <p> <%= item.title %> </p>
      </div>
    <%})%>
```
**Note! you use `<% %>` for array before `forEach()`, but you still need `<%= %>` for item.name inside `forEach`**


## ~~***Please review this block of code tomorrow***~~
```JavaScript
app.get("/:customerListName", (req, res) => { //here we use the express route params
    const customerListName = req.params.customerListName //we create a variable depends on user's enter

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
                res.redirect("/" + customerListName)  //redirect to same route
            } else {
                res.render("list", {  //render with EJS emgine
                    listTitle: results.name,  //the query results from findOne
                    newListItems: results.items //also results from findOne method.
                })
            }
        }
    })
})


```


### to delete from different collections / different notelist, use if else

if user from root route, do as normal, if not ,find the right db collections, and delete the items in collection array.

```JavaScript
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
      // using pull on the items array, locate with _id field
      !err ? res.redirect("/" + listName) : console.log(""); // redirect to where user is from and do nothing for else
    })
  }

})
```


### to solve lower case and upper case issue , simple install and load `lodash` and `use _.capitalize()`
--------------
