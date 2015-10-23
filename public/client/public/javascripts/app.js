var app = angular.module('advertisingApp', ['infinite-scroll']);


app.controller('MainController', ['$scope', '$http', function($scope, $http){

    $scope.username = '';
    $scope.tweet = '';
    $scope.initialData = [];
    $scope.trendingData = [];
    $scope.moreData = [];



    $scope.loadTweets = function(){
        $http.get('/advertising/loadtweets').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to get tasks');
            }
            $scope.initialData = response.data;
            console.log($scope.initialData[1]);
        })
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
            console.log(response.data);
        })
    };

    $scope.loadTrending();
    $scope.loadTweets();
    console.log('check');
}]);


