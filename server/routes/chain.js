/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();

const chain = require('../models/chain');
var genesis = require('./genesis');
var blocks = require('./blocks');
var txs = require('./txs');
var accounts = require('./accounts');
var validators = require('./validators');
var appConfig = require('./app_config');
var nodes = require('./nodes');
var drafts = require('./drafts');
var parcels = require('./parcels');
var storages = require('./storages');
var incentives = require('./incentives');
var penalties = require('./penalties');

router.use('/genesis', genesis);
router.use('/blocks', blocks);
router.use('/txs', txs);
router.use('/accounts', accounts);
router.use('/nodes', nodes);
router.use('/validators', validators);
router.use('/drafts', drafts);
router.use('/config', appConfig);
router.use('/parcels', parcels);
router.use('/storages', storages);
router.use('/incentives', incentives);
router.use('/penalties', penalties);

/**
 * @swagger
 * definitions:
 *   ChainId:
 *     name: chain_id
 *     in: path
 *     description: chain id to inspect
 *     required: true
 *     schema:
 *       type: string
 *     style: simple
 */

/**
 * @swagger
 * /chain/{chain_id}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *   get:
 *     tags:
 *       - chain
 *     description: Get chain's general stat
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: chain stat
 *       404:
 *         description: not available
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var non_empty = 'non_empty' in req.query;
  var num_blks = req.query.num_blks || 0;
  var num_txs = req.query.num_txs || 0;
  chain.getSummary(chain_id, non_empty, num_blks, num_txs)
    .then((val) => {
      res.send(val);
    })
    .catch((err) => {
      if (err == 'not found') {
        res.status(404).send('not found');
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

module.exports = router;
