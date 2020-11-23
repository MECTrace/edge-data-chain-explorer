/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, parcel_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_parcels \
      where (chain_id = ? and parcel_id = ?)";
    query_var = [chain_id, parcel_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      for (i = 0; i < rows.length; i++) {
        rows[i].on_sale = rows[i].on_sale > 0 ? true : false;
      }
      resolve(rows);
    });
  });
}

module.exports = {
  //getStat: getStat,
  getOne: getOne,
  //getLast: getLast,
  //getList: getList,
}
