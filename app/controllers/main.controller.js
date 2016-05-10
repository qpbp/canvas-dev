'use strict';

angular.module('app')

  .controller('MainController', ['$scope', function ($scope) {


    //here we will save the last added object on canvas
    var lastAdded = {
      left: null,
      top: null,
      logoUrl: null
    };

    //base64 data empty variable for generated image
    $scope.generatedImage = "";

    //the product data, we need x,y for positioning
    $scope.product = {
      url: "assets/images/product.png",
      top: 165,
      left: 180,
      canvas: {height: 200, width: 100}
    };

    //the list of logos
    $scope.logos = ['logo1.png', 'logo2.png', 'logo3.png', 'logo4.png', 'logo5.png'].map(function (imageUrl) {
      //this comfortable if we will change the basic URL
      var basicUrl = "assets/images/";
      return basicUrl + imageUrl;
    });

    //run canvas with and give it size
    $scope.canvas = new fabric.Canvas('editor');
    $scope.canvas.setHeight($scope.product.canvas.height);
    $scope.canvas.setWidth($scope.product.canvas.width);

    //selectLog function
    //param: logo image link
    $scope.selectLogo = function (logo) {
      var logo = logo || "";
      //clearing canvas
      $scope.canvas.clear();
      fabric.Image.fromURL(logo, function (img) {

        //$scope.product.canvas.height && $scope.product.canvas.width
        //for centering object

        // cw, ch - canvas dimestions
        // iw, ih - image dimestions


        var obj = {
          scaleX: $scope.canvas.width / img.width,
          scaleY: $scope.canvas.height / (3*img.height)
        };

        if (lastAdded.top && lastAdded.left) {
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
    $scope.generateImage = function () {

      //upload product image
      fabric.Image.fromURL($scope.product.url, function (picture) {
        //the next line removing selection around the object on canvas
        $scope.canvas.deactivateAll().renderAll()
        //upload canvas print in base64 data
        fabric.Image.fromURL($scope.canvas.toDataURL(), function (canvas) {

          $scope.canvas.getActiveObject();
          //set coordinates by shift (see $scope.product variable)
          var img = canvas.set({
            left: $scope.product.left,
            top: $scope.product.top
          });

          //create group
          var group = new fabric.Group([picture, img]);

          $scope.generatedImage = group.toDataURL();
          $scope.$apply();
        });
      });
    };

    //here we save the last coord of object
    $scope.canvas.on("object:selected", function (options, event) {
      var object = options.target; //This is the object selected
      lastAdded.left = object.left;
      lastAdded.top = object.top;
      lastAdded.logoUrl = object.logoUrl;
      $scope.$apply()
    });

    //here we block the scaling over canvas
  /*  $scope.canvas.on("object:scaling", function (e) {
      var obj = e.target;
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
      }
    });*/

    //here we block the moving over canvas
    $scope.canvas.on("object:moving", function (e) {
      //borrow this solution here http://stackoverflow.com/questions/22910496/move-object-within-canvas-boundary-limit
      var obj = e.target;
      // if object is too big ignore
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
      }
      obj.setCoords();
      // top-left  corner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      }
      // bot-right corner
      if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
      }
    });

  }]);