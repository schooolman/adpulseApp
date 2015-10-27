var express = require('express');
var passport = require('passport');
var twitter = require('twitter');
var Account = require('../models/account');
var router = express.Router();
var Reading = require('../models/user');

//get reading list
//currently sending the object that is created by the schema
//need to do a search of the database here.
router.get('/getlist', function(req, res, next){
    //console.log('this is what is being sent to the get list route ', req);
    Reading.findById(req._id, function(err, list){
        console.log(list);
    });
    //var list = req.user.readlist;
    //res.send(list);
    //Reading.find({}, function(err, list){
    //    //res.json(task);
    //    if(err) throw err;
    //    console.log('hit get list route');
    //    console.log('list data = ', list);
    //    res.send(list)
    //})
});

module.exports = router;