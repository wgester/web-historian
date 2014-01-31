
var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
   database  : 'webhist'
});

var tester = exports.readUrlsFromDB = function(url, cb){

  var Writable = require('stream').Writable;
  var ws = Writable({decodeStrings: true});

  ws._write = function (chunk, enc, next) {
    console.log('encoding: ', enc);
    //for(var p in chunk) {
      console.log('YOU CALLED MY METHOD');
      console.log(chunk);
    //}
    //writeStream.write(chunk);
    next();
  };

  var writeStream = fs.createWriteStream('someFile.txt', {flags: 'w', decodeStrings: false});

  console.log('Starting Query');
  
  var readable = connection
                .query('SELECT * FROM `urls`')
                .stream({encoding:'utf8'})
                .pipe(ws);

//var readable = connection
                //.query('SELECT * FROM `urls`')
                //.stream()
                //.on('data', function(data) {
                   //console.log(data);
                //});
                //.pipe(ws);

 // readable.on('end', function() {
  //  connection.end();
 // });

};

tester('http://wwww.google.com', function() {
      console.log('callback');
     }
    );

