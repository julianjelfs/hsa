'use strict';
angular.module('myApp')
  .controller('GalleryCtrl', ["$scope", "$compile", "$location", "$http", function ($scope, $compile, $location, $http){

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
                var img = "<img src='" +event.target.result+ "' ng-click='remove("+index+")' width='400' />";
                $compile(img)($scope).appendTo(holder);
            };

            reader.readAsDataURL(file);
        }  else {
            holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
            console.log(file);
        }
    }

    function readfiles(files) {
        for (var i = 0; i < files.length; i++) {
            currentFiles.push(files[i]);
            previewfile(files[i], i);
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
        holder.innerHTML = "";
        for (var i = 0; i < currentFiles.length; i++) {
            previewfile(currentFiles[i], i);
        }
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

}]);