var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
   database  : 'webhist'
});

var Writable = require('stream').Writable;
var ws = Writable();

ws._write = function (chunk, enc, next) {
  console.log('encoding: ', enc);
  console.log('',chunk);
  next();
};

console.log('Starting Query');

var readable = connection
              .query('SELECT * FROM `urls`')
              .stream()
              .on('data', function(data) {
                  console.log('url: ', data['url'], 'body ', data['body0'] + data['body1']+ data['body2']+ data['body3']);
                   ws.write(new Buffer(data, {'encoding': 'utf8'}), 'utf8');
              });

readable.on('end', function() {
  connection.end();
});
