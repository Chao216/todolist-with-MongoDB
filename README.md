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


## ***Please review this block of code tomorrow***
```JavaScript
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

```

