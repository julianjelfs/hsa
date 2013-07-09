var s3 = require('s3'),
    dir = "./public/images/gallery/test3/2012-04-14 13.43.50.jpg";


console.log("AWSACCESSKEY:" + process.env.AWSACCESSKEY);
console.log("AWSSECRETKEY:" + process.env.AWSSECRETKEY);

// createClient allows any options that knox does.
var client = s3.createClient({
  key: process.env.AWSACCESSKEY,
  secret: process.env.AWSSECRETKEY,
  bucket: "hatfeild",
  encodePaths : true
});

// upload a file to s3
var uploader = client.upload(dir, encodeURIComponent("test3/2012-04-14 13.43.50.jpg"));
uploader.on('error', function(err) {
  console.error("unable to upload:", err.stack);
});
uploader.on('progress', function(amountDone, amountTotal) {
  console.log("progress", amountDone, amountTotal);
});
uploader.on('end', function(url) {
  console.log("file available at", url);
});