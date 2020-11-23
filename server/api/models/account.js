/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, address) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_accounts \
      where (chain_id = ? and address = ?)";
    query_var = [chain_id, address];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getOneByValidator(chain_id, address) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_accounts \
      where (chain_id = ? and val_addr = ?)";
    query_var = [chain_id, address];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getList(chain_id, val_only, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (val_only) {
      query_str = "select * from s_accounts \
        where (chain_id = ? and val_addr is not null) \
        limit ?,?";
      query_var = [chain_id, from, num];
    } else {
      query_str = "select * from s_accounts \
        where (chain_id = ?) \
        limit ?,?";
      query_var = [chain_id, from, num];
    }
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  //getStat: getStat,
  getOne: getOne,
  getOneByValidator: getOneByValidator,
  //getLast: getLast,
  getList: getList,
}
