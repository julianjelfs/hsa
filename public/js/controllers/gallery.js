'use strict';
angular.module('myApp')
  .controller('GalleryCtrl', ["$scope", "$location", "$http", function ($scope, $location, $http){

    var holder = document.getElementById("holder");

    var acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
    };

    var progress = document.getElementById('uploadprogress');
    var fileupload = document.getElementById('upload');

    function previewfile(file) {
        if (acceptedTypes[file.type] === true) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var image = new Image();
                image.src = event.target.result;
                image.width = 400; // a fake resize
                holder.appendChild(image);
            };

            reader.readAsDataURL(file);
        }  else {
            holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
            console.log(file);
        }
    }

    function readfiles(files) {
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
            previewfile(files[i]);
        }

        // now post a new XHR request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/gallery/upload/' + $scope.name);
        xhr.onload = function() {
            progress.value = progress.innerHTML = 100;
        };

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                var complete = (event.loaded / event.total * 100 | 0);
                progress.value = progress.innerHTML = complete;
            }
        }

        xhr.send(formData);
    }

    holder.ondragover = function () { this.className = 'hover'; return false; };
    holder.ondragend = function () { this.className = ''; return false; };
    holder.ondrop = function (e) {
        this.className = '';
        e.preventDefault();
        readfiles(e.dataTransfer.files);
    }

}]);