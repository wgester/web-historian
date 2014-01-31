var fs = require('fs');
var path = require('path');
var fetcher = require('../workers/htmlfetcher');
var db = require('../databaseHelper/dataBaseHelpers');

/* You will need to reuse the same paths many times over in the course of this sprint.
  Consider calling this function in `request-handler.js` and passing in the necessary
  directories/files. This way, if you move any files, you'll only need to change your
  code in one place! Feel free to customize it in any way you wish.
*/

exports.paths = paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  for(var type in pathsObj) {
    // Check that the type is valid
    if (exports.paths[type] && pathsObj.hasOwnProperty(type)) {
      exports.paths[type] = pathsObj[type];
    }
  }
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

var readListOfUrls = function(cb){
  fs.readFile(paths['list'], function(err, data) {
    if(err) {
       throw error;
    }
    var array = data.toString().split("\n");
    cb(array);
  });
};

var writeArchivedUrl = function(data, url) {
  var fileName = paths['archivedSites'] + '/' + url;
  fs.writeFile(fileName, data, function() {
    console.log();
  });
};

var readArchivedUrls = function(cb){
  fs.readdir(paths['archivedSites'], function(err, files){
    if (err){
      console.log("You got a problem");
    }
    cb(files);
  });
};

var isUrlInList = exports.isUrlInList = function(url, cb){
  readListOfUrls(function(array){
     cb(array.indexOf(url) > -1);
  });
};

var addUrlToList = exports.addUrlToList = function(url){
  isUrlInList(url, function(urlExistsInList){
    if (!urlExistsInList){
      var list = fs.createWriteStream(paths['list'], {'flags': 'a'});
      list.write(url + '\n');
    }
  });
};

exports.isUrlArchived = function(url, cb){
  readArchivedUrls(function(files){
    if (files.indexOf(url) > -1){
      cb(true);
      return;
    }
    cb(false);
  });
};


var getUnarchivedList = function(cb){
  var listToDownload = [];
  var archivedSet = {};
  readArchivedUrls( function(archivedList) {
    archivedList.forEach( function(url) {
      archivedSet[url] = url;
    });
    readListOfUrls(function(list){
       list.forEach( function(urlInList) {
          if (!archivedSet.hasOwnProperty(urlInList)) {
            listToDownload.push(urlInList);
          }
       });
       cb(listToDownload);
    });
  });
};

//oppurtunity to use deffered objects
var downloadUrls = exports.downloadUrls = function(){
  getUnarchivedList(function(listToDownload){
    listToDownload.forEach(function(url){
      fetcher.fetch(url, function(data){
        //console.log('fetcher.fetch about to writeArchivedUrl ', data);
        db.writeArchivedUrl( data, url );
      });
    });
  });
};