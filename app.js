
// setting up things required for server 
const express = require('express');

const bodyParser = require('body-parser');
const getDate = require('./date');
const app = express();
const date = require(__dirname + "/date.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// setting up database 
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://samoilbarda:Samoil123@cluster0.afjmipb.mongodb.net/todolistDB");

//compled seeting database up 
//creating schema of the todolistDB
const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("item", itemSchema);
//adding items to database items
const buyfood = new Item({
  name: 'buy food'
});

const cookfood = new Item({
  name: 'cook food'
});

const eatfood = new Item({
  name: 'eat food'
});

const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("list", listSchema);




console.log(date.getDay());
console.log(date.getDate());


var day
app.get('/', function (req, res) {
 day = date.getDate();
  Item.find({}, function (err, items) {
   
    res.render("to", { title: "Today", newItems: items });

  });


});

app.get('/:topic', function (req, res) {

  const customListName = req.params.topic;
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // creating new list as customListName list  not in database 
        const list = new List({
          name: customListName,
          items: []
        });
        list.save();
        res.redirect("/" + customListName);
      }
      else {
        res.render("to", { title: foundList.name , newItems: foundList.items });
      }
    }
  })

})

app.post("/", function (req, res) {
  var item = req.body.newItem
  
  if (item !== "") {
    const itemAdd = new Item({ name: item });

      var listname = req.body.list
      
      if(listname === "Today" )
      {
        itemAdd.save();
        res.redirect("/");
      }
      else{
        List.findOne({name: listname} , function(err , found){
          
          
            found.items.push(itemAdd);
            found.save();
            res.redirect("/"+listname);
           
         
        
        });
      }
 
}
});









app.post("/delete", function (req, res) {
  var id = req.body.checked;
  var listname = req.body.listname;
  if(listname === "Today"){
    Item.findByIdAndRemove(id, function (err) {         // for this function to work we need the call back function necessarily
      if (!err) {
        console.log("delete is success");
        res.redirect("/");
      }
    });
  }
  else{
    List.findOneAndUpdate({name : listname} ,{ $pull :{ items : {_id : id }}}, function(err , found){
           res.redirect("/"+listname);
    });
  }


});






app.listen(3000, function () {
  console.log('server started at port 3000');
});