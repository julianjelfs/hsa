var fs = require("fs"),
    dir = "./public/images/gallery/";


function writeFiles(path, files, index, success) {
    var f = files[index];
    fs.readFile(f.path, function (err, data) {
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
            console.log("File written");
            if(index < files.length-1){
                writeFiles(path, files, index+1, success);
            } else {
                success();
            }
        });
    });

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

    fs.exists(path, function(exists){
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
    });
}