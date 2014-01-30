var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === "POST"){
    if (req.url !== "/"){
      res.writeHead(404, httpHelpers.headers);
      res.end();
      return;
    }
    httpHelpers.fetchAsset( req, res );
    return;
  }
  if (req.method === "GET"){
    req.url += (req.url === '/') ? 'index.html' : '';
    httpHelpers.serveAssets( res, archive.paths['siteAssets'] + req.url );
    return;
  }
  res.writeHead(404, httpHelpers.headers);
  res.end(null);
};
