/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const node = require('../models/node');

/**
 * @swagger
 * definitions:
 *   NodeId:
 *     name: node_id
 *     in: path 
 *     type: string
 *     required: true
 *   NodeInfo:
 *     type: object
 *     properties:
 *       node_id:
 *         type: string
 *       moniker:
 *         type: string
 *       val_addr:
 *         type: string
 *       latest_block_height:
 *         type: number 
 *       latest_block_time:
 *         type: string 
 *       catching_up:
 *         type: number 
 *       elapsed:
 *         type: number 
 *       timestamp:
 *         type: string
 *       uptime:
 *         type: number 
 *   NodeHistory:
 *     type: object
 *     properties:
 *       node_id:
 *         type: string
 *       moniker:
 *         type: string
 *       val_addr:
 *         type: string
 *       latest_block_height:
 *         type: number 
 *       latest_block_time:
 *         type: string 
 *       catching_up:
 *         type: number 
 *       elapsed:
 *         type: number 
 *       timestamp:
 *         type: string
 */

function dateToStr(target) {
  return target.getUTCFullYear() + '-' 
        + (target.getUTCMonth()+1) + '-'
        + target.getUTCDate() + ' '
        + target.getUTCHours() +':'
        + target.getUTCMinutes() + ':'
        + target.getUTCSeconds() + 'Z';
}

/**
 * @swagger
 * /chain/{chain_id}/nodes:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - name: range
 *       in: query
 *       description: range to query (unit seconds)
 *       schema:
 *         type: integer
 *         default: 60
 *   get:
 *     tags:
 *       - nodes
 *     description: Get node list in ascending order of node_id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Node list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/NodeInfo'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  const range = req.query.range || 60; // seconds

  const to = dateToStr(new Date());
  const from = dateToStr(new Date(Date.parse(to) - range * 1000));

  node.getList(chain_id, from, to)
    .then((row) => {
      res.status(200);
      res.send(row);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

/**
 * @swagger
 * /chain/{chain_id}/nodes/{node_id}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/NodeId'
 *   get:
 *     tags:
 *       - nodes
 *     description: Get Node info
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Node info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/NodeInfo' 
 *       404:
 *         description: not found
 *
 */
router.get('/:node_id([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const node_id = req.params.node_id;
  const range = req.query.range || 60; // seconds

  const to = dateToStr(new Date());
  const from = dateToStr(new Date(Date.parse(to) - range * 1000));

  node.getOne(chain_id, node_id, from, to)
    .then((row) => {
      if (row) {
        res.status(200);
        res.send(row);
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
 * /chain/{chain_id}/nodes/{node_id}/history:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/NodeId'
 *     - name: anchor
 *       in: query
 *       description: anchor timestamp to query ("0" value means last timestamp)
 *       schema:
 *         type: string 
 *         default: "0" 
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
 *       - nodes
 *     description: Get node history list in descending order of timestamp
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Node history list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/NodeHistory'
 */
router.get('/:node_id([a-fA-F0-9]+)/history', function(req, res) {
  const chain_id = res.locals.chain_id;
  const node_id = req.params.node_id;

  const anchor = req.query.anchor || "0";
  const from = req.query.from || 0;
  const num = req.query.num || 20;
  node.getHistory(chain_id, node_id, anchor, from, num)
    .then((row) => {
      res.status(200);
      res.send(row);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    }); 
});

module.exports = router;
