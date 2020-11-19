/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const block = require('../models/block');
const tx = require('../models/tx');
const stat = require('../models/stat');

/**
 * @swagger
 * definitions:
 *   Height:
 *     name: height
 *     in: path
 *     description: block height to inspect
 *     required: true
 *     schema:
 *       type: integer
 *     style: simple
 *   BlockStat:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       last_height:
 *         type: integer
 *       num_blocks:
 *         type: integer
 *       num_txs:
 *         type: integer
 *       avg_num_txs:
 *         type: number
 *       avg_blk_tx_bytes:
 *         type: number
 *       avg_interval:
 *         type: number
 *   BlockInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       height:
 *         type: integer
 *       time:
 *         type: string
 *       hash:
 *         type: string
 *       num_txs:
 *         type: integer
 *       interval:
 *         type: number
 *       proposer:
 *         type: string
 *       num_txs_valid:
 *         type: integer
 *       num_txs_invalid:
 *         type: integer
 *       validator_updates:
 *         type: string
 *         description: marshalled JSON list of validator updates
 *       events_begin:
 *         type: string
 *         description: marshalled JSON list of block events
 *       events_end:
 *         type: string
 *         description: marshalled JSON list of block events
 */

/**
 * @swagger
 * /chain/{chain_id}/blocks:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - name: anchor
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
 *       - blocks
 *     description: Get block list in descending order of height
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Block list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/BlockInfo'
 *
 * /chain/{chain_id}/blocks?stat:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - name: non_empty
 *       in: query
 *       description: when supplied(without value), count non-empty blocks only
 *       allowEmptyValue: true
 *     - name: num_blks
 *       in: query
 *       description: "number of blocks for which the stat is calculated (0
 *         value means all blocks)"
 *       schema:
 *         type: integer
 *         default: 0
 *   get:
 *     tags:
 *       - blocks
 *     description: Get block stat in last `num_blks` blocks
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Block stat
 *         content:
 *           application:/json:
 *             schema:
 *               $ref: '#/definitions/BlockStat'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  if ('stat' in req.query) {
    var non_empty = 'non_empty' in req.query;
    var num_blks = req.query.num_blks || 0;
    stat.getBlockStat(chain_id, non_empty, num_blks)
      .then((ret) => {
        res.status(200);
        res.send(ret);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  } else {
    var anchor = req.query.anchor || 0;
    var from = req.query.from || 0;
    var num = req.query.num || 20;
    block.getList(chain_id, anchor, from, num)
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

/**
 * @swagger
 * /chain/{chain_id}/blocks/{height}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Height'
 *   get:
 *     tags:
 *       - blocks
 *     description: Get block info
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Block info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/BlockInfo'
 *       404:
 *         description: Block not found
 */
router.get('/:height([0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const height = req.params.height;
  block.getOne(chain_id, height)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows[0]);
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

/**
 * @swagger
 * /chain/{chain_id}/blocks/{height}/txs:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Height'
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
 *       - blocks
 *     description: Get list of txs in block
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: tx list in a block
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/TxInfo'
 *       404:
 *         description: Block not found
 */
router.get('/:height([0-9]+)/txs', function(req, res) {
  const chain_id = res.locals.chain_id;
  const height = req.params.height;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  tx.getListByBlock(chain_id, height, from, num)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows);
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

/**
 * @swagger
 * /chain/{chain_id}/blocks/{height}/txs/{index}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Height'
 *     - name: index
 *       in: path
 *       description: tx index in a block
 *       required: true
 *       schema:
 *         type: integer
 *       style: simple
 *   get:
 *     tags:
 *       - blocks
 *     description: Get a tx in block
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: tx info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/TxInfo'
 *       404:
 *         description: tx not found
 */
// CAUTION: uses tx model
router.get('/:height([0-9]+)/txs/:index([0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const height = req.params.height;
  const index = req.params.index;
  tx.getOne(chain_id, height, index)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows[0]);
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
