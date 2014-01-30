var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset) {
  var source = fs.createReadStream( asset );
  source.on('error', function() {
    res.writeHead(404, headers);
    res.end();
  });
  source.on('data', function() {
    res.writeHead(200, headers);
  });
  source.pipe(res);
};

exports.fetchAsset = function(req, res){
  readPost(req, function(url) {
    archive.isUrlInList(url, function(exists){
      console.log('Url ', url, (exists?'exists':'does not exist') );
    });
  });
};

var readPost = function(req, cb){
  var collection = "";
  req.on('data', function(data) {
    collection += data;
  });
  req.on('end', function(){
    cb( collection.slice(4) );
  });
};