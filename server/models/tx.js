/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, height, index) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    if (height == 0 && index == 0) {
      query_str = "select * from c_txs where (chain_id = ?) \
        order by height desc, `index` desc limit 1";
      query_var = [chain_id];
    } else {
      query_str = "select * from c_txs where (chain_id = ?) \
        and (height = ? and `index` = ?)";
      query_var = [chain_id, height, index];
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
    var query_str = "SELECT * FROM `c_txs` WHERE (`chain_id` = ?) \
      ORDER BY `height` DESC, `index` DESC LIMIT 1";
    var query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows[0]);
    });
  });
}

// NOTE: tx hash may not be unique in some cases, e.g. replayed txs
async function searchHash(chain_id, hash) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = 'select * from c_txs where (chain_id = ?) \
      and (hash = ?) \
      order by height desc, `index` desc';
    query_var = [chain_id, hash];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getList(chain_id, top, from, num) {
  return new Promise(function(resolve, reject) {
    top = Number(top); // TODO: rename it to anchor
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (top == 0) {
      query_str = "select * from `c_txs` where (`chain_id` = ?) \
        order by `height` desc, `index` desc limit ?,?";
      query_var = [chain_id, from, num];
    } else {
      query_str = "select * from `c_txs` where (`chain_id` = ?) \
        and (`height` <= ?) \
        order by `height` desc, `index` desc limit ?,?";
      query_var = [chain_id, top, from, num];
    }
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getListByBlock(chain_id, height, from, num) {
  return new Promise(function(resolve, reject) {
    height = Number(height);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    query_str = "select * from `c_txs` where (`chain_id` = ?) \
      and (`height` = ?) \
      order by `height` desc, `index` desc limit ?,?";
    query_var = [chain_id, height, from, num];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getListBySender(chain_id, address, top, from, num) {
  return new Promise(function(resolve, reject) {
    top = Number(top);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (top == 0) {
      query_str = "select * from `c_txs` where (`chain_id` = ?) \
        and (`sender` = ?) \
        order by `height` desc, `index` desc limit ?,?";
      query_var = [chain_id, address, from, num];
    } else {
      query_str = "select * from `c_txs` where (`chain_id` = ?) \
        and (`sender` = ?) and (`height` <= ?) \
        order by `height` desc, `index` desc limit ?,?";
      query_var = [chain_id, address, top, from, num];
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
  searchHash: searchHash,
  getList: getList,
  getListByBlock: getListByBlock,
  getListBySender: getListBySender,
}
