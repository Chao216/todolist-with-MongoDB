---
title: Putting everything together. Note app with DB
created: '2022-06-14T18:18:07.059Z'
modified: '2022-06-14T22:06:30.354Z'
---

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
