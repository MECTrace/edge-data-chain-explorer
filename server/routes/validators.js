/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const validator = require('../models/validator');
const stat = require('../models/stat');

/**
 * @swagger
 * definitions:
 *   ValidatorInfo:
 *     type: object
 *     properties:
 *       address:
 *         type: string
 *       pubkey:
 *         type: string
 *       power:
 *         type: string
 *         description: quoted decimal number
 *       owner:
 *         type: string
 *       stake:
 *         type: string
 *         description: quoted decimal number
 *       eff_stake:
 *         type: string
 *         description: quoted decimal number
 *   DelegatorInfo:
 *     type: object
 *     properties:
 *       address:
 *         type: string
 *       delegate:
 *         type: string
 *         description: quoted decimal number
 */

/**
 * @swagger
 * /chain/{chain_id}/validators:
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
 *       - validators
 *     description: Get validator list in descending order of `eff_stake`
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Validator list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ValidatorInfo'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  if ('stat' in req.query) {
    var num_blks = req.query.num_blks || 0;
    stat.getValidatorStat(chain_id, num_blks)
      .then((row) => {
        res.status(200);
        res.send(row);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  } else {
    var from = req.query.from || 0;
    var num = req.query.num || 20;
    validator.getList(chain_id, from, num)
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
 * /chain/{chain_id}/validators/{address}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
 *   get:
 *     tags:
 *       - validators
 *     description: Get validator info by address
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Validator info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ValidatorInfo'
 *       404:
 *         description: Validator not found
 */
router.get('/:address([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  validator.getOne(chain_id, req.params.address)
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
 * /chain/{chain_id}/validators/{address}/delegators:
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
 *       - validators
 *     description: Get delegator list for this validator(delegatee)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delegator info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/DelegatorInfo'
 */
router.get('/:address([a-fA-F0-9]+)/delegators', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  validator.getDelegators(chain_id, req.params.address, from, num)
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
