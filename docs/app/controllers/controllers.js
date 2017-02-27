/* global angular, app */

app.controller('DemoCtrl', ['$scope', '$http', function ($scope, $http) {
    
    var uri = 'api/restcountries.all.js';
    // var uri = 'https://restcountries.eu/rest/v2/all';
    // var uri = 'https://api.github.com/search/repositories?q=tetris+language:javascript&sort=stars&order=desc&per_page=100';
    $http.get(uri).then(function success(response) {
        var datas = response.data;
        // var datas = response.data.items;
        $scope.items = datas;
    }, function(response) {
        console.log('error', response);
    });

}]);
