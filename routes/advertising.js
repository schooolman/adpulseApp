var express = require('express');
var Twitter = require('twitter');
var router = express.Router();

var client = new Twitter({
    consumer_key: '4CackWnYgZmtLa5mITlnwaPZL',
    consumer_secret: 'pvk4CNwb3GcPQW5Fi6XWFHZtuyW0Kp2SlFs5YL6Wqa3WoUViQL',
    access_token_key: '73168768-93958qkkunEfZNCX5td2jZuy2nDdf45J4lOph7YmN',
    access_token_secret: 'U4YGlpT9uFbzkKD7u6wYd9jrYnTlcr1V9EdD1kFzXepVK'
});

var dataArray = [];
var trending = [];

//Empty route
router.get('/', function(request, response, next){
    response.send('hitting advertising route');
    router.get()
});


//Sending the loaded tweets to the client side JS
router.get('/loadtweets', function(request, response, next){
    newSearch();
    response.send(dataArray);
});


//This route will call the function to fetch the current trending twitter list.
router.get('/trending', function(request, response, next){
    trendingList();




    response.send(trending);
});



    //Function that gets trending list
    var trendingList = function(){
        client.get('/trends/place', {id: '2452078'}, function(error, trends, response){
            if (error) throw error;
            trending = trends;
            //console.log(trends);
            //return trends;
        });
    };

    //Function that gets popular tweets
    var newSearch = function(){
        client.get('/search/tweets', {q: 'advertising', count: '100', result_type: 'popular'}, function(error, tweets, response){
            //console.log(tweets.statuses);
            dataArray = tweets.statuses;
        });
    };

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