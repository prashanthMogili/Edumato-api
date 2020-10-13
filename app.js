const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const chalk = require("chalk");
const port = process.env.PORT || 5500;
const cors = require("cors");
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const mongoUrl = "mongodb+srv://dbRest:dbRest123@cluster0.g4wzh.mongodb.net/rest?retryWrites=true&w=majority"
// app.use(morgan("tiny", {
//     stream: fs.createWriteStream("mylogs.logs", {flags:"a"})
// }))

app.get('/',(req,res) => {
    res.send("<div><a href='http://localhost:5500/location' target='_blank'>Location</a><br/><a href='http://localhost:5500/mealtype' target='_blank'>MealType</a><br/><a href='http://localhost:5500/cuisine' target='_blank'>Cuisine or Widgtes</a><br/>  <a href='http://localhost:5500/restaurant' target='_blank'>Restauarant</a><br/><a href='http://localhost:5500/orders' target='_blank'>Orders</a></div>")
})

//City List
app.get('/location',(req,res) => {
    db.collection('city').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



//Meal Type
app.get('/mealtype',(req,res) => {
    db.collection('mealtype').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//Cusine
app.get('/cuisine',(req,res) => {
    db.collection('cuisine').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//Restaurant
app.get('/restaurant',(req,res) => {
    var query = {};
    if(req.query.city && req.query.mealtype){
        query={city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    else if(req.query.city){
        query={city:req.query.city}
    }
    else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurant').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurantDetails/:id',(req,res) => {
    //  
    var query = {_id:req.params.id}
    db.collection('restaurant').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

// FILTER

app.get("/restaurant/:mealtype", (req, res) => {
    let query = {"type.mealtype": req.params.mealtype};
    let sort = {cost:1}
    if(req.query.city && req.query.sort){
        query = {"type.mealtype":req.params.mealtype,"city":req.query.city}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.cuisine && req.query.sort){
        query = {"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.lcost && req.query.hcost && req.query.sort){
        query = {"type.mealtype":req.params.mealtype,"cost":{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.city){
        query = {"type.mealtype":req.params.mealtype,"city":req.query.city}
    }else if(req.query.cuisine){
        query = {"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
    }else if(req.query.lcost && req.query.hcost){
        query = {"type.mealtype":req.params.mealtype,"cost":{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
    }

    db.collection("restaurant").find(query).sort(sort).toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
});

//orders
app.get('/orders',(req,res) => {
    db.collection('orders').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

//placeorder
app.post('/placeorder',(req,res) => {
    // console.log(">>>><<<<<<<<<<<<<",req.body.name)
    db.collection('orders').insertOne(req.body,(err,result) => {
        if(err){
            throw err
        }else{
            res.send('Data Added')
        }
    })
});



MongoClient.connect(mongoUrl,{ useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db("rest")

    app.listen(port,(err) => {
        if(err) throw err;
        console.log(chalk.green(`server is running on port number ${5500}`));
    });
});









