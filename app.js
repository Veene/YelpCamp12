var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var Campground = require('./models/campground');
var seedDB = require('./seeds');
var Comment = require('./models/comment');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var User = require('./models/user');

//REQUIRING ROUTES (done this for refactoring/cleaning up the code)
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');



mongoose.connect("mongodb://localhost:27017/yelp_camp_10", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the databse(take off for now)
//seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//user.authenticate comes from passport-local-mongoose builtin models
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this allows us to put this middleware and attach currentUser to every template
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//indexroutes are all different, so just '/' to keep with convention, the rest make sense'
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp camp SERVER has started!");
});