/* vim: set sw=2 ts=2 expandtab : */
var config = require('../../../db/config');
var mysql = require('mysql');

var param = config.db;
//param.supportBigNumbers = true;
//param.bigNumberStrings = true;
param.timezone = 'UTC';
var pool = mysql.createPool(param);
/*
conn.connect((err) => {
  if (err) {
    console.log('DB connection failed.');
    throw err;
  } else {
    console.log('DB connected.');
  }
});
*/

module.exports = pool;
