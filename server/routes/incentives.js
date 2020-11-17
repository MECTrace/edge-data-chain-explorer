/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const incentive = require('../models/incentive');

/**
 * @swagger
 * definitions:
 *   IncentiveWAddr:
 *     type: object
 *     properties:
 *       height:
 *         type: number 
 *       address:
 *         type: string
 *       amount:
 *         type: string
 *   IncentiveWOAddr:
 *     type: object
 *     properties:
 *       height:
 *         type: number 
 *       amount:
 *         type: string
 */

/**
 * @swagger
 * /chain/{chain_id}/incentives:
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
 *       - incentives
 *     description: Get incentive list
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
 *                 $ref: '#/definitions/IncentiveWAddr'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  incentive.getList(chain_id, from, num)
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

function handleAccountIncentives(req, res) {
  const chain_id = res.locals.chain_id;
  const address = req.params.address;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  console.log(chain_id, address, from, num)
  incentive.getListByAddress(chain_id, address, from, num)
    .then((rows) => {
      if (rows) {
        res.status(200);
        res.send(rows);
      } else {
        res.status(404);
        res.send('not found')
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
}

/**
 * @swagger
 * /chain/{chain_id}/incentives/{address}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
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
 *       - incentives
 *     description: Get given node's incentive list
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
 *                 $ref: '#/definitions/IncentiveWOAddr'
 */
router.get('/:address([a-fA-F0-9]+)', handleAccountIncentives);

module.exports = router;
module.exports.handleAccountIncentives = handleAccountIncentives;
