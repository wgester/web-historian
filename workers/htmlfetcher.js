var http = require('http');

var fetch = exports.fetch = function(url, cb){
  url = 'http://' + url;
  http.get(url, function(response){
    var collection = "";
    response.on('data', function(data){
      collection += data;
    });
    response.on('end', function(data){
      collection += data;
      cb(collection);
    });
    response.on('error', function(error){
      console.log("response error from html get");
    });
  }).on('error', function(error){
      console.log("this is an error from htmlfetcher.fetch");
     });
};
