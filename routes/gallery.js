var fs = require("fs"),
    IMGR = require('imgr').IMGR,
    dir = "./public/images/gallery/";

var imgr = new IMGR({
  image_magick : true,
    trace : function(ev){
        console.log(ev);
    }
});

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
                .resizeToWidth(100)
                .save(thumbPath, function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    console.log("File written to " + fullPath);
                    console.log("Trying to delete to " + f.path);
                    fs.unlink(f.path, function(err){
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        console.log("Deleted " + f.path);
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

    /*fs.readFile(f.path, function (err, data) {
        if(err){
            console.log(err);
            throw err;
        }
        console.log(f.name);
        var fullPath = path + "/" + f.name;
        console.log("Trying to write to " + fullPath);
        fs.writeFile(fullPath, data, function (err) {
            if(err){
                console.log(err);
                throw err;
            }
            console.log("File written to " + fullPath);
            console.log("Trying to delete to " + f.path);
            fs.unlink(f.path, function(err){
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log("Deleted " + f.path);
                if(index < files.length-1){
                    process.nextTick(function(){
                        writeFiles(path, files, index+1, success);
                    });
                } else {
                    process.nextTick(success);
                }
            });
        });
    });*/
}

exports.upload = function(req, res) {

    var album = req.param("name");
    var path = dir + album;
    var files = req.files.file instanceof Array ? req.files.file : [req.files.file];

    console.log("uploading some photos to album " + album);
    console.log("We are here: " + __dirname);

    function success(){
        res.send(200, "ok");
    }

    writeFiles(path, files, 0, success);

    /*fs.exists(path, function(exists){
        if(!exists){
            fs.mkdir(path, function(err){
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log("Directory "+ path +" written");
                writeFiles(path, files, 0, success);
            });
        } else {
            writeFiles(path, files, 0, success);
        }
    });*/
}