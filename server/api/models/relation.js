/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');

async function getAccountHistory(chain_id, address, top, from, num, tx_only) {
  return new Promise(function(resolve, reject) {
    top = Number(top);
    from = Number(from);
    num = Number(num);
    var query_str;
    var query_var;
    if (tx_only) {
      // exclude results from r_account_block table
      query_str = "\
        ( \
          SELECT ct.`height` , ct.`index`, -ct.fee amount, 'tx fee' `type` \
          FROM c_txs ct \
          WHERE ct.chain_id = ? \
            AND ct.`sender` = ? \
            AND ct.height < ? \
            AND ct.fee != '0' \
          ORDER BY ct.`height` DESC LIMIT ? \
        ) UNION ALL ( \
          SELECT rat.`height`, rat.`index`, rat.`amount`, c_txs.`type` `type` \
          FROM r_account_tx rat \
            LEFT JOIN c_txs ON rat.chain_id = c_txs.chain_id \
            AND rat.height = c_txs.height AND rat.`index` = c_txs.`index` \
          WHERE rat.chain_id = ? \
            AND rat.`address` = ? \
            AND rat.height < ? \
          ORDER BY rat.`height` DESC LIMIT ? \
        ) \
        ORDER BY `height` DESC, `index` DESC LIMIT ?, ? \
      ";
      query_var = [chain_id, address, top, from + num,
        chain_id, address, top, from + num, from, num];
    } else {
      query_str = "\
        ( \
          SELECT ct.`height` , ct.`index`, -ct.fee amount, 'tx_fee' `type` \
          FROM c_txs ct \
          WHERE ct.chain_id = ? \
            AND ct.`sender` = ? \
            AND ct.height < ? \
            AND ct.fee != '0' \
          ORDER BY ct.`height` DESC LIMIT ? \
        ) UNION ALL ( \
          SELECT rat.`height`, rat.`index`, rat.`amount`, c_txs.`type` \
          FROM r_account_tx rat \
            LEFT JOIN c_txs ON rat.chain_id = c_txs.chain_id \
            AND rat.height = c_txs.height AND rat.`index` = c_txs.`index` \
          WHERE rat.chain_id = ? \
            AND rat.`address` = ? \
            AND rat.height < ? \
          ORDER BY rat.`height` DESC LIMIT ? \
        ) UNION ALL ( \
          SELECT rab.`height`, null `index`, rab.`amount`, 'block' `type` \
          FROM r_account_block rab \
          WHERE  rab.chain_id = ? \
            AND rab.`address` = ? \
            AND rab.height < ? \
          ORDER BY rab.`height` DESC LIMIT ? \
        ) \
        ORDER BY `height` DESC, `index` DESC LIMIT ?, ? \
      ";
      query_var = [chain_id, address, top, from + num,
        chain_id, address, top, from + num,
        chain_id, address, top, from + num, from, num];
    }
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
