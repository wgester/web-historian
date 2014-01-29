var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!



exports.handleRequest = function (req, res) {
  if (req.method === "GET"){
    httpHelpers.serveAssets( res, req.url );
    return;
  }
  res.writeHead(404, httpHelpers.headers);
  res.end(null);
};
