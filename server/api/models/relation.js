/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getAccountHistory(chain_id, address, anchor, from, num,
  include_tx, include_block) {
  return new Promise(function(resolve, reject) {
    anchor = Number(anchor);
    from = Number(from);
    num = Number(num);
    include_tx = include_tx === 'true';
    include_block = include_block === 'true';
    var query_str = "";
    var query_var = [];
    console.log(include_tx, include_block);
    if (include_tx) {
      query_str += "\
        ( \
          SELECT rat.`chain_id`, rat.`address`, \
            rat.`height`, rat.`index`, rat.`amount`, \
            c_txs.`type` `tx_type`, c_txs.`sender` `tx_sender`, \
            c_txs.fee `tx_fee`, c_txs.`tx_payload` \
          FROM r_account_tx rat \
            LEFT JOIN c_txs ON rat.chain_id = c_txs.chain_id \
            AND rat.height = c_txs.height AND rat.`index` = c_txs.`index` \
          WHERE rat.chain_id = ? \
            AND rat.`address` = ? "
            + (anchor > 0 ? "AND rat.height <= ? " : "")
      + " ORDER BY rat.`height` DESC LIMIT ? \
        ) \
      ";
      if (anchor > 0) {
        query_var = query_var.concat([
          chain_id, address, anchor, from + num]);
      } else {
        // anchor height will not be used when anchor = 0
        query_var = query_var.concat([
          chain_id, address, from + num]);
      }
    }
    if (include_block) {
      if (query_str.length > 0) {
        query_str += " UNION ALL ";
      }
      query_str += "\
        ( \
          SELECT rab.`chain_id`, rab.`address`, \
            rab.`height`, null `index`, rab.`amount`, \
            'block' `tx_type`, '', `tx_sender`, \
            '' `tx_fee`, '' `tx_payload` \
          FROM r_account_block rab \
          WHERE  rab.chain_id = ? \
            AND rab.`address` = ? "
            + (anchor > 0 ? "AND rab.height <= ? " : "")
      + " ORDER BY rab.`height` DESC LIMIT ? \
        ) \
      ";
      if (anchor > 0) {
        query_var = query_var.concat([
          chain_id, address, anchor, from + num]);
      } else {
        // anchor height will not be used when anchor = 0
        query_var = query_var.concat([
          chain_id, address, from + num]);
      }
    }
    if (query_str.length == 0) {
      return resolve([]);
    }

    query_str += " ORDER BY `height` DESC, `index` DESC LIMIT ?, ?";
    query_var = query_var.concat([from, num]);

    db.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getParcelHistory(chain_id, parcel_id, top, from, num) {
  return new Promise(function(resolve, reject) {
    top = Number(top);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    query_str = "\
      SELECT c_txs.* \
      FROM r_parcel_tx rpt \
        LEFT JOIN c_txs ON rpt.chain_id = c_txs.chain_id \
        AND rpt.height = c_txs.height AND rpt.`index` = c_txs.`index` \
      WHERE rpt.chain_id = ? \
        AND rpt.`parcel_id` = ? \
        AND rpt.height < ? \
      ORDER BY `height` DESC, `index` DESC LIMIT ?, ? \
    ";
    query_var = [chain_id, parcel_id, top, from, num];
    db.query(query_str, query_var, function(err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  getAccountHistory,
  getParcelHistory,
}
