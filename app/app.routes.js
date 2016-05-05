'use strict';

var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {templateUrl: '/components/main/main.html', controller: 'MainController'})
    .otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);