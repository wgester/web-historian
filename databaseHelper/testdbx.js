
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
   database  : 'webhist'
});

exports.readUrlsFromDB = function(url, cb){

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
                     cb(url, (data['body0'] + data['body1']+ data['body2']+ data['body3']));
                     ws.write(new Buffer(data, {'encoding': 'utf8'}), 'utf8');
                });

  readable.on('end', function() {
    connection.end();
  });

};

//isArchvied: SELECT id from urls where isARchived 


var writeArchivedUrlToDB = function(data, url){


  var obj = {
    url: url
  };

  var body = 'body';
  var dataSize = data.length;
  var blockSize = Math.pow(2,) - 1;
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
      if (err) throw err;
        console.log(result.insertId);
  });
  connection.end();
};

var str='One block!';
var url='http://www.singleblock.com';
console.log(str.length);
writeArchivedUrlToDB(str, url);

var str='Here is some junk that should fit just fine!';
var url='http://www.allok.com';
console.log(str.length);
writeArchivedUrlToDB(str, url);

var str='Here is some junk that will take every single spot!';
var str='This junk that will fill up the buffer with $ as last char!$';
var url='http://www.allok.com';
console.log(str.length);
writeArchivedUrlToDB(str, url);

var str='Here is some junk that is so long you\'ll miss the end fun .. haha!';
var url='http://www.junk.com';
console.log(str.length);
writeArchivedUrlToDB(str, url);

