/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const account = require('../models/account');
const tx = require('../models/tx');
const relation = require('../models/relation');
const handleAccountIncentives = require('./incentives').handleAccountIncentives;
const handleAccountPenalties = require('./penalties').handleAccountPenalties;

/**
 * @swagger
 * definitions:
 *   Address:
 *     name: address
 *     in: path
 *     description: "account or validator address to inspect. Hexadecimal
 *       string."
 *     required: true
 *     schema:
 *       type: string
 *     style: simple
 *   AccountInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       address:
 *         type: string
 *       balance:
 *         type: string
 *         description: quoted decimal number
 *       stake:
 *         type: string
 *         description: quoted decimal number
 *       stake_locked:
 *         type: string
 *         description: quoted decimal number
 *       val_addr:
 *         type: string
 *         nullable: true
 *       delegate:
 *         type: string
 *         description: quoted decimal number
 *       del_addr:
 *         type: string
 *         nullable: true
 *       val_pubkey:
 *         type: string
 *         nullable: true
 *       val_power:
 *         type: string
 *         description: quoted decimal number
 *       eff_stake:
 *         type: string
 *         description: quoted decimal number
 *   BalanceChange:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       address:
 *         type: string
 *       height:
 *         type: integer
 *       index:
 *         type: integer
 *         nullabe: true
 *         description: when `type` is 'block', `index` is `null`
 *       amount:
 *         type: string
 *         description: quoted decimal number
 *       tx_type:
 *         type: string
 *         description: either 'block' or `type` of tx. `type` is 'block' when
 *           this balance change is due to validator incentive or penalty.
 *       tx_hash:
 *         type: string
 *         description: hash of tx
 *       tx_sender:
 *         type: string
 *         description: sender address of tx
 *       tx_fee:
 *         type: string
 *         description: quoted decimal number, fee of tx, always represented as
 *           positive number
 *       tx_payload:
 *         type: string
 *         description: JSON representation of tx's payload
 */

/**
 * @swagger
 * /chain/{chain_id}/accounts:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
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
 *       - accounts
 *     description: Get account list (not sorted)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Account list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/AccountInfo'
 */
// NOTE: accounts collective may give confusing result regarding `from` and
// `num` when the set of accounts changes over time. For now this is not used
// in the UI. So leave it to the future to correct this query.
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  account.getList(chain_id, false, from, num)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

/**
 * @swagger
 * /chain/{chain_id}/accounts/{address}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
 *   get:
 *     tags:
 *       - accounts
 *     description: Get account info by address
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Account info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/AccountInfo'
 */
router.get('/:address([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  account.getOne(chain_id, req.params.address)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows[0]);
      } else {
        // prepare empty account
        const acc = {
          chain_id: chain_id,
          address: req.params.address,
          balance: '0',
          stake: '0',
          stake_locked: '0',
          delegate: '0',
          val_power: '0',
          eff_stake: '0',
        }
        res.status(200);
        res.send(acc);
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

/**
 * @swagger
 * /chain/{chain_id}/accounts/{address}/txs:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
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
 *       - accounts
 *     description: Get tx list by sender address
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
 */
router.get('/:address([a-fA-F0-9]+)/txs', function(req, res) {
  const chain_id = res.locals.chain_id;
  var top = req.query.top || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  tx.getListBySender(chain_id, req.params.address, top, from, num)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

/**
 * @swagger
 * /chain/{chain_id}/accounts/{address}/incentives:
 *   get:
 *     tags:
 *       - accounts
 *     description: Alias of `/chain/{chain_id}/incentives/{address}`
 */
router.get('/:address([a-fA-F0-9]+)/incentives', handleAccountIncentives);

/**
 * @swagger
 * /chain/{chain_id}/accounts/{address}/penalties:
 *   get:
 *     tags:
 *       - accounts
 *     description: Alias of `/chain/{chain_id}/penalties/{address}`
 */
router.get('/:address([a-fA-F0-9]+)/penalties', handleAccountPenalties);

/**
 * @swagger
 * /chain/{chain_id}/accounts/{address}/history:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
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
 *     - name: include_tx
 *       in: query
 *       description: when true include tx history
 *       schema:
 *         type: boolean
 *         default: true
 *     - name: include_block
 *       in: query
 *       description: when true include block event history
 *       schema:
 *         type: boolean
 *         default: true
 *   get:
 *     tags:
 *       - accounts
 *     description: Get change history of the account balance
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: balance history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/BalanceChange'
 */
router.get('/:address([a-fA-F0-9]+)/history', function(req, res) {
  const chain_id = res.locals.chain_id;
  var anchor = req.query.anchor || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  var include_tx = 'include_tx' in req.query ? req.query.include_tx : 'true';
  var include_block = 'include_block' in req.query ? req.query.include_block : 'true';
  const address = req.params.address;
  relation.getAccountHistory(chain_id, address, anchor, from, num,
    include_tx, include_block)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
