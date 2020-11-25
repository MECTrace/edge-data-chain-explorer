/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

function elaborate(draft) {
  if (draft.open_count > 0) {
    draft.status = 'waiting';
  } else if (draft.close_count > 0) {
    draft.status = 'voting';
  } else if (draft.apply_count > 0) {
    draft.status = 'closed';
  } else if (draft.applied_at > 0) {
    draft.status = 'applied';
  } else {
    draft.status = 'rejected';
  }
}

async function getOne(chain_id, draft_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "select * from s_drafts \
      where (chain_id = ?) and (draft_id = ?)";
    query_var = [chain_id, draft_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      if (rows.length == 0) {
        return resolve();
      }
      elaborate(rows[0]);
      resolve(rows[0]);
    });
  });
}

async function getList(chain_id, anchor, from, num) {
  return new Promise(function(resolve, reject) {
    anchor = Number(anchor);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (anchor == 0) {
      query_str = "SELECT * FROM `s_drafts` \
        WHERE (`chain_id` = ?) \
        ORDER BY `draft_id` DESC LIMIT ?,?";
      query_var = [chain_id, from, num];
    } else {
      query_str = "SELECT * FROM `s_drafts` \
        WHERE (`chain_id` = ?) AND (`draft_id` <= ?) \
        ORDER BY `draft_id` DESC LIMIT ?,?";
      query_var = [chain_id, anchor, from, num];
    }
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      for (i = 0; i <  rows.length; i++) {
        elaborate(rows[i]);
      }
      resolve(rows);
    });
  });
}

async function getVotes(chain_id, draft_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "SELECT v.chain_id, v.draft_id, v.voter, v.approve, \
      CASE WHEN v.`tally` = 0 THEN a.`eff_stake` ELSE v.`tally` END `tally` \
      FROM `s_votes` v \
        LEFT JOIN `s_accounts` a ON v.`chain_id` = a.`chain_id` \
          AND v.`voter` = a.`address` \
      WHERE v.`chain_id` = ? AND v.`draft_id` = ?";
    query_var = [chain_id, draft_id];
    db.query(query_str, query_var, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getVotesAbsent(chain_id, draft_id) {
  return new Promise(function(resolve, reject) {
    var query_str;
    var query_var;
    query_str = "SELECT a.`chain_id`, CONVERT(?, INT) `draft_id`, \
        a.`address` `voter`, NULL `approve`, a.`eff_stake` `tally` \
      FROM `s_accounts` a LEFT JOIN ( \
        SELECT * FROM `s_votes` WHERE `chain_id` = ? AND `draft_id` = ?) v \
      ON v.`chain_id` = a.`chain_id` AND v.`voter` = a.`address` \
      WHERE a.`chain_id` = ? AND a.`eff_stake` != '0' \
        AND v.`voter` IS NULL";
    query_var = [draft_id, chain_id, draft_id, chain_id];
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
  getVotes: getVotes,
  getVotesAbsent: getVotesAbsent,
}
