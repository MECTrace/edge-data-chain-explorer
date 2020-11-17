/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getOne(chain_id, node_id, from, to) {
  return new Promise(function(resolve, reject) {
    var query_str = "SELECT \
        n.`node_id`, n.`moniker`, h.`val_addr`, \
        h.`latest_block_height`, h.`latest_block_time`, \
        h.`catching_up`, h.`elapsed`, h.`timestamp` \
      FROM `nodes` n \
      LEFT JOIN `node_history` h \
      ON n.`chain_id` = h.`chain_id` AND n.`node_id` = h.`node_id` \
        AND n.`timestamp` = h.`timestamp` \
      WHERE n.`chain_id` = ? AND n.`node_id` = ?";
    query_var = [chain_id, node_id];
    val = {};
    db.query(query_str, query_var, function(err, rows, fields) {
        if(err) {
          return reject(err);
        }
        if(rows.length == 0) {
          return reject('not found');
        }
        var result = rows[0];
        
        // another query to get values for calculating uptime
        query_str = "SELECT `node_id`, COUNT(`timestamp`) `count` \
        FROM `node_history` \
        WHERE (`chain_id` = ? OR `chain_id` = 'ghost_chain_id') \
        AND (`node_id` = ? OR node_id = 'ghost_node_id') \
        AND `timestamp` BETWEEN ? AND ?";
        query_var = [chain_id, node_id, from, to];
        db.query(query_str, query_var, function(err, rows, fields) {
          if(err) {
            return reject(err);
          }
          if(rows.length == 0) {
            return reject('not found');
          }
          total_count = rows[rows.length-1].count;
          target_count = rows[0].count;
          result.uptime = target_count/total_count*100;
          resolve(result);
        });
    });
  });
}

async function getList(chain_id, from, to) {
    return new Promise(function(resolve, reject) {
        var query_str = "SELECT \
            n.`node_id`, n.`moniker`, h.`val_addr`, \
            h.`latest_block_height`, h.`latest_block_time`, \
            h.`catching_up`, h.`elapsed`, h.`timestamp` \
          FROM `nodes` n \
          LEFT JOIN `node_history` h \
          ON n.`chain_id` = h.`chain_id` AND n.`node_id` = h.`node_id` \
            AND n.`timestamp` = h.`timestamp` \
          WHERE n.`chain_id` = ? \
          ORDER BY n.`node_id`";
        var query_var = [chain_id, from, to];
        db.query(query_str, query_var, function(err, rows, fields) {
            if (err) {
              return reject(err);
            }
            if (rows.length == 0) {
              return reject('not found');
            }
            var result = rows;

            // another query to get values for calculating uptime
            query_str = "SELECT `node_id`, COUNT(`timestamp`) `count` \
            FROM `node_history` \
            WHERE (`chain_id` = ? OR `chain_id` = 'ghost_chain_id') \
            AND `timestamp` BETWEEN ? AND ? \
            GROUP BY `node_id` \
            ORDER BY `node_id`";
            query_var = [chain_id, from, to];
            db.query(query_str, query_var, function(err, rows, fields) {
              if(err) {
                return reject(err);
              }
              if(rows.length == 0) {
                return reject('not found');
              }
              total_count = rows[rows.length-1].count;
              for (i=0; i<rows.length-1; i++) {
                if (result[i].node_id == rows[i].node_id) {
                  target_count = rows[i].count;
                  result[i].uptime = target_count/total_count*100;
                }
              }
              resolve(result);
            });
        });
    });
}

async function getHistory(chain_id, node_id, anchor, from, num) {
    return new Promise(function(resolve, reject) {
        from = Number(from);
        num = Number(num);
        var query_str;
        var query_var;
        if (anchor == 0) {
          query_str = "SELECT \
            n.`node_id`, n.`moniker`, h.`val_addr`, \
            h.`latest_block_height`, h.`latest_block_time`, \
            h.`catching_up`, h.`elapsed`, h.`timestamp` \
          FROM `nodes` n \
          LEFT JOIN `node_history` h \
          ON n.`chain_id` = h.`chain_id` AND n.`node_id` = h.`node_id` \
          WHERE n.`chain_id` = ? AND n.`node_id` = ? \
          ORDER BY h.`timestamp` DESC \
          LIMIT ?, ?";
        query_var = [chain_id, node_id, from, num];
        } else { 
          query_str = "SELECT \
            n.`node_id`, n.`moniker`, h.`val_addr`, \
            h.`latest_block_height`, h.`latest_block_time`, \
            h.`catching_up`, h.`elapsed`, h.`timestamp` \
          FROM `nodes` n \
          LEFT JOIN `node_history` h \
          ON n.`chain_id` = h.`chain_id` AND n.`node_id` = h.`node_id` \
          WHERE n.`chain_id` = ? AND n.`node_id` = ? \
          AND h.`timestamp` <= ? \
          ORDER BY h.`timestamp` DESC \
          LIMIT ?, ?";
          query_var = [chain_id, node_id, anchor, from, num];
        }
        db.query(query_str, query_var, function(err, rows, fields) {
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
    });
}

module.exports = {
    getOne: getOne,
    getList: getList,
    getHistory: getHistory,
}
