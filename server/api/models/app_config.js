/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getLast(chain_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "SELECT `genesis` FROM `c_genesis` WHERE (`chain_id` = ?)";
    query_var = [chain_id];
    db.query(query_str, query_var, function (err, rows) {
      if (err) {
        return reject(err);
      }
      if (rows.length == 0) {
        return reject('no genesis');
      }
      // `genesis` is a JSON object
      let config = JSON.parse(rows[0].genesis).app_state.config;

      // filter applied drafts only
      query_str = "SELECT `config` FROM `s_drafts` \
        WHERE `chain_id` = ? AND `applied_at` > 0 ORDER BY `draft_id`";
      query_var = [chain_id];
      db.query(query_str, query_var, function (err, rows) {
        if (err) {
          return reject(err);
        }
        rows.forEach(r => {
          config = {...config, ...JSON.parse(r.config)};
        });
        return resolve(config);
      });
    });
  });
}

module.exports = {
  getLast: getLast,
}
