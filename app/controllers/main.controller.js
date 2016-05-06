'use strict';

angular.module('app')

  .controller('MainController', ['$scope', function ($scope) {
    //here we will save the last added object on canvas
    var lastAdded = {
      left: null,
      top: null,
      logoUrl: null
    };

    $scope.generatedImage = "";

    $scope.product = {
      url: "assets/images/product.png",
      top: 165,
      left: 180
    };

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

    //selectLog function
    //param: logo image link
    $scope.selectLogo = function (logo) {
      var logo = logo || "";
      $scope.canvas.clear();
      fabric.Image.fromURL(logo, function (img) {

        var obj = {
          scaleX: $scope.canvas.width / img.width,
          top: 2,
          left: 2
        };

        if (lastAdded) {
          obj.top = lastAdded.top;
          obj.left = lastAdded.left;
        }

        img.set(obj);

        img.logoUrl = logo;
        $scope.canvas.add(img);
      });

      $scope.canvas.renderAll();
    };

    //generate function
    $scope.generateImage = function (){
      fabric.Image.fromURL($scope.product.url, function (product) {
        $scope.generatedImage = product.toDataURL();
        // fabric.Image.fromURL($scope.canvas.toDataURL(), function (canvas) {
        //
        //   $scope.generatedImage = picture.toDataURL();
        //   console.log($scope.generatedImage);
        //   $scope.$apply();
        // });
      });
    };
    $scope.canvas.on("object:selected", function (options, event) {
      var object = options.target; //This is the object selected
      // You can do anything you want and then call...
      lastAdded.left = object.left;
      lastAdded.top = object.top;
      lastAdded.logoUrl = object.logoUrl;
      $scope.$apply()
    });

    $scope.canvas.renderAll();

  }]);