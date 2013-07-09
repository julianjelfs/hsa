var fs = require("fs"),
    s3 = require('s3'),
    IMGR = require('imgr').IMGR,
    utils = require("../utils/hsautils"),
    async = require("async"),
    dir = "./public/images/gallery/";

var imgr = new IMGR({
  image_magick : true
});

var s3Client = s3.createClient({
    key: process.env.AWSACCESSKEY,
    secret: process.env.AWSSECRETKEY,
    bucket: "hatfeild"
});

// upload a file to s3
//var uploader = s3Client.upload(dir, encodeURIComponent("test3/2012-04-14 13.43.50.jpg"));
//uploader.on('error', function(err) {
//    console.error("unable to upload:", err.stack);
//});
//uploader.on('progress', function(amountDone, amountTotal) {
//    console.log("progress", amountDone, amountTotal);
//});
//uploader.on('end', function(url) {
//    console.log("file available at", url);
//});


//refactor this to use async to keep it a bit more sane and do the s3 upload
function writeFiles(path, files, index, success) {
    var f = files[index];
    var fullPath = path + "/" + f.name;
    var thumbPath = path + "/thumbs/" + f.name;

    imgr.load(f.path)
        .resizeToWidth(500)
        .save(fullPath, function(err){
            if(err){
                console.log(err);
                throw err;
            }

            imgr.load(f.path)
                .adaptiveResize(100,100,imgr.TOP)
                .save(thumbPath, function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    fs.unlink(f.path, function(err){
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        if(index < files.length-1){
                            process.nextTick(function(){
                                writeFiles(path, files, index+1, success);
                            });
                        } else {
                            process.nextTick(success);
                        }
                    });
                });
        });
}

function getAlbums(finished){
  var albums = [];
  fs.readdir(dir, function(err, files){
     async.map(files, function iterator(item, cb){
       fs.stat(dir + "/" + item, function(err, stat){
         var album = {
           path : item,
           isDirectory : stat.isDirectory()  
         }
         if(album.isDirectory){
           fs.readdir(dir + "/" + item, function(err, images) {
              album.thumb = images.length > 0 ? images[0] : null;
              cb(err, album);             
           });
         } else {
           cb(err, album);  
         }
       });
     }, function(err, results){
       if(err){
         console.log(err);
         throw err;
       }
       async.filter(results, function(item, cb){
         cb(item.isDirectory);  
       }, function(filtered) {
         async.each(filtered, function(item, cb){
           albums.push(item);
           cb();
         }, function(err){
           finished(err, albums);
         });  
       });
    });
   });
}

function getPhotos(path, finished){
  var photos = [];
  fs.readdir(path, function(err, files){
     async.map(files, function iterator(item, cb){
       fs.stat(path + "/" + item, function(err, stat){
         cb(err, {
           path : item,
           isFile : stat.isFile()  
         }); 
       });
     }, function(err, results){
       if(err){
         console.log(err);
         throw err;
       }
       async.filter(results, function(item, cb){
         cb(item.isFile);  
       }, function(filtered) {
         async.each(filtered, function(item, cb){
           photos.push(item);
           cb();
         }, function(err){
           finished(err, photos);
         });  
       });
    });
   });
}


exports.albums = function(req, res) {
  getAlbums(function(err, albums) {
    res.json(albums);  
  });  
}

exports.photos = function(req, res) {
  var album = req.param("album");
  var path = dir + album;
  getPhotos(path, function(err, photos) {
    res.json(photos);  
  });
}

exports.upload = function(req, res) {

    var album = req.param("name");
    var path = dir + album;
    var files = req.files.file instanceof Array ? req.files.file : [req.files.file];

    function success(){
        res.send(200, "ok");
    }

    writeFiles(path, files, 0, success);
}