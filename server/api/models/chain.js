/* vim: set sw=2 ts=2 expandtab : */
const db = require('../db/db');
const stat = require('./stat');
const block = require('./block');
const tx = require('./tx');

async function getSummary(chain_id, non_empty, num_blks, num_txs) {
  return Promise.all([
    stat.getBlockStat(chain_id, non_empty, num_blks),
    stat.getTxStat(chain_id, num_txs),
    stat.getAssetStat(chain_id),
    block.getLast(chain_id),
    tx.getLast(chain_id),
  ])
    .then((res) => {
      //var ret = {};
      var ret = { ...res[0] };
      ret.num_txs_valid = res[1]?res[1].num_txs_valid:0
      ret.num_txs_invalid = res[1]?res[1].num_txs_invalid:0;
      ret.avg_binding_lag = res[1]?res[1].avg_binding_lag:0;
      ret.max_binding_lag = res[1]?res[1].max_binding_lag:0;
      ret.active_coins = res[2]?res[2].active_coins:0;
      ret.stakes = res[2]?res[2].stakes:0;
      ret.delegates = res[2]?res[2].delegates:0;
      ret.height = res[3].height;
      ret.time = res[3].time;
      ret.tx_height = res[4]?res[4].height:0;
      ret.tx_index = res[4]?res[4].index:0;
      // reform
      ret.chain_id = res[0].chain_id;
      ret.block_stat = res[0];
      ret.tx_stat = res[1];
      ret.asset_stat = res[2];
      return ret;
    });
}

module.exports = {
  getSummary: getSummary,
}
