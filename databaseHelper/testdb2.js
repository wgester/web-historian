var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
   database  : 'webhist'
});

var obj = {};
if (true) bodypart = 'body2';
obj.url = 'http://newurl.com';
obj[bodypart] = 'and a new url';

connection.query('INSERT INTO urls SET ?', obj, function(err, result) {
    if (err) throw err;
      console.log(result.insertId);
});

connection.end();
