/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, height) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    if (height == 0) {
      query_str = "select * from c_blocks where (chain_id = ?) \
        order by height desc limit 1";
      query_var = [chain_id];
    } else {
      query_str = "select * from c_blocks where (chain_id = ?) \
        and (height = ?)";
      query_var = [chain_id, height];
    }
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getLast(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT * FROM `c_blocks` WHERE (`chain_id` = ?) \
      ORDER BY `height` DESC LIMIT 1";
    var query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      if (rows.length == 0) {
        return reject('not found');
      }
      resolve(rows[0]);
    });
  });
}

async function getList(chain_id, anchor, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (anchor == 0) {
      query_str = "select * from c_blocks \
        where (chain_id = ?) \
        order by height desc limit ?,?";
      query_var = [chain_id, from, num];
    } else {
      query_str = "select * from c_blocks \
        where (chain_id = ?) and (height <= ?) \
        order by height desc limit ?,?";
      query_var = [chain_id, anchor, from, num];
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
  getOne: getOne,
  getLast: getLast,
  getList: getList,
}
