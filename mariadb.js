const mysql = require('mysql2');

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root',
  database : 'Bookstore',
  dateStrings : true
});

module.exports = connection;