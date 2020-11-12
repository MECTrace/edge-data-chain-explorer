/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getList() {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT `chain_id` FROM `c_blocks` GROUP BY `chain_id`";
    var query_var = [];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      if (rows.length == 0) {
        return reject('not found');
      }
      resolve(rows);
    });
  });
}

module.exports = { getList: getList }
