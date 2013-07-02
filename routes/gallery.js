var papercut = require('papercut');

papercut.configure(function(){
    papercut.set('storage', 'file')
    papercut.set('directory', '../public/images/gallery')
    papercut.set('url', '/images/uploads')
});

/*papercut.configure('production', function(){
    papercut.set('storage', 's3')
    papercut.set('S3_KEY', process.env.S3_KEY)
    papercut.set('S3_SECRET', process.env.S3_SECRET)
    papercut.set('bucket', 'papercut')
});*/


ImageUploader = papercut.Schema(function(schema){

    schema.version({
        name: 'normal',
        size: '600x400',
        process: 'crop'
    });

    schema.version({
        name: 'small',
        size: '50x50',
        process: 'crop'
    });
});

var imageId = 0;

exports.upload = function(req, res) {
    var uploader = new ImageUploader();

    uploader.process(imageId++, req.files.file.path, function(err, images){
        console.log(images.avatar); // '/images/uploads/image1-avatar.jpg'
        console.log(images.small); // '/images/uploads/image1-small.jpg'

        res.send(200, "image uploaded");
    })
}