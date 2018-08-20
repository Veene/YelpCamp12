var Comment = require('../models/comment');
var Campground = require('../models/campground');

// all the middleware hoes here
var middlewareObj = {
    checkCampgroundOwnership: function() {
        
    }
};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Campground not found Error")
                    res.redirect('back');
                } else {
                    //does the user own the campground?
                    if(foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that")
                        res.redirect('back');
                    }
                }
            });
            
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect('back');
        }
        
    
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "Something went wrong")
                    res.redirect('back');
                } else {
                    //does the user own the comment?
                    if(foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that")
                        res.redirect('back');
                    }
                }
            });
            
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect('back');
        }
};

//middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //do flash BEFORE redirect, because it shows on the next re-directed page
    req.flash("error", "You need to be logged in to do that!");
    res.redirect('/login');
};

module.exports = middlewareObj;