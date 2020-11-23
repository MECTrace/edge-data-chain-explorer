/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const parcel = require('../models/parcel');
const request = require('../models/request');
const relation = require('../models/relation');

/**
 * @swagger
 * definitions:
 *   ParcelId:
 *     name: parcel_id
 *     in: path
 *     description: "parcel ID to inspect. Hexadecimal string."
 *     required: true
 *     schema:
 *       type: string
 *     style: simple
 *   ParcelInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       parcel_id:
 *         type: string
 *         description: hexadecimal string
 *       storage_id:
 *         type: integer
 *       owner:
 *         type: string
 *         description: hexadecimal string
 *       custody:
 *         type: string
 *         description: owner's key custody, hexadecimal
 *       proxy_account:
 *         type: string
 *         description: hexadecimal string or literal `null`
 *         nullable: true
 *       extra:
 *         type: string
 *         description: marshalled JSON object
 *       on_sale:
 *         type: boolean
 *   RequestInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       parcel_id:
 *         type: string
 *         description: hexadecimal string
 *       buyer:
 *         type: string
 *         description: hexadecimal string
 *       amount:
 *         type: string
 *         description: quoted decimal number
 *       dealer:
 *         type: string
 *         description: hexadecimal string
 *       dealer_fee:
 *         type: string
 *         description: quoted decimal number
 *       extra:
 *         type: string
 *         description: marshalled JSON object
 */

/**
 * @swagger
 * /chain/{chain_id}/parcels:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *   get:
 *     tags:
 *       - data trade
 *     description: Get parcel list (not sorted)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Parcel list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ParcelInfo'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  res.status(200);
  res.send([]);
});

/**
 * @swagger
 * /chain/{chain_id}/parcels/{parcel_id}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/ParcelId'
 *   get:
 *     tags:
 *       - data trade
 *     description: Get parcel info by parcel ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Parcel info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ParcelInfo'
 */
router.get('/:parcel([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  parcel.getOne(chain_id, req.params.parcel)
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
 * /chain/{chain_id}/parcels/{parcel_id}/requests:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/ParcelId'
 *   get:
 *     tags:
 *       - data trade
 *     description: Get request list by parcel ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Request list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/RequestInfo'
 */
router.get('/:parcel([a-fA-F0-9]+)/requests', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  request.getList(chain_id, req.params.parcel, from, num)
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
 * /chain/{chain_id}/parcels/{parcel_id}/history:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/ParcelId'
 *   get:
 *     tags:
 *       - data trade
 *     description: Get tx history of the parcel
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: tx history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/TxInfo'
 */
router.get('/:parcel([a-fA-F0-9]+)/history', function(req, res) {
  const chain_id = res.locals.chain_id;
  var top = req.query.top || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  relation.getParcelHistory(chain_id, req.params.parcel, top, from, num)
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
