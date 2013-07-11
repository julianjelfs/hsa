var fs = require("fs"),
    s3 = require('s3'),
    mkdirp = require('mkdirp')
    gm = require('gm').subClass({ imageMagick: true }),
    utils = require("../utils/hsautils"),
    async = require("async"),
    dir = "./public/images/gallery/";


var s3Client = s3.createClient({
    key: process.env.AWSACCESSKEY,
    secret: process.env.AWSSECRETKEY,
    bucket: "hatfeild"
});

exports.upload = function(req, res) {

    var album = req.param("name");
    var path = album;
    var files = req.files.file instanceof Array ? req.files.file : [req.files.file];
    var tmp = process.env.TMPDIR + "/" + album + "/";
    var thumbTemp = tmp + "thumbs" + "/";

    async.map(files, function iterator(f, cb){

        var fullPath = path + "/" + f.name;
        var thumbPath = path + "/thumbs/" + f.name;

        var i = gm(f.path);
        var ar = null;
        i.size(function(err, size){
            if(err || !size){
                callback(err);  //couldn't work out size
            } else {
                ar = size.width / size.height;

                async.series([
                    //Create the output dir if it doesn't already exist
                    function makeTempDir(callback){
                        mkdirp(tmp, callback);
                    },
                    function mainResizeWrite(callback){
                        i.resize(ar < 0 ? 500 : 800)
                            .write(tmp + f.name, callback);
                    },
                    function mainUpload(callback){
                        var uploader = s3Client.upload(tmp + f.name, encodeURIComponent(fullPath));
                        uploader.on('error', function(err) {
                            callback(err);
                        });
                        uploader.on('end', function(url) {
                            callback(null);
                        });
                    },
                    function makeTempDir(callback){
                        mkdirp(thumbTemp, callback);
                    },
                    function thumbResizeWrite(callback){
                        i.crop(150,150,0,0)
                            .write(thumbTemp + f.name, callback);
                    },
                    function thumbUpload(callback){
                        var uploader = s3Client.upload(thumbTemp + f.name, encodeURIComponent(thumbPath));
                        uploader.on('error', function(err) {
                            callback(err);
                        });
                        uploader.on('end', function(url) {
                            callback(null);
                        });
                    },
                    function deleteTempFiles(callback){
                        async.parallel([
                            function(callback2){
                                fs.unlink(tmp + f.name, callback2);
                            },
                            function(callback2){
                                fs.unlink(thumbTemp + f.name, callback2);
                            },
                            function(callback2){
                                fs.unlink(f.path, callback2);
                            }
                        ], callback);
                    }
                ], cb)
            }
        });
    }, function(err, results){
        if(err){
            console.error(err);
            throw err;
        }
        res.send(200, "ok");
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

