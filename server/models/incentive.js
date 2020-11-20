/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getList(chain_id, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str = "SELECT \
        `height`, `address`, `amount` \
      FROM `s_incentives` \
      WHERE `chain_id` = ? \
      ORDER BY `height` DESC \
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

async function getListByAddress(chain_id, address, anchor, from, num) {
  return new Promise(function(resolve, reject) {
    anchor = Number(anchor);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (anchor == 0) {
      query_str = "SELECT \
          `height`, `amount` \
        FROM `s_incentives` \
        WHERE `chain_id` = ? AND `address` = ? \
        ORDER BY `height` DESC \
        LIMIT ?, ?";
      query_var = [chain_id, address, from, num];
    } else {
      query_str = "SELECT \
          `height`, `amount` \
        FROM `s_incentives` \
        WHERE `chain_id` = ? AND `address` = ? AND `height` <= ? \
        ORDER BY `height` DESC \
        LIMIT ?, ?";
      query_var = [chain_id, address, anchor, from, num];
    }
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
