const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bCarpenter:QrfPJ3deNPHBDPDz@ccsepnosql.g1surlo.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    }
});
  
var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash = require('express-flash');
    const User = require("./model/User");
    var app = express();
  
mongoose.connect(uri);
  
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());  
app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
//=====================
// ROUTES
//=====================
  
// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});
  
// Showing secret page
app.get("/secret", function (req, res) {
    res.render("secret");
});
  
// Showing register form
app.get("/register", function (req, res) {
    var error = req.flash('error');
    res.render("register", { error });
});
  
// Handling user signup
app.post("/register", async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password
        });
        res.redirect('/login');
    } catch (e) {
        req.flash('error', 'Invalid User: User must be unique')
        res.redirect('/register');
    }
});
  
//Showing login form
app.get("/login", function (req, res) {
    var error = req.flash('error');
    res.render("login", { error });
});
  
//Handling user login
app.post("/login", async function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    try { username = JSON.parse(username); } catch(e) { }
    try { password = JSON.parse(password); } catch(e) { }

    var user = await User.findOne({ username: username, password: password });

    if(user) { res.redirect('/secret'); } 
    else {
        req.flash('error', 'Invalid Login: User Account not Found'); 
        res.redirect('/login'); 
    }
});
  
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});