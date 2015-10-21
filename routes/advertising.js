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

router.get('/', function(request, response, next){
    response.send('hitting advertising route');
    router.get()
});


router.get('/loadtweets', function(request, response, next){
    //response.send('going to get the tweeeeeeets');
    response.send(dataArray[0]);


    //returns an initial query of advertising filtering for tweets with links
    //client.get('/search/tweets', {q: 'advertising filter:links'}, function(error, tweets, response){
    //    //console.log(tweets.statuses[0].text);
    //    dataArray = tweets.statuses;
    //    console.log(response);
    //    console.log(dataArray);
    //    for(var i = 0; i < dataArray.length; i++){
    //        console.log(dataArray[i].user.name);
    //        console.log(dataArray[i].text);
    //    }
    //});


    //Get stream of tweets related to advertising
    //client.stream('statuses/filter', {track: 'advertising'}, function(stream) {
    //    stream.on('data', function(tweet) {
    //        console.log(tweet.text);
    //    });
    //    stream.on('error', function(error) {
    //        throw error;
    //    });
    //});
});

client.get('/search/tweets', {q: 'advertising filter:links'}, function(error, tweets, response){
    //console.log(tweets.statuses[0].text);
    dataArray = tweets.statuses;
    console.log(response);
    console.log(dataArray);
    for(var i = 0; i < dataArray.length; i++){
        console.log(dataArray[i].user.name);
        console.log(dataArray[i].text);
    }
});

//Route to get initial search query from Twiter API with query term advertising




module.exports = router;