var app = angular.module('advertisingApp', ['ngAnimate', 'infinite-scroll']);


app.controller('MainController', ['$scope', '$http', function($scope, $http){

    $scope.username = '';
    $scope.tweet = '';
    $scope.initialData = [];
    $scope.trendingData = [];
    $scope.moreData = [];
    $scope.currentSaveList = [];
    $scope.tweetToSave = {};
    $scope.tweetToDelete = {};
    $scope.hideLogin = false;
    $scope.hideSaved = false;
    $scope.favoritedTweets = [];
    $scope.featured = true;
    $scope.low = true;
    $scope.hideData = true;
    $scope.savedMoved = false;
    $scope.showLoading = false;


    //Loads initial tweets to app
    $scope.loadTweets = function(){
        $http.get('/advertising/loadtweets').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to get tasks');
            }
            $scope.initialData = response.data;
            $scope.checkFavorite(response.data);
            console.log(response.data);
        });
    };

    //Shows the loading .svg while contacting twitter api
    $scope.displayLoading = function(){
      $scope.showLoading = true;
    };


    //click on menu button to toggle open and close
    $scope.slideLeft = function(){
        $scope.hideLogin = !$scope.hideLogin;
        $scope.hideData = !$scope.hideData;
    };

    //click on this button to toggle open saved list
    $scope.openSavedBar = function(){
        $scope.hideSaved = !$scope.hideSaved;
        $scope.savedMoved = !$scope.savedMoved;
        console.log($scope.currentSaveList);
        $scope.loadReadingList();
    };


    //retrieves the saved articles list from database.
    $scope.loadReadingList = function(){
        return $http.get('/accountlist').then(function(response){
            $scope.currentSaveList = [];

            for(var i = 0; i<response.data.readlist.length; i++){
                $scope.currentSaveList.push(response.data.readlist[i]);
            }
        });
    };

    //loads the trending data into the app.
    $scope.loadTrending = function(){
        $http.get('/advertising/trending').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to load trending');
            }
            console.log(response);
            $scope.trendingData = response.data[0].trends;

        })
    };

    $scope.loadMoreTweets = function(){
        console.log('loading more tweets');
        $http.get('/advertising/loadmoretweets').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to load more tweets');
            }
            $scope.moreData = response.data;
            for(var i = 0; i < $scope.moreData.length; i++){
                $scope.initialData.push($scope.moreData[i]);
            }
            $scope.checkFavorite(response.data);
            //need to push new data into existing initialData Array
            //console.log(response.data);
        })
    };

    $scope.saveTweet = function(data){
        console.log($scope.initialData[data]);
        $scope.tweetToSave.article = $scope.initialData[data].entities.urls[0].display_url;
        $scope.tweetToSave.tweet = $scope.initialData[data].text;

        $scope.sendTweet($scope.tweetToSave);
        $scope.loadReadingList();
    };

    $scope.removeTweet = function(index){
        $scope.tweetToDelete._id = $scope.currentSaveList[index]._id;
        $scope.tweetToDelete.article = $scope.currentSaveList[index].article;
        $scope.tweetToDelete.tweet = $scope.currentSaveList[index].tweet;
        console.log($scope.tweetToDelete);
        $scope.deleteTweet($scope.tweetToDelete);
        $scope.loadReadingList();
    };

    $scope.loadTrending();
    $scope.loadTweets();


    $scope.sendTweet = function(data){
        return $http.put('/addtweet', data).then(function(err, response){
            if(err) throw err;
        })
    };

    $scope.deleteTweet = function(data){
        return $http.put('/deletetweet', data).then(function(err, response){
            if (err) throw err;
            return response;
        })
    };

    //Checking to see if the tweet has been favorited more than 30 times and pushing to seperate array
    $scope.checkFavorite = function(tweets){

        for(var i = 0; i < tweets.length; i++){
            if(tweets[i].favorite_count > 30 || tweets[i].retweet_count > 20){
                tweets[i].style = 'featured';
                //tweets[i].row = 'row';
            }else{
                tweets[i].style = 'low';
                //tweets[i].entities.media[0].media_url = null;
            }
        }

    }


}]);


