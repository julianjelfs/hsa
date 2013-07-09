var async = require("async"),
    fs = require("fs"),
    im = require('imagemagick'),
    dir = "./public/images/gallery/test/";

function finished(err) {
  console.log("finished");
}

//we can use imagemagick to determine the dimensions and work out how we want to 
//resize according to whether it is portrait or landscape - another layer of async!
//will need to pick each file up from its temp location to work out the crop

 fs.readdir(dir, function(err, files){
   async.map(files, function iterator(item, cb){   
     if(item !== "thumbs") {
        im.identify(dir + item, function(err, features){
          if (err) throw err
          console.log(features)
          // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
        });
     }
   }, function(err, results){
     if(err){
       console.log(err);
       throw err;
     }
  });
 });

