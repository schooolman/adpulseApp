var app = angular.module('advertisingApp', []);

app.controller('MainController', ['$scope', '$http', function($scope, $http){

    $scope.username = '';
    $scope.tweet = '';
    $scope.initialData = [];
    $scope.trendingData = [];

    $scope.loadTweets = function(){
        $http.get('/advertising/loadtweets').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to get tasks');
            }
            $scope.initialData = response.data;
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

    $scope.loadTrending();
    $scope.loadTweets();

}]);

