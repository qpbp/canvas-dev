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

    //the product data. We need top,left for positioning canvas area.
    //canvas height, width - for canvas
    $scope.product = {
      url: "assets/images/product.png",
      top: 165,
      left: 180,
      canvas: {height: 200, width: 100}
    };

    //the list of logos links
    $scope.logos = ['logo1.png', 'logo2.png', 'logo3.png', 'logo4.png', 'logo5.png'].map(function (imageUrl) {
      //this comfortable if we will change the basic URL
      var basicUrl = "assets/images/";
      return basicUrl + imageUrl;
    });

    //init canvas and give it size
    $scope.canvas = new fabric.Canvas('editor');
    $scope.canvas.setHeight($scope.product.canvas.height);
    $scope.canvas.setWidth($scope.product.canvas.width);

    //here we dynamically set the shift for image
    //so its will be easily to change if we will have another image
    var elem = angular.element(document.querySelector(".canvas-container"));
    elem.ready(function(){
      elem.css('top', $scope.product.top + "px");
      elem.css('left', $scope.product.left + "px");
    });

    //make transparenr corners and move rotating point closer to rectangle
    fabric.Object.prototype.set({
      transparentCorners: true,
      rotatingPointOffset: 0
    });

    //removing the top scale
    fabric.Object.prototype.setControlsVisibility({mt: false});

    //selectLogo function
    //param: logo image link
    $scope.selectLogo = function (logo) {
      var logo = logo || "";
      //clearing canvas
      $scope.canvas.clear();
      //load image
      fabric.Image.fromURL(logo, function (img) {

        //$scope.product.canvas.height && $scope.product.canvas.width
        //for centering object

        // cw, ch - canvas dimestions
        // iw, ih - image dimestions
        //the ratio
        var fw, fh;
        var width_ratio = $scope.canvas.width / img.width;
        var height_ratio = $scope.canvas.height / img.height;

        fw = img.width * width_ratio;
        fh = img.height * fw / img.width;

        //make this smaller min 20%
        var smaller = 0.2;
        fw = fw - (fw * smaller);
        fh = fh - (fh * smaller);

        //use this if we will have images with width > height
        /*
         if (width_ratio > height_ratio) {
         fw = iw * width_ratio;
         fh = ih*fw/iw;
         } else {
         fh = ih * height_ratio;
         fw = iw*fh/ih;
         }
         */
        //set height,width
        var obj = {
          width: fw,
          height: fh
        };

        //set last logo coordinates
        if (lastAdded.top && lastAdded.left) {
          obj.top = lastAdded.top;
          obj.left = lastAdded.left;
        }

        //set properties to logo
        img.set(obj);

        //set url to object
        img.logoUrl = logo;
        //center logo image
        $scope.canvas.centerObject(img);
        //add on canvas
        $scope.canvas.add(img);
        //render canvas
        $scope.canvas.renderAll();
      });

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
          //create base64
          $scope.generatedImage = group.toDataURL();
          //update changes
          $scope.$apply();
        });
      });
    };

    //here we make strict all sides in canvas
    //using in moving and scaling watchers
    //the logic taken from stackoverflow.com
    function keepPosFixed(obj) {

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
    };

    //watch object while moving
    $scope.canvas.on('object:moving', function (e) {
      var obj = e.target;
      // if object is too big ignore
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
      }
      // we use function below, to keep object in canvas area
      keepPosFixed(obj);
    });

    $scope.canvas.on("object:scaling", function (e) {
      var shape = e.target,
        maxWidth = $scope.canvas.width,
        maxHeight = $scope.canvas.height,
        actualWidth = shape.scaleX * shape.width,
        actualHeight = shape.scaleY * shape.height;

      //the rotation from 0 to 360 of object
      var angle = shape.getAngle() % 360;
      var floorAngle = Math.floor(angle);


      //here we check positiong of object (its vertical or horisontal).
      //if horisontal we cant scale over maxWidth length
      //if vertical we cant scale over maxHeight length
      if (!( (315 < floorAngle && floorAngle <= 359)
          || (0 < floorAngle && floorAngle <= 45)
          || (135 < floorAngle && floorAngle <= 225)
        )) {
        //so we swap maxVariables while scaling, based on angle
        actualHeight = [actualWidth, actualWidth = actualHeight][0];
      }

      //max scale
      if (actualHeight >= maxHeight || actualWidth >= maxWidth) {
        var scalef = (maxHeight / shape.height) < (maxWidth / shape.width) ? (maxHeight / shape.height) : (maxWidth / shape.width);
        shape.set({
          scaleY: scalef,
          scaleX: scalef
        });
      }
      // we use function below, to keep object in canvas area
      keepPosFixed(shape);
    });

  }]);