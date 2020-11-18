/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const penalty = require('../models/penalty');

/**
 * @swagger
 * definitions:
 *   PenaltyWAddr:
 *     type: object
 *     properties:
 *       height:
 *         type: number 
 *       address:
 *         type: string
 *       amount:
 *         type: string
 *   PenaltyWOAddr:
 *     type: object
 *     properties:
 *       height:
 *         type: number 
 *       amount:
 *         type: string
 */

/**
 * @swagger
 * /chain/{chain_id}/penalties:
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
 *       - penalties 
 *     description: Get penalty list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Penalty list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/PenaltyWAddr'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  penalty.getList(chain_id, from, num)
    .then((rows) => {
      if (rows) {
        res.status(200);
        res.send(rows);
      } else {
        res.status(400);
        res.send('not found');
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

function handleAccountPenalties(req, res) {
  const chain_id = res.locals.chain_id;
  const address = req.params.address;
  var anchor = req.query.anchor || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  penalty.getListByAddress(chain_id, address, anchor, from, num)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
}

/**
 * @swagger
 * /chain/{chain_id}/penalties/{address}:
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
 *   get:
 *     tags:
 *       - penalties 
 *     description: Get given node's penalty list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Incentive list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/PenaltyWOAddr'
 */
router.get('/:address([a-fA-F0-9]+)', handleAccountPenalties);

module.exports = router;
module.exports.handleAccountPenalties = handleAccountPenalties;
