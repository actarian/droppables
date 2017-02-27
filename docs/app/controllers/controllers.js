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
    
    $scope.$on('onDropItem', function (scope, event) {
        var fromIndex = $scope.items.indexOf(event.from.model);
        var toIndex = $scope.items.indexOf(event.to.model);
        var item = $scope.items[fromIndex];
        $scope.items.splice(fromIndex, 1);
        $scope.items.splice(toIndex, 0, item);
    });
    $scope.$on('onDropOut', function (scope, event) {
        // console.log('NegotiationReportCtrl.onDropOut', event.model, event.from, event.to, event.target);
    });

}]);
