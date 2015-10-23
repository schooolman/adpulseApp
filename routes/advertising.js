var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
var env = require('dotenv');

env.load();

var client = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
});

var dataArray = [];
var trending = [];
var twitter = [];

//Empty route
router.get('/', function(request, response, next){
    response.send('hitting advertising route');
    router.get()
});


//Sending the loaded tweets to the client side JS
router.get('/loadtweets', function(request, response, next){
    client.get('search/tweets', {q: 'advertising filter:links', count: '100', result_type: 'popular'}, function(error, tweets){
        if(error) throw error;
        var twitter = tweets.statuses;
        response.send(twitter);
    })
});

router.get('/loadmoretweets', function(request, response, next){
    client.get('search/tweets', {q: 'advertising filter:links', count: '50'}, function(error, tweets){
        if(error) throw error;
        //twitter = tweets.statuses;
        response.send(tweets.statuses);
        //twitter = [];

    })
});


//This route will call the function to fetch the current trending twitter list.
router.get('/trending', function(request, response, next){
    client.get('/trends/place', {id: '2452078'}, function(error, trends){
        if (error) throw error;
        //trending = trends;
        response.send(trends);
    });
});


    var newSearch = function(){
        client.get('/search/tweets', {q: 'advertising', count: '100', result_type: 'popular'}, function(error, tweets, response){
            //console.log(tweets.statuses);
            dataArray = tweets.statuses;
        });
    };

    //Function that gets trending list
    //var trendingList = function(){
    //    client.get('/trends/place', {id: '2452078'}, function(error, trends, response){
    //        if (error) throw error;
    //        trending = trends;
    //        console.log(trends);
    //        return trends;
        //});
    //};

    //Function that gets popular tweets

    //Get stream of tweets related to advertising
    //client.stream('statuses/filter', {track: 'advertising minneapolis'}, function(stream) {
    //    stream.on('data', function(tweet) {
    //        console.log(tweet.text);
    //    });
    //    stream.on('error', function(error) {
    //        throw error;
    //    });
    //});


module.exports = router;