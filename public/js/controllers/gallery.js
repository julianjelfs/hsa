'use strict';

/*
Doing lots of non-angular DOM manipulation in this controller. Not really right, but it's easier.
 */

angular.module('myApp')
  .controller('GalleryUploadCtrl', ["$scope", "$compile", "$location", "$http", "$timeout", function ($scope, $compile, $location, $http, $timeout){

    var defaultStatus = "Enter a name for a new album";
    $scope.status = defaultStatus;

    var holder = document.getElementById("holder");

    var acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
    };

    var progress = document.getElementById('uploadprogress');
    var fileupload = document.getElementById('upload');
    var currentFiles = [];

    function previewfile(file, index) {
        if (acceptedTypes[file.type] === true) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var d = document.createElement("div");
                var i = new Image();
                i.onload = function(){
                    if(i.width > i.height)
                        i.className = "landscape";
                    else
                        i.className = "portrait";
                    d.className = 'thumb';
                }
                d.setAttribute('data-index', index);
                i.setAttribute('ng-click', 'remove('+index+')');
                i.src = event.target.result;
                d.appendChild(i);
                $compile(d)($scope).appendTo(holder);
            };

            reader.readAsDataURL(file);
        }  else {
            holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
            console.log(file);
        }
    }

    function readfiles(files) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];  
          //$timeout(function(){
                currentFiles.push(file);
                previewfile(file, i);
          //},0);
        }
    }

    $scope.clear = function(){
        currentFiles = [];
        holder.innerHTML = "";
    }

    $scope.noFilesToUpload = function(){
        return currentFiles.length === 0;
    }

    $scope.upload = function(){
        var formData = new FormData();
        for (var i = 0; i < currentFiles.length; i++) {
            formData.append('file', currentFiles[i]);
        }

        // now post a new XHR request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/gallery/upload/' + $scope.name);
        xhr.onload = function() {
            progress.value = progress.innerHTML = 0;
            $('#progress').foundation('reveal', 'close');
            $scope.$apply(function(){
                $scope.clear();
                $scope.name = "";
                $scope.status = "You upload has completed successfully";
                $timeout(function(){
                    $scope.status = defaultStatus;
                },4000);
            });
        };

        xhr.upload.onprogress = function (event) {
             if (event.lengthComputable) {
                var complete = (event.loaded / event.total * 100 | 0);
                progress.value = progress.innerHTML = complete;
             }
        }

        xhr.send(formData);
        $('#progress').foundation('reveal', 'open');
    }

    $scope.remove = function(index){
        currentFiles.splice(index, 1);
        $("div[data-index="+index+"]", holder).remove();
    }

    holder.ondragover = function () { this.className = 'hover'; return false; };
    holder.ondragend = function () { this.className = ''; return false; };
    holder.ondrop = function (e) {
        this.className = '';
        e.preventDefault();
        $scope.$apply(function(){
            readfiles(e.dataTransfer.files);
        });

    }

  }]).controller("GalleryCtrl", ["$scope", "albums", function($scope, albums){
    $scope.albums = albums;
  }]).controller("AlbumCtrl", ["$scope", "photos", function($scope, photos){
    $scope.photos = photos;
  }]);