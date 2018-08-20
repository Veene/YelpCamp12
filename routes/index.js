var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var passport = require('passport');
var User = require('../models/user');





//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing.ejs"); // we dont need .ejs because of app.set(ejs)
});


//============================
//AUTH ROUTES
//============================

//show register form
router.get('/register', function(req, res) {
    res.render('register.ejs');
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            res.render('register.ejs');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash("success", "Welcome to YelpCamp" + user.username);
            res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get('/login', function(req, res) {
    res.render("login.ejs");
});
//login route handling login logic
//app.post('login', middleware, callback)
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: "/campgrounds",
        successFlash: "Welcome ",
        failureRedirect: "/login",
        failureFlash: true
        
    })
    //callback basically useless in this scenario
);

//add logout route logic
router.get('/logout', function(req, res) {
    //comes from packages installed
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect('/campgrounds');
});

module.exports = router;