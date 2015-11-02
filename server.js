var express = require('express');
var path = require('path');
var app = express();

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').load();
var config = require('./oauth.js');
var mongoose = require('mongoose');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

//routes
var routes = require('./routes/index');
var users = require('./routes/users');
var advertising = require('./routes/advertising');
var readinglist = require('./routes/readinglist');

var currentUser = [];

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

passport.use(new TwitterStrategy({
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }, function(err, user) {
            currentUser = profile;
            //console.log('username = ', profile._json.profile_image_url);
            if(err) { console.log(err); }
            if (!err && user != null) {
                done(null, user);
            } else {
                var user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    displayName: profile.username,
                    readlist: [{tweet: 'Save Articles Here', article: 'www.example.com'}],
                    userPic: profile._json.profile_image_url,
                    created: Date.now()
                });
                user.save(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                });
            }
        });
    }
));

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');


    //app.use(methodOverride());
  app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());
    //app.use(app.router);

  app.use(express.static(path.join(__dirname, 'public')));



app.use('/', routes);
app.get('/ping', routes);
app.get('/account', ensureAuthenticated, function(req, res){
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('account', { user: req.user});
            console.log('user variable = ', user);
        }
    });
});



app.get('/accountlist', function(req, res){
    console.log('checking /accountList .put serverside');
    User.findOne({displayName: currentUser.username}, function(err, user) {
        if(err) {
            console.log('this is an error ', err);
        } else {
            //res.render('account', { user: req.user});
            console.log('user variable = ', user);
            console.log('this is currentUser ', currentUser);
            res.send(user);
        }
    });
});

app.put('/addtweet', function(req, res){
    //console.log(req.body);
    console.log('checking /addtweet .put serverside');
    User.findOneAndUpdate({displayName: currentUser.username},
        {$push: {'readlist': req.body}},
        function(err, doc){},
        res.sendStatus(200)
    );
});

app.put('/deletetweet', function(req, res){
   //console.log('this is the request: ', req.body);
    console.log('checking /deleteTweet .put serverside');
    User.findOneAndUpdate({displayName: currentUser.username},
        {$pull: {'readlist': req.body}},
        function(err, doc){},
        res.sendStatus(200)
    );
});



app.get('/', function(req,res){
  res.render('login', { user: req.user});
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/twitter',
    passport.authenticate('twitter'),
    function(req, res){
    });
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/account');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

// mongoose
mongoose.connect('mongodb://localhost/adpulse_db');



//app.use('/users', users);
app.use('/advertising', advertising);
app.use('/readinglist', readinglist);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// create a user model
var User = mongoose.model('User', {
    oauthID: Number,
    name: String,
    displayName: String,
    readlist: [{tweet: String, article: String}],
    userPic: String

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
