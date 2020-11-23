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
 *         description: when `type` is 'block', `index` is `null`
 *         nullabe: true
 *       amount:
 *         type: string
 *         description: quoted decimal number
 *       type:
 *         type: string
 *         description: one of 'tx_fee', 'block' and `type` of tx
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
 *     - name: tx_only
 *       in: query
 *       description: when true retrieve tx history only, otherwise retrieve
 *         block events also
 *       schema:
 *         type: boolean
 *         default: false
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
  var top = req.query.top || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  var tx_only = 'tx_only' in req.query;
  const address = req.params.address;
  relation.getAccountHistory(chain_id, address, top, from, num, tx_only)
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
