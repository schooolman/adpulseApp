var app = angular.module('advertisingApp', ['infinite-scroll']);


app.controller('MainController', ['$scope', '$http', function($scope, $http){

    $scope.username = '';
    $scope.tweet = '';
    $scope.initialData = [];
    $scope.trendingData = [];
    $scope.moreData = [];
    $scope.currentSaveList = [];
    $scope.tweetToSave = {};



    $scope.loadTweets = function(){
        $http.get('/advertising/loadtweets').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to get tasks');
            }
            $scope.initialData = response.data;
            //console.log($scope.initialData[1]);
        })
    };

    $scope.loadReadingList = function(){
        return $http.get('/accountlist').then(function(response){
            $scope.currentSaveList = [];

            for(var i = 0; i<response.data.readlist.length; i++){
                $scope.currentSaveList.push(response.data.readlist[i]);
            }
            console.log($scope.currentSaveList);
        });
    };


    $scope.loadTrending = function(){
        $http.get('/advertising/trending').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to load trending');
            }
            $scope.trendingData = response.data[0].trends;
        })
    };

    $scope.loadMoreTweets = function(){
        $http.get('/advertising/loadmoretweets').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to load more tweets');
            }
            $scope.moreData = response.data;
            for(var i = 0; i < $scope.moreData.length; i++){
                $scope.initialData.push($scope.moreData[i]);
            }
            //need to push new data into existing initialData Array
            //console.log(response.data);
        })
    };

    $scope.saveTweet = function(data){
        console.log('clicking save button! ', data);
        console.log('getting tweet info ', $scope.initialData[data]);
        $scope.tweetToSave.article = $scope.initialData[data].entities.urls[0].display_url;
        $scope.tweetToSave.tweet = $scope.initialData[data].text;
        console.log($scope.tweetToSave);

        $scope.sendTweet($scope.tweetToSave);

        //$http.post('/addtweet', saveItem).then(function(response){
        //    //console.log(response);
        //    //$scope.loadReadingList();
        //})

    };

    $scope.loadTrending();
    $scope.loadTweets();

    $scope.sendTweet = function(data){
        console.log(data);
        console.log('sendTweet route function');
        $http.put('/addtweet', data).then(function(err, response){
            if(err) throw err;
            console.log('hitting /addtweet');
            console.log('this is the response ', response);
            //$scope.loadReadingList();
        })
    }

}]);


