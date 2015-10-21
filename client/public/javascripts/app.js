console.log('last test');

var app = angular.module('advertisingApp', []);

app.controller('MainController', ['$scope', '$http', function($scope, $http){

    this.test = 'TEST';
    $scope.username = '';
    $scope.tweet = '';

    this.loadTweets = function(){
        $http.get('/advertising/loadtweets').then(function(response){
            if(response.status !== 200){
                throw new Error('Failed to get tasks');
            }
            console.log(response.data.user.name);
            console.log(response.data.text);
            $scope.username = response.data.user.name;
            $scope.tweet = response.data.text;

        })
    };

    this.loadTweets();

}]);

