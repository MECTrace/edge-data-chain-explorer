/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, address) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    // NOTE: unfortunately, mariadb 10.4 does not support JSON_ARRAYAGG().
    var query_str = "SELECT \
        `val_addr` `address`, `val_pubkey` `pubkey`, \
        `val_power` `power`, \
        `address` `owner`, `stake`, `eff_stake` \
      FROM `s_accounts` \
      WHERE `chain_id` = ? AND `val_addr` = ?";
    query_var = [chain_id, address];
    var val = {};
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      return resolve(rows[0]);
    });
  });
}

async function getList(chain_id, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str = "SELECT \
        `val_addr` `address`, `val_pubkey` `pubkey`, \
        `val_power` `power`, \
        `address` `owner`, `stake`, `eff_stake` \
      FROM `s_accounts` \
      WHERE `chain_id` = ? AND `val_addr` IS NOT NULL \
      ORDER BY CONVERT(`eff_stake`, DOUBLE) DESC LIMIT ?,?";
    var query_var = [chain_id, from, num];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// TODO: use temp table to capture the consistent list of delegators
async function getDelegators(chain_id, address, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    query_str = "SELECT r.`address`, r.`delegate` \
      FROM `s_accounts` l \
        LEFT JOIN `s_accounts` r ON l.`address` = r.`del_addr` \
      WHERE l.`chain_id` = ? AND l.`val_addr` = ? AND r.`address` IS NOT NULL \
      LIMIT ?,?";
    query_var = [chain_id, address, from, num];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  getOne: getOne,
  getList: getList,
  getDelegators: getDelegators,
}
