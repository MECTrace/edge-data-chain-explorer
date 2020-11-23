/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getList(chain_id, parcel, from, num) {
  return new Promise(function(resolve, reject) {
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    query_str = "select * from s_requests where \
      (chain_id = ? and parcel_id = ?) \
      limit ?, ?";
    query_var = [chain_id, parcel, from, num];
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
  //getOne: getOne,
  //getLast: getLast,
  getList: getList,
}
