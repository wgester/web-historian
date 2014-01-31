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
  console.log('isBuffer: ', Buffer.isBuffer(chunk) );
  console.log('',chunk);
  next();
};

console.log('Starting Query');

var readable = connection
              .query('SELECT `url`, `body1` FROM `urls`')
              .stream()
              .on('data', function(data) {
                  console.log(data);
                   ws.write(new Buffer(data, {'encoding': 'utf8'}), 'utf8');
              });

readable.on('end', function() {
  connection.end();
});


exports.writeArchivedUrlToDB = function(data, url){

  var mysql = require('mysql');

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database  : 'webhist'
   });

  var obj = {
    url: url
  };

  var body = 'body';
  var dataSize = data.length;
  var blockSize = Math.pow(2, 16) - 1;
  var numBlocksIndB = 4;
  var blocks = Math.min( numBlocksIndB, Math.floor( dataSize / blockSize ) );

  if (dataSize > numBlocksIndB * blockSize)  {
    console.log('Warning: data clipped for URL ', url);
  }

  for(var block = 0; block < blocks; block++) {
    obj[ 'body' + (block) ] = data.slice(block*blockSize, (block + 1) * blockSize);
  }
  if (block) {
    if (block < numBlocksIndB) {
     obj[ 'body' + block] = data.slice(block * blockSize);
    }
  } else {
    obj[ 'body0' ] = data;
  }

  connection.query('INSERT INTO urls SET ?', obj, function(err, result) {
    if (err) console.log(err);
    console.log(result.insertId);
  });
  connection.end();
};


