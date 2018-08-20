var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware/index.js');

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){

    
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        
        } else {
            res.render("campgrounds/index.ejs", {campgrounds:allCampgrounds, currentUser:req.user}); //campgrounds here is the db - it seems db adds an 's'
        }
    });
    
    // res.render("campgrounds", {campgrounds:campgrounds});
});

//CREATE - ADD NEW CAMPGROUND TO DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds list/array
    //redirect to campgrounds page
    var name = req.body.name;
    var images = req.body.images;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var price = req.body.price;
    var newCampground = {name: name, images:images, description:desc, author:author, price:price};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log("Created new DB entry");
            console.log(newlyCreated);
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    // campgrounds.push(newCampground); (was deleted)
    
    
    
});
//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

//REMEMBER ORDER IS IMPORTANT, IF THIS WAS ABOVE /NEW THEN /NEW would be considered an :ID and would show THIS WILL BE A SHOW PAGE ONE DAY
//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log('clicked on a campground');
            //render show template with that campground
    res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    });
    
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", "Campground not found Error");
                res.redirect('back');
            } else {
                res.render("campgrounds/edit.ejs", {campground: foundCampground});
            }
        });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Campground not found Error");
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
    
    //redirect somewhere (show page)
});

//DESTROY CAMPGROUND ROUTE
router.delete('/:id',middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            req.flash("error", "Campground not found Error");
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});





module.exports = router;