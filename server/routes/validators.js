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
 *       node_id:
 *         type: string
 *       uptime:
 *         type: number
 *   DelegatorInfo:
 *     type: object
 *     properties:
 *       address:
 *         type: string
 *       delegate:
 *         type: string
 *         description: quoted decimal number
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
 * /chain/{chain_id}/validators:
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
    const range = req.query.range || 60; // seconds
    const to = dateToStr(new Date());
    const from = dateToStr(new Date(Date.parse(to) - range * 1000));
    validator.getList(chain_id, from, to)
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
  }
});

/**
 * @swagger
 * /chain/{chain_id}/validators/{address}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
 *     - name: range
 *       in: query
 *       description: range to query (unit seconds)
 *       schema:
 *         type: integer
 *         default: 60
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
 */
router.get('/:address([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const address = req.params.address;
  const range = req.query.range || 60; // seconds
  const to = dateToStr(new Date());
  const from = dateToStr(new Date(Date.parse(to) - range * 1000));
  validator.getOne(chain_id, address, from, to)
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
      if (rows) {
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
