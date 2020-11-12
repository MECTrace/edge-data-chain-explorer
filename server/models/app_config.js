/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getLast(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_drafts \
      where (chain_id = ?) and (draft_id = ?) order by draft_id desc limit 1";
    query_var = [chain_id, draft_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows[0].config);
    });
  });
}

module.exports = {
  getLast: getLast,
}
