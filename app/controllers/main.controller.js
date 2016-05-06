'use strict';

angular.module('app')

  .controller('MainController', ['$scope', function ($scope) {
    //the list of logos
    $scope.logos = ['logo1.png', 'logo2.png', 'logo3.png'].map(function (imageUrl) {
      //this comfortable if we will change the basic URL
      var basicUrl = "assets/images/";
      return basicUrl + imageUrl;
    });

    //run canvas with and give it size
    $scope.canvas = new fabric.Canvas('editor');
    $scope.canvas.setHeight(200);
    $scope.canvas.setWidth(100);

    // $scope.canvas.setBackgroundImage('assets/images/product.png', $scope.canvas.renderAll.bind($scope.canvas))


    $scope.canvas.renderAll();
    console.log('here');
  }]);