/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getList(chain_id, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str = "SELECT \
        `height`, `address`, `amount` \
      FROM `s_penalties` \
      WHERE `chain_id` = ? \
      LIMIT ?, ?";
    var query_var = [chain_id, from, num];
    db.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
}

async function getListByAddress(chain_id, address, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str = "SELECT \
        `height`, `amount` \
      FROM `s_penalties` \
      WHERE `chain_id` = ? AND `address` = ? \
      LIMIT ?, ?"; var query_var = [chain_id, address, from, num];
    val = {};
    db.query(query_str, query_var, function(err, rows, fields) {
      if(err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
}

module.exports = {
  getList: getList,
  getListByAddress: getListByAddress,
}
