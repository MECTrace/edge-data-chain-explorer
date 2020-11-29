/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const tx = require('../models/tx');
const stat = require('../models/stat');

/**
 * @swagger
 * definitions:
 *   Hash:
 *     name: hash
 *     in: path
 *     description: tx hash to inspect. Need to be a hexadecimal string.
 *     required: true
 *     schema:
 *       type: string
 *     style: simple
 *   TxStat:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       tx_height:
 *         type: integer
 *       num_txs:
 *         type: integer
 *       num_txs_valid:
 *         type: integer
 *       num_txs_invalid:
 *         type: integer
 *       avg_fee:
 *         type: integer
 *       avg_tx_bytes:
 *         type: number
 *       avg_binding_lag:
 *         type: number
 *       max_binding_lag:
 *         type: integer
 *   TxInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       height:
 *         type: integer
 *       index:
 *         type: integer
 *       hash:
 *         type: string
 *       code:
 *         type: integer
 *       info:
 *         type: string
 *       type:
 *         type: string
 *       sender:
 *         type: string
 *       fee:
 *         type: string
 *       payload:
 *         type: string
 *         description: marshalled JSON object of tx payload
 *       last_height:
 *         type: integer
 *       tx_bytes:
 *         type: integer
 *       events:
 *         type: string
 *         description: marshalled JSON list of tx events
 */

/**
 * @swagger
 * /chain/{chain_id}/txs:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - name: top
 *       in: query
 *       description: anchor height to query (0 value means last block)
 *       schema:
 *         type: integer
 *         default: 0
 *     - name: from
 *       in: query
 *       description: offset from the result
 *       schema:
 *         type: integer
 *         default: 0
 *     - name: num
 *       in: query
 *       description: number of items to retrieve
 *       schema:
 *         type: integer
 *         default: 20
 *   get:
 *     tags:
 *       - txs
 *     description: Get tx list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Tx list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/TxInfo'
 *
 * /chain/{chain_id}/txs?stat:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - name: num_txs
 *       in: query
 *       description: number of txs for which the stat is calculated (0 value means all txs)
 *       schema:
 *         type: integer
 *         default: 0
 *   get:
 *     tags:
 *       - txs
 *     description: Get tx stat
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Tx stat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/TxStat'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  if ('stat' in req.query) {
    var num_txs = req.query.num_txs || 0;
    stat.getTxStat(chain_id, num_txs)
      .then((ret) => {
        res.status(200);
        res.send(ret);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  } else {
    var top = req.query.top || 0;
    var from = req.query.from || 0;
    var num = req.query.num || 20;
    tx.getList(chain_id, top, from, num)
      .then((rows) => {
        res.status(200);
        res.send(rows);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  }
});

// NOTE: this endpoint will return list.
// see note of tx.searchHash()
/**
 * @swagger
 * /chain/{chain_id}/txs/{hash}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Hash'
 *   get:
 *     tags:
 *       - txs
 *     description: "Get list of tx info by hash. This API will return list of
 *       txs rather than one tx. This is for the case when there are multiple
 *       txs having the same hash. This is possible since a user may send the
 *       same tx multiple times. In that case, the first tx would be included
 *       in the chain with valid or invalid status, while the remaining txs
 *       would be STILL be included in the chain with INVALID status."
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of tx info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/TxInfo'
 *       404:
 *         description: Tx not found
 */
router.get('/:hash([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const hash = req.params.hash;
  tx.searchHash(chain_id, hash)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows);
      } else {
        res.status(404);
        res.send('not found');
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
