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

var serveAssets = exports.serveAssets = function(res, asset) {
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
    archive.isUrlArchived(url, function(urlExists){
        if (urlExists) {
          serveAssets(res, archive.paths['archivedSites'] + '/' + url);
        } else {
          serveAssets(res, archive.paths['siteAssets'] + '/loading.html');
          archive.addUrlToList(url);
        }
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