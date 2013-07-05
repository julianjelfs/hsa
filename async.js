var async = require("async"),
    fs = require("fs"),
    dir = "./public/images/gallery/";

function finished(err) {
  console.log("finished");
}


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
     //get just directories
     async.filter(results, function(item, cb){
       cb(item.isDirectory);  
     }, function(filtered) {
       async.each(filtered, function(item, cb){
         console.log(JSON.stringify(item));
         cb();
       }, finished);  
     });
       
     
  });
 });

