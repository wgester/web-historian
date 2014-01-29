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

  var source = fs.createReadStream('./public' + asset);
  source.on('error', function() {
    res.writeHead(404, headers);
    res.end();
  });
  source.on('data', function() {
    res.writeHead(200, headers);
  });
  source.pipe(res);

};


